import lodash from "lodash";
import { ACLRole } from "../acl-role";
import { assign } from "./assign";

export function mergeRole(roles: ACLRole[]) {
	const result: Record<string, any> = {
		roles: [],
		strategy: {},
		actions: null,
		snippets: [],
		resources: null,
	};
	const allSnippets: string[][] = [];
	for (const role of roles) {
		const jsonRole = role.toJSON();
		result.roles = mergeRoleNames(result.roles, jsonRole.role);
		result.strategy = mergeRoleStrategy(result.strategy, jsonRole.strategy);
		result.actions = mergeRoleActions(result.actions, jsonRole.actions);
		result.resources = mergeRoleResources(result.resources, [
			...role.resources.keys(),
		]);
		if (lodash.isArray(jsonRole.snippets)) {
			allSnippets.push(jsonRole.snippets);
		}
	}
	result.snippets = mergeRoleSnippets(allSnippets);
	adjustActionByStrategy(roles, result);
	return result;
}

/**
 * When merging permissions from multiple roles, if strategy.actions allows certain actions, then those actions have higher priority.
 * For example, [
 * {
 *  actions: {
 *    'users:view': {...},
 *    'users:create': {...}
 *  },
 *  strategy: {
 *    actions: ['view']
 *  }
 * }]
 * finally result: [{
 *  actions: {
 *    'users:create': {...},
 *    'users:view': {} // all view
 * },
 * {
 *  strategy: {
 *    actions: ['view']
 * }]
 **/
function adjustActionByStrategy(
	roles,
	result: {
		actions?: Record<string, object>;
		strategy?: { actions?: string[] };
		resources?: string[];
	},
) {
	const { actions, strategy } = result;
	const actionSet = getAdjustActions(roles);
	if (
		!lodash.isEmpty(actions) &&
		!lodash.isEmpty(strategy?.actions) &&
		!lodash.isEmpty(result.resources)
	) {
		for (const resource of result.resources) {
			for (const action of strategy.actions) {
				if (actionSet.has(action)) {
					actions[`${resource}:${action}`] = {};
				}
			}
		}
	}
}

function getAdjustActions(roles: ACLRole[]) {
	const actionSet = new Set<string>();
	for (const role of roles) {
		const jsonRole = role.toJSON();
		// Within the same role, actions have higher priority than strategy.actions.
		if (
			!lodash.isEmpty(jsonRole.strategy?.["actions"]) &&
			lodash.isEmpty(jsonRole.actions)
		) {
			jsonRole.strategy["actions"].forEach(
				(x) => !x.includes("own") && actionSet.add(x),
			);
		}
	}
	return actionSet;
}

function mergeRoleNames(sourceRoleNames, newRoleName) {
	return newRoleName ? sourceRoleNames.concat(newRoleName) : sourceRoleNames;
}

function mergeRoleStrategy(sourceStrategy, newStrategy) {
	if (!newStrategy) {
		return sourceStrategy;
	}
	if (lodash.isArray(newStrategy.actions)) {
		if (!sourceStrategy.actions) {
			sourceStrategy.actions = newStrategy.actions;
		} else {
			const actions = sourceStrategy.actions.concat(newStrategy.actions);
			return {
				...sourceStrategy,
				actions: [...new Set(actions)],
			};
		}
	}
	return sourceStrategy;
}

function mergeRoleActions(sourceActions, newActions) {
	if (lodash.isEmpty(sourceActions)) return newActions;
	if (lodash.isEmpty(newActions)) return sourceActions;

	const result = {};
	[
		...new Set(
			Reflect.ownKeys(sourceActions).concat(Reflect.ownKeys(newActions)),
		),
	].forEach((key) => {
		if (lodash.has(sourceActions, key) && lodash.has(newActions, key)) {
			result[key] = mergeAclActionParams(sourceActions[key], newActions[key]);
			return;
		}
		result[key] = lodash.has(sourceActions, key)
			? sourceActions[key]
			: newActions[key];
	});

	return result;
}

