import type { Request } from "../utils";

/**
 * Convert Hapi request to Request
 */
export function hapiAdapter(request: any): Request {
  return {
    path: request.path,
    method: request.method,
    query: request.query,
    querystring: request.raw.req.url.split('?')[1] || '',
    body: request.payload,
    headers: request.headers,
  };
}
