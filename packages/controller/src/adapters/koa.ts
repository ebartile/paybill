import type { Request } from "../utils";

/**
 * Convert Koa ctx to Request
 */
export function koaAdapter(ctx: any): Request {
	return {
		path: ctx.path,
		method: ctx.method,
		query: ctx.query,
		querystring: ctx.querystring,
		body: ctx.request?.body,
		headers: ctx.headers,
	};
}
