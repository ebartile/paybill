import _ from 'lodash';
import { pathToRegexp } from 'path-to-regexp';
import qs from 'qs';
import { type ResourceType } from '../resource';

/**
 * Framework-independent request shape.
 * Each adapter (Express, Koa, Fastify, etc.) should normalize their
 * request objects into this format before calling utils.
 */
export interface Request {
  path: string;
  method: string;
  query?: Record<string, any>;
  querystring?: string;
  body?: any;
  headers?: Record<string, string>;
}

export interface ParseRequest extends Request {
  namespace?: string;
  // Resource type (e.g. single, hasOne, hasMany, etc.)
  type?: ResourceType;
}

export interface ParseOptions {
  /** Optional route prefix (e.g. "/api") */
  prefix?: string;

  /** Override default action accessors */
  accessors?: {
    list?: string;
    create?: string;
    get?: string;
    update?: string;
    delete?: string;
    set?: string;
    add?: string;
    remove?: string;
  };

  /** Custom top-level resource pattern (default: "/controller") */
  basePattern?: string;
}

export interface ParsedParams {
  actionName?: string;
  resourceName?: string;
  resourceIndex?: string;
  associatedName?: string;
  associatedIndex?: string;
}

/**
 * Build a resource name string based on parsed params.
 * If there is an associated resource, return "associated.resource",
 * otherwise just return the resource name.
 */
export function getNameByParams(params: ParsedParams): string {
  const { resourceName, associatedName } = params;
  return associatedName ? `${associatedName}.${resourceName}` : resourceName!;
}

/**
 * Parse an incoming request into structured parameters:
 * - resource name
 * - action name
 * - indices (IDs)
 * - associations
 */
export function parseRequest(
  request: ParseRequest,
  options: ParseOptions = {},
): ParsedParams | false {
  const accessors = {
    // Standard CRUD actions
    list: 'list',
    create: 'create',
    get: 'get',
    update: 'update',
    delete: 'destroy',
    // Association actions
    add: 'add',
    set: 'set',
    remove: 'remove',
    ...(options.accessors || {}),
  };

  const keys: any[] = [];

  // Allow custom base pattern, fallback to /controller
  const basePattern = options.basePattern || '/controller';
  const regexp = pathToRegexp(`${basePattern}/:rest(.*)`, keys);
  const reqPath = decodeURI(request.path);
  const matches = regexp.exec(reqPath);

  if (matches) {
    const params: ParsedParams = {};
    const [resource, action] = matches[1].split(':');
    const [res1, res2] = resource.split('.');
    if (res1) {
      if (res2) {
        params.associatedName = res1;
        params.resourceName = res2;
      } else {
        params.resourceName = res1;
      }
    }
    if (action) {
      params.actionName = action;
    }
    return params;
  }

  /**
   * Default RESTful patterns for different relationship types
   */
  const defaults = {
    single: {
      '/:resourceName': {
        get: accessors.list,
        post: accessors.create,
        delete: accessors.delete,
      },
      '/:resourceName/:resourceIndex': {
        get: accessors.get,
        put: accessors.update,
        patch: accessors.update,
        delete: accessors.delete,
      },
      '/:associatedName/:associatedIndex/:resourceName': {
        get: accessors.list,
        post: accessors.create,
        delete: accessors.delete,
      },
      '/:associatedName/:associatedIndex/:resourceName/:resourceIndex': {
        get: accessors.get,
        post: accessors.create,
        put: accessors.update,
        patch: accessors.update,
        delete: accessors.delete,
      },
    },
    hasOne: {
      '/:associatedName/:associatedIndex/:resourceName': {
        get: accessors.get,
        post: accessors.update,
        put: accessors.update,
        patch: accessors.update,
        delete: accessors.delete,
      },
    },
    hasMany: {
      '/:associatedName/:associatedIndex/:resourceName': {
        get: accessors.list,
        post: accessors.create,
        delete: accessors.delete,
      },
      '/:associatedName/:associatedIndex/:resourceName/:resourceIndex': {
        get: accessors.get,
        post: accessors.create,
        put: accessors.update,
        patch: accessors.update,
        delete: accessors.delete,
      },
    },
    belongsTo: {
      '/:associatedName/:associatedIndex/:resourceName': {
        get: accessors.get,
        delete: accessors.remove,
      },
      '/:associatedName/:associatedIndex/:resourceName/:resourceIndex': {
        post: accessors.set,
      },
    },
    belongsToMany: {
      '/:associatedName/:associatedIndex/:resourceName': {
        get: accessors.list,
        post: accessors.set,
      },
      '/:associatedName/:associatedIndex/:resourceName/:resourceIndex': {
        get: accessors.get,
        post: accessors.add,
        put: accessors.update,   // Many-to-Many update (through table)
        patch: accessors.update, // Many-to-Many update (through table)
        delete: accessors.remove,
      },
    },
    set: {
      '/:associatedName/:associatedIndex/:resourceName': {
        get: accessors.list,
        post: accessors.add,
        delete: accessors.remove,
      },
    },
  };

  const params: ParsedParams = {};

  // Handle optional prefix, ensure it starts with a slash
  let prefix = (options.prefix || '').trim().replace(/\/$/, '');
  if (prefix && !prefix.startsWith('/')) {
    prefix = `/${prefix}`;
  }

  const { type = 'single' } = request;

  // Match request path against default patterns
  for (const path in defaults[type]) {
    const keys: any[] = [];
    const regexp = pathToRegexp(`${prefix}${path}`, keys, {});
    const matches = regexp.exec(reqPath);
    if (!matches) {
      continue;
    }
    keys.forEach((obj, index) => {
      if (matches[index + 1] === undefined) {
        return;
      }
      (params as any)[obj.name] = matches[index + 1];
    });
    params.actionName = _.get(defaults, [type, path, request.method.toLowerCase()]);
  }

  if (Object.keys(params).length === 0) {
    return false;
  }

  // Handle resourceName with embedded action, e.g. "users:create"
  if (params.resourceName) {
    const [resourceName, actionName] = params.resourceName.split(':');
    if (actionName) {
      params.resourceName = resourceName;
      params.actionName = actionName;
    }
  }

  // Decode associated index (e.g. IDs containing special characters)
  if (params.associatedIndex) {
    params.associatedIndex = decodeURIComponent(params.associatedIndex);
  }

  return params;
}

