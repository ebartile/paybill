export interface AvailableActionOptions {
	type?: "new-data" | "old-data";
	displayName?: string;
	aliases?: string[] | string;
	resource?: string;
	onNewRecord?: boolean;
	allowConfigureFields?: boolean;
}

export class ACLAvailableAction {
	public name: string;
	public options: AvailableActionOptions;

	constructor(name: string, options: AvailableActionOptions) {
		this.name = name;
		this.options = options;
	}
}
