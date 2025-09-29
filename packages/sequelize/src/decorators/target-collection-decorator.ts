import lodash from "lodash";

const injectTargetCollection = () => {
	return function (method: Function, context: ClassMethodDecoratorContext) {
		return function (...args: any[]) {
			const options = args[0];
			const values = options?.values;

			if (lodash.isPlainObject(values) && values.__collection) {
				options.targetCollection = values.__collection;
			}

			return method.apply(this, args);
		};
	};
};

export default injectTargetCollection;
