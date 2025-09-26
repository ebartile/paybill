import _ from 'lodash';
import Middleware, { type MiddlewareType } from './middleware';
import Resource from './resource';
import { type HandlerType } from './controller';
import { assign, compose, requireModule, type MergeStrategies } from './utils';

/**
 * Action type can be:
 * - string (handler path / module name)
 * - function (handler)
 * - ActionOptions (detailed config)
 */
export type ActionType = string | HandlerType | ActionOptions;

/**
 * Default built-in actions
 */
export type DefaultActionType =
  | 'list'
  | 'create'
  | 'get'
  | 'update'
  | 'destroy'
  | 'set'
  | 'add'
  | 'remove';

/**
 * Action names can be default ones or custom strings
 */
export type ActionName = DefaultActionType | Omit<string, DefaultActionType>;

/**
 * Context object passed into every action/middleware.
 * It is framework-agnostic and can hold any data
 * (request, response, logger, etc. depending on the adapter).
 */
export interface ActionContext {
  action?: Action;
  [key: string]: any; // adapters extend this freely
}

/**
 * Options for selecting fields
 */
export type FieldsOptions =
  | string[]
  | {
      only?: string[];
      appends?: string[];
    }
  | {
      except?: string[];
      appends?: string[];
    };

/**
 * Function form of fields option
 */
export type FieldsOptionsFn = (ctx: ActionContext) => FieldsOptions | Promise<FieldsOptions>;

/**
 * Filter options for queries
 */
export interface FilterOptions {
  [key: string]: any;
}

/**
 * Function form of filter option
 */
export type FilterOptionsFn = (ctx: ActionContext) => FilterOptions | Promise<FieldsOptions>;

/**
 * Function for computing action params dynamically
 */
export type ParamsCallback = (ctx: ActionContext) => ActionParams | Promise<ActionParams>;

/**
 * Options provided when defining an Action
 */
export interface ActionOptions {
  values?: any;
  fields?: string[];
  appends?: string[];
  except?: string[];
  whitelist?: string[];
  blacklist?: string[];
  filter?: FilterOptions;
  sort?: string[];
  page?: number;
  pageSize?: number;
  maxPageSize?: number;
  middleware?: MiddlewareType;
  middlewares?: MiddlewareType;
  handler?: HandlerType;
  [key: string]: any;
}

/**
 * Parameters merged from:
 * - ActionOptions (developer config)
 * - client request params
 */
export interface ActionParams {
  filterByTk?: any;

  /**
   * Field selection
   */
  fields?: string[];
  appends?: string[];
  except?: string[];
  whitelist?: string[];
  blacklist?: string[];

  /**
   * Filtering and sorting
   */
  filter?: FilterOptions;
  sort?: string[];

  /**
   * Pagination
   */
  page?: number;
  pageSize?: number;

  /**
   * Data payload (defaults to options.values + request body)
   */
  values?: any;

  /**
   * Custom extensions
   */
  [key: string]: any;
}


/**
 * Action represents a single API operation on a Resource
 */
export class Action {
  protected handler: any;
  protected resource: Resource;
  protected name: ActionName;
  protected options: ActionOptions;
  protected context: ActionContext = {};
  public params: ActionParams = {};
  public actionName: string;
  public resourceName: string;
  public sourceId: any;
  public readonly middlewares: Array<Middleware> = [];

  constructor(options: ActionOptions) {
    options = requireModule(options);
    if (typeof options === 'function') {
      options = { handler: options };
    }

    const { middleware, middlewares = [], handler, ...params } = options;

    // normalize middlewares
    this.middlewares = Middleware.toInstanceArray(middleware || middlewares);

    this.handler = handler;
    this.options = options;

    // merge remaining options into params
    this.mergeParams(params);
  }

  /**
   * Return plain object representation of this action
   */
  toJSON() {
    return {
      actionName: this.actionName,
      resourceName: this.resourceName,
      resourceOf: this.sourceId,
      sourceId: this.sourceId,
      params: this.params,
    };
  }

