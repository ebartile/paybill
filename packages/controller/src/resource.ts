import _ from 'lodash';
import Action, { type ActionName, type ActionType } from './action';
import Middleware, { type MiddlewareType } from './middleware';
import { Controller, type HandlerType } from './controller';

/**
 * Possible resource types
 */
export type ResourceType =
  | 'single'
  | 'hasOne'
  | 'hasMany'
  | 'belongsTo'
  | 'belongsToMany';

export interface ResourceOptions {
  /** Resource name */
  name: string;

  /** Resource type, defaults to `single` */
  type?: ResourceType;

  /** Custom actions for this resource */
  actions?: {
    [key: string]: ActionType;
  };

  /** Whitelist of allowed actions (default: list, get, create, update, delete) */
  only?: Array<ActionName>;

  /** Blacklist of disallowed actions (default: list, get, create, update, delete) */
  except?: Array<ActionName>;

  /** Middleware(s) applied to all actions of this resource */
  middleware?: MiddlewareType;

  /** Alias for middleware (alternative property) */
  middlewares?: MiddlewareType;

  /** Any additional configuration */
  [key: string]: any;
}

export class Resource {
  /** Owning Controller */
  public readonly controller: Controller;

  /** Middlewares that apply to all actions of this resource */
  public readonly middlewares: Middleware[];

  /** Map of action name → Action instance */
  public readonly actions = new Map<ActionName, Action>();

  /** Original resource options */
  public readonly options: ResourceOptions;

  /** Actions excluded from this resource */
  public readonly except: Array<ActionName>;

  constructor(options: ResourceOptions, controller: Controller) {
    const {
      middleware,
      middlewares,
      actions = {},
      only = [],
      except = [],
    } = options;

    this.options = options;
    this.controller = controller;

    // Convert any middleware definitions into Middleware instances
    this.middlewares = Middleware.toInstanceArray(middleware || middlewares);

    // Merge global action handlers registered in the Controller
    for (const [name, handler] of controller.getRegisteredHandlers()) {
      if (!actions[name as string]) {
        actions[name as string] = handler;
      }
    }

    let excludes: ActionName[] = [];
    if (except.length > 0) {
        excludes = except;
    } else if (only.length > 0) {
        excludes = Object.keys(actions).filter((name) =>
            !only.includes(name as ActionName),
        ) as ActionName[];
    }

    this.except = excludes;

    // Build the Action map, excluding disallowed actions
    this.actions = Action.toInstanceMap(_.omit(actions, excludes as string[]), this,);
  }

  /** Get the resource's name */
  getName() {
    return this.options.name;
  }

  /** Get the list of excluded actions */
  getExcept() {
    return this.except;
  }

  /**
   * Add a new action dynamically
   */
  addAction(name: ActionName, handler: HandlerType) {
    if (this.except.includes(name)) {
      throw new Error(`${name} action is not allowed`);
    }
    if (this.actions.has(name)) {
      throw new Error(`${name} action already exists`);
    }

    const action = new Action(handler);
    action.setName(name);
    action.setResource(this);

    // Attach resource-level middlewares to the action
    action.middlewares.unshift(...this.middlewares);

    this.actions.set(name, action);
  }

  /**
   * Retrieve an action by name
   */
  getAction(action: ActionName) {
    if (this.except.includes(action)) {
      throw new Error(`${action} action is not allowed`);
    }
    if (!this.actions.has(action)) {
      throw new Error(`${action} action does not exist`);
    }
    return this.actions.get(action)!;
  }
}

export default Resource;
