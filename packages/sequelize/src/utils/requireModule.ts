import path from "node:path";
import { pathToFileURL } from "node:url";

export function requireModule(m: any) {
	if (typeof m === "string") {
		m = require(m);
	}

	if (typeof m !== "object") {
		return m;
	}

	return m.__esModule ? m.default : m;
}

export default requireModule;

export async function importModule(m: string) {
	// Fallback to requireModule in non-test environments
	if (!(process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === "test")) {
		return requireModule(m);
	}

	if (path.isAbsolute(m)) {
		try {
			return (await import(m)).default;
		} catch {
			return (await import(pathToFileURL(m).href)).default;
		}
	}

	return (await import(m)).default;
}