function mergeRoleSnippets(allRoleSnippets: string[][]): string[] {
	if (!allRoleSnippets.length) {
		return [];
	}

	const allSnippets = allRoleSnippets.flat();
	const isExclusion = (value) => value.startsWith("!");
	const includes = new Set(allSnippets.filter((x) => !isExclusion(x)));
	const excludes = new Set(allSnippets.filter(isExclusion));

	// Count how many characters xxx.* exists in
	const domainRoleMap = new Map<string, Set<number>>();
	allRoleSnippets.forEach((roleSnippets, i) => {
		roleSnippets
			.filter((x) => x.endsWith(".*") && !isExclusion(x))
			.forEach((include) => {
				const domain = include.slice(0, -1);
				if (!domainRoleMap.has(domain)) {
					domainRoleMap.set(domain, new Set());
				}
				domainRoleMap.get(domain).add(i);
			});
	});

	// Handle blacklist intersection (only keep characters if they have `!xxx`)
	const excludesSet = new Set<string>();
	for (const snippet of excludes) {
		if (allRoleSnippets.every((x) => x.includes(snippet))) {
			excludesSet.add(snippet);
		}
	}

	for (const [domain, indexes] of domainRoleMap.entries()) {
		const fullDomain = `${domain}.*`;

		// When xxx.* exists, it will overwrite !xxx.*
		if (includes.has(fullDomain)) {
			excludesSet.delete(`!${fullDomain}`);
		}

		// Calculate !xxx.yyy and keep it only when all xxx.* characters contain !xxx.yyy
		for (const roleIndex of indexes) {
			for (const exclude of allRoleSnippets[roleIndex]) {
				if (exclude.startsWith(`!${domain}`) && exclude !== `!${fullDomain}`) {
					if ([...indexes].every((i) => allRoleSnippets[i].includes(exclude))) {
						excludesSet.add(exclude);
					}
				}
			}
		}
	}

	// Ensure that !xxx.yyy is valid only when xxx.* exists, and resolve conflicts between [xxx] and [!xxx]
	if (includes.size > 0) {
		for (const x of [...excludesSet]) {
			const exactMatch = x.slice(1);
			const segments = exactMatch.split(".");
			if (segments.length > 1 && segments[1] !== "*") {
				const parentDomain = segments[0] + ".*";
				if (!includes.has(parentDomain)) {
					excludesSet.delete(x);
				}
			}
		}
	}

	return [...includes, ...excludesSet];
}

function mergeRoleResources(sourceResources, newResources) {
	if (sourceResources === null) {
		return newResources;
	}

	return [...new Set(sourceResources.concat(newResources))];
}

export function mergeAclActionParams(sourceParams, targetParams) {
	if (lodash.isEmpty(sourceParams) || lodash.isEmpty(targetParams)) {
		return {};
	}

	// When one of source and target does not have the fields field, it is hoped that this field will not be present.
	removeUnmatchedParams(sourceParams, targetParams, [
		"fields",
		"whitelist",
		"appends",
	]);

	const andMerge = (x, y) => {
		if (lodash.isEmpty(x) || lodash.isEmpty(y)) {
			return [];
		}
		return lodash.uniq(x.concat(y)).filter(Boolean);
	};

	const mergedParams = assign(targetParams, sourceParams, {
		own: (x, y) => x || y,
		filter: (x, y) => {
			if (lodash.isEmpty(x) || lodash.isEmpty(y)) {
				return {};
			}
			const xHasOr = lodash.has(x, "$or"),
				yHasOr = lodash.has(y, "$or");
			let $or = [x, y];
			if (xHasOr && !yHasOr) {
				$or = [...x.$or, y];
			} else if (!xHasOr && yHasOr) {
				$or = [x, ...y.$or];
			} else if (xHasOr && yHasOr) {
				$or = [...x.$or, ...y.$or];
			}

			return { $or: lodash.uniqWith($or, lodash.isEqual) };
		},
		fields: andMerge,
		whitelist: andMerge,
		appends: "union",
	});
	removeEmptyParams(mergedParams);
	return mergedParams;
}

export function removeEmptyParams(params) {
	if (!lodash.isObject(params)) {
		return;
	}
	Object.keys(params).forEach((key) => {
		if (lodash.isEmpty(params[key])) {
			delete params[key];
		}
	});
}

function removeUnmatchedParams(source, target, keys: string[]) {
	for (const key of keys) {
		if (lodash.has(source, key) && !lodash.has(target, key)) {
			delete source[key];
		}
		if (!lodash.has(source, key) && lodash.has(target, key)) {
			delete target[key];
		}
	}
}
