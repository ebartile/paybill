import { isValidFilter } from "../utils";

const mustHaveFilter = () => {
  return function (method: Function, context: ClassMethodDecoratorContext) {
    return function (...args: any[]) {
      const options = args[0];

      if (Array.isArray(options?.values)) {
        return method.apply(this, args);
      }

      if (
        !isValidFilter(options?.filter) &&
        !options?.filterByTk &&
        !options?.forceUpdate
      ) {
        throw new Error(
          `must provide filter or filterByTk for ${String(context.name)} call, or set forceUpdate to true`
        );
      }

      return method.apply(this, args);
    };
  };
};

export default mustHaveFilter;
