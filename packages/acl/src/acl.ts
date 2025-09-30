import EventEmitter from "events";
import lodash from "lodash";
import {
	ACLAvailableAction,
	type AvailableActionOptions,
} from "./acl-available-action";
import {
	ACLAvailableStrategy,
	type AvailableStrategyOptions,
} from "./acl-available-strategy";
import {
	ACLRole,
	type ResourceActionsOptions,
	type RoleActionParams,
} from "./acl-role";
import { AllowManager, type ConditionFunc } from "./allow-manager";
import { FixedParamsManager, type Merger } from "./fixed-params-manager";
import { SnippetManager, type SnippetOptions } from "./snippet-manager";
import { assign, mergeAclActionParams, removeEmptyParams } from "./utils";

interface CanResult {
	role: string;
	resource: string;
	action: any;
	params?: any;
}

export interface DefineOptions {
	role: string;
	/**
	 * @internal
	 */
	allowConfigure?: boolean;
	strategy?: string | AvailableStrategyOptions;
	actions?: ResourceActionsOptions;
	/**
	 * @internal
	 */
	routes?: any;
	snippets?: string[];
}

export interface ListenerContext {
	acl: ACL;
	role: ACLRole;
	path: string;
	actionName: string;
	resourceName: string;
	params: RoleActionParams;
}

type Listener = (ctx: ListenerContext) => void;

interface CanArgs {
	role?: string;
	resource: string;
	action: string;
	rawResourceName?: string;
	ctx?: any;
	roles?: string[];
}

export class ACL extends EventEmitter {
	/**
	 * @internal
	 */
	public availableStrategy = new Map<string, ACLAvailableStrategy>();

	/**
	 * @internal
	 */
	public allowManager = new AllowManager(this);

	/**
	 * @internal
	 */
	public snippetManager = new SnippetManager();

	/**
	 * @internal
	 */
	roles = new Map<string, ACLRole>();

	/**
	 * @internal
	 */
	actionAlias = new Map<string, string>();

	protected availableActions = new Map<string, ACLAvailableAction>();

	protected fixedParamsManager = new FixedParamsManager();

	protected strategyResources: Set<string> | null = null;

	public state?: { currentRole?: any; currentUser?: any };

	constructor(state?: { currentRole?: any; currentUser?: any }) {
		super();
		this.state = state;

		this.beforeGrantAction((ctx) => {
			if (lodash.isPlainObject(ctx.params) && ctx.params.own) {
				ctx.params = lodash.merge(ctx.params, {
					filter: { createdById: this.getCurrentUser() },
				});
			}
		});

		this.beforeGrantAction((ctx) => {
			const actionName = this.resolveActionAlias(ctx.actionName);

			if (lodash.isPlainObject(ctx.params)) {
				if (
					(actionName === "create" || actionName === "update") &&
					ctx.params.fields
				) {
					ctx.params = {
						...lodash.omit(ctx.params, "fields"),
						whitelist: ctx.params.fields,
					};
				}
			}
		});
	}

	setStrategyResources(resources: Array<string> | null) {
		this.strategyResources = new Set(resources);
	}

	getStrategyResources() {
		return this.strategyResources ? [...this.strategyResources] : null;
	}

	appendStrategyResource(resource: string) {
		if (!this.strategyResources) {
			this.strategyResources = new Set();
		}
		this.strategyResources.add(resource);
	}

	removeStrategyResource(resource: string) {
		this.strategyResources.delete(resource);
	}

	define(options: DefineOptions): ACLRole {
		const roleName = options.role;
		const role = new ACLRole(this, roleName);

		if (options.strategy) {
			role.strategy = options.strategy;
		}

		const actions = options.actions || {};

		for (const [actionName, actionParams] of Object.entries(actions)) {
			role.grantAction(actionName, actionParams);
		}

		this.roles.set(roleName, role);

		return role;
	}

	getRole(name: string): ACLRole {
		return this.roles.get(name);
	}

	getRoles(names: string[]): ACLRole[] {
		return names.map((name) => this.getRole(name)).filter((x) => Boolean(x));
	}

	removeRole(name: string) {
		return this.roles.delete(name);
	}

	setAvailableAction(name: string, options: AvailableActionOptions = {}) {
		this.availableActions.set(name, new ACLAvailableAction(name, options));

		if (options.aliases) {
			const aliases = lodash.isArray(options.aliases)
				? options.aliases
				: [options.aliases];
			for (const alias of aliases) {
				this.actionAlias.set(alias, name);
			}
		}
	}

