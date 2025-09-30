import lodash from "lodash";

export function transactionWrapperBuilder(
	transactionGenerator: () => Promise<any>,
) {
	return function transaction(
		transactionInjector?: (args: any[], transaction: any) => any,
	) {
		return function (method: Function, context: ClassMethodDecoratorContext) {
			return async function (...args: any[]) {
				let transaction;
				let newTransaction = false;

				if (args.length > 0 && typeof args[0] === "object") {
					transaction = args[0]["transaction"];
				}

				if (!transaction) {
					transaction = await transactionGenerator.apply(this);
					newTransaction = true;
				}

				transaction.afterCommit(() => {
					if (transaction.eventCleanupBinded) {
						return;
					}

					transaction.eventCleanupBinded = true;
					if (this.database) {
						this.database.removeAllListeners(
							`transactionRollback:${transaction.id}`,
						);
					}
				});

				if (newTransaction) {
					try {
						let callArguments;
						if (lodash.isPlainObject(args[0])) {
							callArguments = { ...args[0], transaction };
						} else if (transactionInjector) {
							callArguments = transactionInjector(args, transaction);
						} else if (lodash.isNull(args[0]) || lodash.isUndefined(args[0])) {
							callArguments = { transaction };
						} else {
							throw new Error(
								`please provide transactionInjector for ${String(context.name)} call`,
							);
						}

						const results = await method.call(this, callArguments);

						await transaction.commit();

						return results;
					} catch (err) {
						console.error(err);
						await transaction.rollback();

						if (this.database) {
							await this.database.emitAsync(
								`transactionRollback:${transaction.id}`,
							);
							await this.database.removeAllListeners(
								`transactionRollback:${transaction.id}`,
							);
						}
						throw err;
					}
				} else {
					return method.apply(this, args);
				}
			};
		};
	};
}
