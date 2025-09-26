import type { Request } from "../utils";

/**
 * Convert Fastify request to Request
 */
export function fastifyAdapter(request: any): Request {
  return {
    path: request.raw?.url?.split('?')[0] || request.routerPath || '',
    method: request.method,
    query: request.query,
    querystring: request.raw?.url?.split('?')[1] || '',
    body: request.body,
    headers: request.headers,
  };
}
