import { BaseInterface } from "./interfaces/base-interface";

export class InterfaceManager {
	interfaceTypes: Map<string, new (options) => BaseInterface> = new Map();

	registerInterfaceType(name, iface) {
		this.interfaceTypes.set(name, iface);
	}

	getInterfaceType(name): new (options) => BaseInterface {
		return this.interfaceTypes.get(name);
	}
}
