import type { ActionName } from './action';
import type { HandlerType } from './controller';
import { compose, requireModule } from './utils';

/**
 * MiddlewareType can be one of:
 * - string / string[] → path to handler module(s)
 * - function / function[] → handler function(s)
 * - MiddlewareOptions / MiddlewareOptions[]
 */
export type MiddlewareType =
  | string
  | string[]
  | HandlerType
  | HandlerType[]
  | MiddlewareOptions
  | MiddlewareOptions[];

/**
 * Options when declaring middleware
 */
export interface MiddlewareOptions {
  /**
   * Only allow this middleware for the given actions.
   * Example: only apply to ['list', 'create']
   */
  only?: Array<ActionName>;

  /**
   * Exclude this middleware from the given actions.
   * Example: apply everywhere except ['delete']
   */
  except?: Array<ActionName>;

  /**
   * Handler function (or module reference) for this middleware
   */
  handler?: HandlerType | Function;

  /**
   * Arbitrary extra options (adapters can use this)
   */
  [key: string]: any;
}

/**
 * Middleware wrapper class
 * - Normalizes handler definitions
 * - Provides per-action filtering (via only/except)
 * - Allows composition of multiple middleware functions
 */
export class Middleware {
  protected options: MiddlewareOptions;
  private middlewares: HandlerType[] = [];

  constructor(options: MiddlewareOptions | Function) {
    options = requireModule(options);

    if (typeof options === 'function') {
      this.options = { handler: options };
    } else {
      this.options = options;
    }
  }

  /**
   * Get the main middleware handler, wrapped with its sub-middlewares
   */
  getHandler() {
    const handler = requireModule(this.options.handler);
    if (typeof handler !== 'function') {
      throw new Error('Middleware handler must be a function!');
    }

    // Compose main handler + any attached sub-middlewares
    return (ctx, next) => compose([handler, ...this.middlewares])(ctx, next);
  }

  /**
   * Add an extra sub-middleware to this middleware
   */
  use(middleware: HandlerType) {
    this.middlewares.push(middleware);
  }

  /**
   * Remove a previously added sub-middleware
   */
  disuse(middleware: HandlerType) {
    this.middlewares.splice(this.middlewares.indexOf(middleware), 1);
  }

  /**
   * Check if this middleware can run on a given action
   */
  canAccess(name: ActionName) {
    const { only = [], except = [] } = this.options;

    if (only.length > 0) {
      return only.includes(name);
    }
    if (except.length > 0) {
      return !except.includes(name);
    }
    return true;
  }

  /**
   * Convert various middleware definitions into Middleware instances
   */
  static toInstanceArray(middlewares: any): Middleware[] {
    if (!middlewares) {
      return [];
    }
    if (!Array.isArray(middlewares)) {
      middlewares = [middlewares];
    }

    return middlewares.map((middleware) => {
      if (middleware instanceof Middleware) {
        return middleware;
      }
      if (typeof middleware === 'object') {
        return new Middleware(middleware);
      }
      if (typeof middleware === 'function') {
        return new Middleware({ handler: middleware });
      }
    });
  }
}

export default Middleware;
