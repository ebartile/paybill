import { EventEmitter } from "node:events";

export interface Emitter {
	emitAsync(event: string | symbol, ...args: any[]): Promise<boolean>;
}

export class AsyncEmitter extends EventEmitter implements Emitter {
	async emitAsync(event: string | symbol, ...args: any[]): Promise<boolean> {
		const listeners = this.listeners(event);
		if (!listeners.length) return false;

		// Sequentially await all listeners
		for (const listener of listeners) {
			const result = listener.apply(this, args);
			if (result instanceof Promise) {
				await result;
			}
		}

		return true;
	}
}