  /**
   * Deep clone action (without mutating the original)
   */
  clone() {
    const options = _.cloneDeep(this.options);
    delete options.middleware;
    delete options.middlewares;
    const action = new Action(options);
    action.setName(this.name);
    action.setResource(this.resource);
    action.middlewares.push(...this.middlewares);
    return action;
  }

  /**
   * Set execution context (usually provided by adapter)
   */
  setContext(context: ActionContext) {
    this.context = context;
  }

  /**
   * Merge new params into existing ones with strategies
   */
  mergeParams(params: ActionParams, strategies: MergeStrategies = {}) {
    if (!this.params) {
      this.params = {};
    }
    if (!params) {
      return;
    }

    assign(this.params, params, {
      filter: 'andMerge',
      fields: 'intersect',
      appends: 'union',
      except: 'union',
      whitelist: 'intersect',
      blacklist: 'intersect',
      sort: 'overwrite',
      ...strategies,
    });
  }

  setResource(resource: Resource) {
    this.resource = resource;
    return this;
  }

  getResource() {
    return this.resource;
  }

  getOptions(): ActionOptions {
    return this.options;
  }

  setName(name: ActionName) {
    this.name = name;
    return this;
  }

  getName() {
    return this.name;
  }

  /**
   * Get middleware functions for this action
   */
  getMiddlewareHandlers() {
    return this.middlewares
      .filter((middleware) => middleware.canAccess(this.name))
      .map((middleware) => middleware.getHandler());
  }

  /**
   * Get the final handler function for this action
   */
  getHandler() {
    const handler = requireModule(
      this.handler || this.resource.controller.getRegisteredHandler(this.name),
    );
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function!');
    }
    return handler;
  }

  /**
   * Get the full handler chain: global middlewares + resource middlewares + action handler
   */
  getHandlers() {
    const handlers = [
      ...this.resource.controller.getMiddlewares(),
      ...this.getMiddlewareHandlers(),
      this.getHandler(),
    ].filter(Boolean);

    return handlers.map((fn) => this.wrapMiddlewareWithLogging(fn));
  }

  /**
   * Wrap middleware with optional logger support
   */
  wrapMiddlewareWithLogging(fn, logger?) {
    if (process.env['LOGGER_LEVEL'] !== 'trace') {
      return fn;
    }

    const name = fn.name || fn.toString().slice(0, 100);

    return async (ctx, next) => {
      const reqId = ctx.reqId;

      if (!logger && !ctx.logger) {
        return await fn(ctx, next);
      }

      if (!logger && ctx.logger) {
        logger = ctx.logger;
      }

      logger.trace(`--> Entering middleware: ${name}`, { reqId });

      const start = Date.now();

      await fn(ctx, async () => {
        const beforeNext = Date.now();
        logger.trace(`--> Before next middleware: ${name} - ${beforeNext - start}ms`, { reqId });

        await next();

        const afterNext = Date.now();
        logger.trace(`<-- After next middleware: ${name} - ${afterNext - beforeNext}ms`, { reqId });
      });

      const ms = Date.now() - start;
      logger.trace(`<-- Exiting middleware: ${name} - ${ms}ms`, { reqId });
    };
  }

  /**
   * Execute this action with given context and optional `next`
   * (framework adapters supply ctx + next)
   */
  async execute(context: ActionContext, next: () => Promise<void> = async () => {}) {
    return await compose(this.getHandlers())(context, next);
  }

  /**
   * Convert object of actions to a Map of Action instances
   */
  static toInstanceMap(actions: object, resource?: Resource) {
    return new Map(
      Object.entries(actions).map(([key, options]) => {
        let action: Action;
        if (options instanceof Action) {
          action = options;
        } else {
          action = new Action(options);
        }
        action.setName(key);
        action.setResource(resource);
        resource && action.middlewares.unshift(...resource.middlewares);
        return [key, action];
      }),
    );
  }
}

export default Action;
