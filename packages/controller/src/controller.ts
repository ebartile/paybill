import _ from 'lodash';
import { pathToRegexp } from 'path-to-regexp';
import glob from 'glob';

import Action, { type ActionName } from './action';
import {
  compose,
  getNameByParams,
  importModule,
  type ParsedParams,
  parseQuery,
  parseRequest,
  type Request,
  Toposort,
  type ToposortOptions,
} from './utils';
import { Resource, type ResourceOptions } from './resource';

// Framework-independent context
export interface ControllerContext {
  controller?: Controller;
  action?: Action;
  request?: Request;
  [key: string]: any;
}

// Options for building middleware
export interface IMiddlewareOptions {
  skipIfDataSourceExists?: boolean;
  prefix?: string;
  nameRule?: (params: ParsedParams) => string;
  accessors?: {
    list?: string;
    create?: string;
    get?: string;
    update?: string;
    delete?: string;
  };
}

export interface ControllerOptions {
  prefix?: string;
  accessors?: {
    list?: string;
    create?: string;
    get?: string;
    update?: string;
    delete?: string;
  };
  logger?: Logger;
}

export interface ExecuteOptions {
  resource: string;
  action: ActionName;
}

export type HandlerType = (ctx: ControllerContext, next: () => Promise<any>) => any;

export interface Handlers {
  [key: string]: HandlerType;
}

export interface ImportOptions {
  directory: string;
  extensions?: string[];
}

// Logging abstraction
export interface Logger {
  error?: (...args: any[]) => void;
  trace?: (...args: any[]) => void;
}

// File loading abstraction
export interface FileLoader {
  loadFiles(pattern: string): Promise<string[]>;
}

export class NodeFileLoader implements FileLoader {
  async loadFiles(pattern: string): Promise<string[]> {
    return glob.sync(pattern, { ignore: ['**/*.d.ts'] });
  }
}

export class Controller {
  public readonly options: ControllerOptions;
  protected resources = new Map<string, Resource>();
  protected actionHandlers = new Map<ActionName, HandlerType>();
  protected middlewares: Toposort<any>;

  constructor(options: ControllerOptions = {}, private fileLoader: FileLoader = new NodeFileLoader(),) {
    this.options = options;
    this.middlewares = new Toposort<any>();
  }

  /**
   * Import resource configs from a directory
   */
  public async import(options: ImportOptions): Promise<Map<string, Resource>> {
    const { extensions = ['js', 'ts', 'json'], directory } = options;
    const pattern = `${directory}/*.{${extensions.join(',')}}`;
    const files = await this.fileLoader!.loadFiles(pattern);

    const resources = new Map<string, Resource>();
    for (const file of files) {
      const mod = await importModule(file);
      const resource = this.define(typeof mod === 'function' ? mod(this) : mod);
      resources.set(resource.getName(), resource);
    }
    return resources;
  }

  define(options: ResourceOptions) {
    const { name } = options;
    const resource = new Resource(options, this);
    this.resources.set(name, resource);
    return resource;
  }

  isDefined(name: string) {
    return this.resources.has(name);
  }

  removeResource(name: string) {
    return this.resources.delete(name);
  }

  registerActionHandlers(handlers: Handlers) {
    for (const [name, handler] of Object.entries(handlers)) {
      this.registerActionHandler(name, handler);
    }
  }

  registerActionHandler(name: ActionName, handler: HandlerType) {
    this.actionHandlers.set(name, handler);
  }

  getRegisteredHandler(name: ActionName) {
    return this.actionHandlers.get(name);
  }

  getRegisteredHandlers() {
    return this.actionHandlers;
  }

  getResource(name: string): Resource {
    if (!this.resources.has(name)) {
      throw new Error(`${name} resource does not exist`);
    }
    return this.resources.get(name)!;
  }

  getAction(name: string, action: ActionName): Action {
    if (this.actionHandlers.has(`${name}:${action}`)) {
      return this.getResource(name).getAction(`${name}:${action}`);
    }
    return this.getResource(name).getAction(action);
  }

  getMiddlewares() {
    return this.middlewares.nodes;
  }

  use(middlewares: HandlerType | HandlerType[], options: ToposortOptions = {}) {
    this.middlewares.add(middlewares, options);
  }

  middleware({ prefix, accessors, skipIfDataSourceExists = false }: IMiddlewareOptions = {}) {
    const self = this;

    return async function controllerMiddleware(ctx: ControllerContext, next: () => Promise<any>) {
      if (skipIfDataSourceExists) {
        const dataSource = ctx.request?.headers?.['x-data-source'];
        if (dataSource) {
          return next();
        }
      }

      ctx.controller = self;

      let params = parseRequest(
        {
          path: ctx.request?.path || '',
          method: ctx.request?.method || 'GET',
        },
        {
          prefix: self.options.prefix || prefix,
          accessors: self.options.accessors || accessors,
        },
      );

      if (!params) {
        return next();
      }

      try {
        const resource = self.getResource(getNameByParams(params));

        if (resource.options.type && resource.options.type !== 'single') {
          params = parseRequest(
            {
              path: ctx.request?.path || '',
              method: ctx.request?.method || 'GET',
              type: resource.options.type,
            },
            {
              prefix: self.options.prefix || prefix,
              accessors: self.options.accessors || accessors,
            },
          );

          if (!params) {
            return next();
          }
        }

        ctx.action = self.getAction(getNameByParams(params), params.actionName).clone();
        ctx.action.setContext(ctx);
        ctx.action.actionName = params.actionName;
        ctx.action.sourceId = params.associatedIndex;
        ctx.action.resourceName = params.associatedName
          ? `${params.associatedName}.${params.resourceName}`
          : params.resourceName;
        ctx.action.params.filterByTk = params.resourceIndex;

        const query = parseQuery(ctx.request?.querystring || '');
        if (pathToRegexp('/controller/:rest(.*)').test(ctx.request?.path || '')) {
          ctx.action.mergeParams({
            ...query,
            ...params,
            ...(ctx.request?.body || {}),
          });
        } else {
          ctx.action.mergeParams({
            ...query,
            ...params,
            values: ctx.request?.body,
          });
        }

        return compose(ctx.action.getHandlers())(ctx, next);
      } catch (error) {
        self.options.logger?.error?.(error);
        return next();
      }
    };
  }

  async execute(options: ExecuteOptions, context: ControllerContext = {
      request: undefined
  }, next?: any) {
    const { resource, action } = options;
    context.controller = this;
    context.action = this.getAction(resource, action);
    return await context.action.execute(context, next);
  }
}

export default Controller;
