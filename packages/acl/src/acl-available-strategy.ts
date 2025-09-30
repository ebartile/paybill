import lodash from "lodash";
import { ACL } from "./acl";

export interface AvailableStrategyOptions {
	displayName?: string;
	actions?: false | string | string[];
	allowConfigure?: boolean;
}

export class ACLAvailableStrategy {
	acl: ACL;
	options: AvailableStrategyOptions;
	actionsAsObject: { [key: string]: string };
	allowConfigure: boolean;
	predicate: { own: any; all: any };

	constructor(acl: ACL, options: AvailableStrategyOptions) {
		this.acl = acl;
		this.options = options;
		this.allowConfigure = options.allowConfigure;

		this.predicate = {
			own: {
				filter: {
					createdById: this.acl.getCurrentUser(),
				},
			},
			all: {},
		};

		let actions = this.options.actions;
		if (lodash.isString(actions) && actions !== "*") {
			actions = [actions];
		}

		if (lodash.isArray(actions)) {
			this.actionsAsObject = actions.reduce((carry, action) => {
				const [actionName, predicateName] = action.split(":");
				carry[actionName] = predicateName;
				return carry;
			}, {});
		}
	}

	matchAction(actionName: string) {
		if (this.options.actions === "*") {
			return true;
		}

		if (
			Object.prototype.hasOwnProperty.call(
				this.actionsAsObject || {},
				actionName,
			)
		) {
			const predicateName = this.actionsAsObject[actionName];
			if (predicateName && this.predicate[predicateName]) {
				return lodash.cloneDeep(this.predicate[predicateName]);
			}

			return true;
		}

		return false;
	}

	allow(resourceName: string, actionName: string) {
		return this.matchAction(this.acl.resolveActionAlias(actionName));
	}
}