/**
 * Parse a query string or object into a normalized object.
 * - Accepts raw querystring or already-parsed object
 * - Uses qs for more advanced parsing than native URLSearchParams
 * - Supports null handling
 * - Supports JSON-encoded filters
 */
export function parseQuery(input: string | Record<string, any>): any {
  let query: any = {};

  if (typeof input === 'string') {
    query = qs.parse(input, { strictNullHandling: true });
  } else {
    query = input || {};
  }

  if (typeof query.filter === 'string') {
    try {
      query.filter = JSON.parse(query.filter);
    } catch {
      // ignore invalid JSON
    }
  }

  return query;
}

/**
 * Normalize fields input into a structured object:
 * - Supports string ("a,b,c"), array, or object formats
 * - Returns object with only/except/appends arrays
 */
export function parseFields(fields: any) {
  if (!fields) {
    return {};
  }
  if (typeof fields === 'string') {
    fields = fields.split(',').map((field) => field.trim());
  }
  if (Array.isArray(fields)) {
    const onlyFields: string[] = [];
    const output: any = {};
    fields.forEach((item) => {
      if (typeof item === 'string') {
        onlyFields.push(item);
      } else if (typeof item === 'object') {
        if (item.only) {
          onlyFields.push(...item.only.toString().split(','));
        }
        Object.assign(output, parseFields(item));
      }
    });
    if (onlyFields.length) {
      output.only = onlyFields;
    }
    return output;
  }
  if (fields.only && typeof fields.only === 'string') {
    fields.only = fields.only.split(',').map((field) => field.trim());
  }
  if (fields.except && typeof fields.except === 'string') {
    fields.except = fields.except.split(',').map((field) => field.trim());
  }
  if (fields.appends && typeof fields.appends === 'string') {
    fields.appends = fields.appends.split(',').map((field) => field.trim());
  }
  return fields;
}

/**
 * Merge backend default field config with frontend input:
 * - Handles only/except priority
 * - Merges appends
 */
export function mergeFields(defaults: any, inputs: any) {
  let fields: any = {};
  defaults = parseFields(defaults);
  inputs = parseFields(inputs);

  if (inputs.only) {
    // If client provides "only"
    if (defaults.only) {
      fields.only = defaults.only.filter((field: string) => inputs.only.includes(field));
    } else if (defaults.except) {
      fields.only = inputs.only.filter((field: string) => !defaults.except.includes(field));
    } else {
      fields.only = inputs.only;
    }
  } else if (inputs.except) {
    // If client provides "except"
    if (defaults.only) {
      fields.only = defaults.only.filter((field: string) => !inputs.except.includes(field));
    } else {
      fields.except = _.uniq([...(inputs.except || []), ...(defaults.except || [])]);
    }
  } else {
    // If client provides neither, fall back to defaults
    fields = defaults;
  }

  // Merge appends
  if (!_.isEmpty(inputs.appends)) {
    fields.appends = _.uniq([...(inputs.appends || []), ...(defaults.appends || [])]);
  }
  if (!fields.appends) {
    fields.appends = [];
  }
  return fields;
}
