import type { Request } from "../utils";

/**
 * Convert Express req to Request
 */
export function expressAdapter(req: any): Request {
	return {
		path: req.path,
		method: req.method,
		query: req.query,
		querystring: req.originalUrl?.split("?")[1] || "",
		body: req.body,
		headers: req.headers,
	};
}