	getAvailableAction(name: string) {
		const actionName = this.actionAlias.get(name) || name;
		return this.availableActions.get(actionName);
	}

	getAvailableActions() {
		return this.availableActions;
	}

	setAvailableStrategy(name: string, options: AvailableStrategyOptions) {
		this.availableStrategy.set(name, new ACLAvailableStrategy(this, options));
	}

	beforeGrantAction(listener?: Listener) {
		this.addListener("beforeGrantAction", listener);
	}

	can(options: CanArgs): CanResult | null {
		if (options.role) {
			return lodash.cloneDeep(this.getCanByRole(options));
		}
		if (options.roles?.length) {
			if (options.roles.includes("root")) {
				options.roles = ["root"];
			}
			return lodash.cloneDeep(this.getCanByRoles(options));
		}

		return null;
	}

	private getCanByRoles(options: CanArgs) {
		let canResult: CanResult | null = null;

		for (const role of options.roles) {
			const result = this.getCanByRole({
				role,
				...options,
			});
			if (!canResult) {
				canResult = result;
				canResult && removeEmptyParams(canResult.params);
			} else if (canResult && result) {
				canResult.params = mergeAclActionParams(
					canResult.params,
					result.params,
				);
			}
		}

		return canResult;
	}

	private getCanByRole(options: CanArgs) {
		const { role, resource, action, rawResourceName } = options;
		const aclRole = this.roles.get(role);

		if (!aclRole) {
			return null;
		}

		const actionPath = `${rawResourceName ? rawResourceName : resource}:${action}`;
		const snippetAllowed = aclRole.snippetAllowed(actionPath);

		const fixedParams = this.fixedParamsManager.getParams(
			rawResourceName ? rawResourceName : resource,
			action,
		);

		const mergeParams = (result: CanResult) => {
			const params = result["params"] || {};

			const mergedParams = assign(params, fixedParams);

			if (Object.keys(mergedParams).length) {
				result["params"] = mergedParams;
			} else {
				delete result["params"];
			}

			return result;
		};

		const aclResource = aclRole.getResource(resource);

		if (aclResource) {
			const actionParams = aclResource.getAction(action);

			if (actionParams) {
				// handle single action config
				return mergeParams({
					role,
					resource,
					action,
					params: actionParams,
				});
			} else {
				return null;
			}
		}

		const roleStrategy = aclRole.getStrategy();

		if (!roleStrategy && !snippetAllowed) {
			return null;
		}

		let roleStrategyParams;

		if (
			this.strategyResources === null ||
			this.strategyResources.has(resource)
		) {
			roleStrategyParams = roleStrategy?.allow(
				resource,
				this.resolveActionAlias(action),
			);
		}

		if (!roleStrategyParams && snippetAllowed) {
			roleStrategyParams = {};
		}

		if (roleStrategyParams) {
			const result = { role, resource, action, params: {} };

			if (lodash.isPlainObject(roleStrategyParams)) {
				result["params"] = roleStrategyParams;
			}

			return mergeParams(result);
		}

		return null;
	}

	/**
	 * @internal
	 */
	public resolveActionAlias(action: string) {
		return this.actionAlias.get(action) ? this.actionAlias.get(action) : action;
	}

	allow(
		resourceName: string,
		actionNames: string[] | string,
		condition?: string | ConditionFunc,
	) {
		return this.skip(resourceName, actionNames, condition);
	}

	skip(
		resourceName: string,
		actionNames: string[] | string,
		condition?: string | ConditionFunc,
	) {
		if (!Array.isArray(actionNames)) {
			actionNames = [actionNames];
		}

		for (const actionName of actionNames) {
			this.allowManager.allow(resourceName, actionName, condition);
		}
	}

	addFixedParams(resource: string, action: string, merger: Merger) {
		this.fixedParamsManager.addParams(resource, action, merger);
	}

	registerSnippet(snippet: SnippetOptions) {
		this.snippetManager.register(snippet);
	}

	protected isAvailableAction(actionName: string) {
		return this.availableActions.has(this.resolveActionAlias(actionName));
	}

	getCurrentUser() {
		return this.state?.currentUser ?? undefined;
	}

	// Setter for currentUser
	setCurrentUser(user: any) {
		if (!this.state) this.state = {};
		this.state.currentUser = user;
	}

	// Getter for currentRole
	getCurrentRole() {
		return this.state?.currentRole ?? "guest";
	}

	// Setter for currentRole
	setCurrentRole(role: any) {
		if (!this.state) this.state = {};
		this.state.currentRole = role;
	}
}
