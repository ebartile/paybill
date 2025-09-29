import { flatten, unflatten } from "flat";
import { default as lodash, default as _ } from "lodash";
import { type ModelStatic } from "sequelize";
import { Collection } from "./collection";
import { Database } from "./database";
import { Model } from "./model";
import { BelongsToArrayAssociation } from "./belongs-to-array/belongs-to-array-repository";

type FilterType = any;

interface FilterParserContext {
	collection: Collection;
	app?: any;
}

export default class FilterParser {
	collection: Collection;
	database: Database;
	model: ModelStatic<Model>;
	filter: FilterType;
	context: FilterParserContext;

	constructor(filter: FilterType, context: FilterParserContext) {
		const { collection } = context;
		this.collection = collection;
		this.context = context;
		this.model = collection.model;
		this.filter = this.prepareFilter(filter);
		this.database = collection.context.database;
	}

	prepareFilter(filter: FilterType) {
		if (lodash.isPlainObject(filter)) {
			const renamedKey = {};

			for (const key of Object.keys(filter)) {
				if (key.endsWith(".$exists") || key.endsWith(".$notExists")) {
					const keyArr = key.split(".");
					if (keyArr[keyArr.length - 2] == "id") {
						continue;
					}

					keyArr.splice(keyArr.length - 1, 0, "id");
					renamedKey[key] = keyArr.join(".");
				}
			}

			for (const [oldKey, newKey] of Object.entries(renamedKey)) {
				// @ts-ignore
				filter[newKey] = filter[oldKey];
				delete filter[oldKey];
			}
		}

		return filter;
	}

	toSequelizeParams(): any {
		if (!this.filter) {
			return {};
		}

		const filter = this.filter;

		const model = this.model;

		// supported operators
		const operators = this.database.operators;

		const originalFiler = lodash.cloneDeep(filter || {});

		const flattenedFilter = flatten(filter || {});

		const include = {};
		const where = {};

		let skipPrefix = null;
		const associations = model.associations;

		for (const entry of Object.entries(flattenedFilter)) {
			const key = entry[0];
			let value = entry[1];
			// Handling filter conditions
			if (skipPrefix && key.startsWith(skipPrefix)) {
				continue;
			}

			// skip empty logic operator value
			if (
				(key == "$or" || key == "$and") &&
				Array.isArray(value) &&
				value.length == 0
			) {
				continue;
			}

			const keys = key.split(".");

			// paths ?
			const paths = [];

			// origins ?
			const origins = [];

			while (keys.length) {
				// move key from keys to origins
				const firstKey = keys.shift();
				origins.push(firstKey);

				if (firstKey.startsWith("$")) {
					if (operators.has(firstKey)) {
						// if firstKey is operator
						const opKey = operators.get(firstKey);

						// Default operator
						if (typeof opKey === "symbol") {
							paths.push(opKey);
							continue;
						} else if (typeof opKey === "function") {
							skipPrefix = origins.join(".");

							const queryValue = lodash.get(
								unflatten(originalFiler),
								skipPrefix,
							);
							const [fieldName, fullName] =
								this.getFieldNameFromQueryPath(skipPrefix);
							value = opKey(queryValue, {
								app: this.context.app,
								db: this.database,
								path: skipPrefix,
								fullName,
								fieldName,
								fieldPath: `${this.collection.name}.${fullName}`,
								model: this.model,
							});
							break;
						}
					} else {
						paths.push(firstKey);
						continue;
					}
				}

				// firstKey is number
				if (!lodash.isNaN(parseInt(firstKey))) {
					paths.push(firstKey);
					continue;
				}

				// firstKey is not association
				if (!associations[firstKey]) {
					paths.push(firstKey);
					continue;
				}

				const association = associations[firstKey];
				const associationKeys = [];

				associationKeys.push(firstKey);

				const existInclude = _.get(include, firstKey);

				if (!existInclude) {
					// set sequelize include option
					let includeOptions = {
						association: firstKey,
						attributes: [], // out put empty fields by default
					};
					if (association.associationType === "BelongsToArray") {
						includeOptions = {
							...includeOptions,
							...(
								association as any as BelongsToArrayAssociation
							).generateInclude(),
						};
					}
					_.set(include, firstKey, includeOptions);
				}

				// association target model
				let target = associations[firstKey].target;

				while (target) {
					const attr = keys.shift();
					origins.push(attr);
					// if it is target model attribute
					if (target.rawAttributes[attr]) {
						associationKeys.push(target.rawAttributes[attr].field || attr);
						target = null;
					} else if (target.associations[attr]) {
						// if it is target model association (nested association filter)
						associationKeys.push(attr);
						const assoc = [];
						associationKeys.forEach((associationKey, index) => {
							if (index > 0) {
								assoc.push("include");
							}
							assoc.push(associationKey);
						});

						const existInclude = _.get(include, assoc);
						if (!existInclude) {
							_.set(include, assoc, {
								association: attr,
								attributes: [],
							});
						}

						target = target.associations[attr].target;
					} else {
						throw new Error(
							`${attr} neither ${firstKey}'s association nor ${firstKey}'s attribute`,
						);
					}
				}

				if (associationKeys.length > 1) {
					paths.push(`$${associationKeys.join(".")}$`);
				} else {
					paths.push(firstKey);
				}
			}

			const values = _.get(where, paths);

			if (
				values &&
				typeof values === "object" &&
				value &&
				typeof value === "object"
			) {
				value = { ...value, ...values };
			}

			_.set(where, paths, value);
		}

		const toInclude = (items) => {
			return Object.values(items).map((item: any) => {
				if (item.include) {
					item.include = toInclude(item.include);
				}
				return item;
			});
		};

		const results = { where, include: toInclude(include) };

		//traverse filter include, set fromFiler to true
		const traverseInclude = (include) => {
			for (const item of include) {
				if (item.include) {
					traverseInclude(item.include);
				}
				item.fromFilter = true;
			}
		};

		traverseInclude(results.include);

		return results;
	}

	private getFieldNameFromQueryPath(queryPath: string) {
		const paths = queryPath.split(".");
		let fieldName;
		const fullPaths = [];
		for (const path of paths) {
			if (path.startsWith("$") || !lodash.isNaN(parseInt(path))) {
				continue;
			}
			fullPaths.push(path);
			fieldName = path;
		}
		return [fieldName, fullPaths.join(".")];
	}
}
