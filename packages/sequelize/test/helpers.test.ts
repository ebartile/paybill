import { type PoolOptions } from "sequelize";
import { type IDatabaseOptions } from "@paybilldev/sequelize";
import { describe, expect, it } from "vitest";

function getPoolOptions(config: Record<string, any>): PoolOptions {
	const options: PoolOptions = {};
	if (config.DB_POOL_MAX) {
		options.max = Number.parseInt(config.DB_POOL_MAX, 10);
	}
	if (config.DB_POOL_MIN) {
		options.min = Number.parseInt(config.DB_POOL_MIN, 10);
	}
	if (config.DB_POOL_IDLE) {
		options.idle = Number.parseInt(config.DB_POOL_IDLE, 10);
	}
	if (config.DB_POOL_ACQUIRE) {
		options.acquire = Number.parseInt(config.DB_POOL_ACQUIRE, 10);
	}
	if (config.DB_POOL_EVICT) {
		options.evict = Number.parseInt(config.DB_POOL_EVICT, 10);
	}
	if (config.DB_POOL_MAX_USES) {
		options.maxUses =
			Number.parseInt(config.DB_POOL_MAX_USES, 10) || Number.POSITIVE_INFINITY;
	}
	return options;
}

export async function parseDatabaseOptions(
	config: Record<string, any>,
): Promise<IDatabaseOptions> {
	const databaseOptions: IDatabaseOptions = {
		logging: config.DB_LOGGING == "on" ? customLogger : false,
		dialect: config.DB_DIALECT as any,
		storage: config.DB_STORAGE,
		username: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_DATABASE,
		host: config.DB_HOST,
		port: config.DB_PORT as any,
		timezone: config.DB_TIMEZONE,
		tablePrefix: config.DB_TABLE_PREFIX,
		schema: config.DB_SCHEMA,
		underscored: config.DB_UNDERSCORED === "true",
		pool: getPoolOptions(config),
	};

	// SSL options stubbed out, since we’re not testing files/envs here
	if (config.DB_SSL) {
		databaseOptions.dialectOptions = {
			ssl: config.DB_SSL,
		};
	}

	return databaseOptions;
}

function customLogger(queryString, queryObject) {
	console.log(queryString);
	if (queryObject?.bind) {
		console.log(queryObject.bind);
	}
}

describe("database helpers", () => {
	describe("parseDatabaseOptions()", () => {
		it("undefined pool options", async () => {
			const options1 = await parseDatabaseOptions({});
			expect(options1).toMatchObject({
				pool: {},
			});
		});

		it("custom pool options", async () => {
			const options2 = await parseDatabaseOptions({
				DB_POOL_MAX: "10",
				DB_POOL_MIN: "1",
				DB_POOL_IDLE: "5000",
				DB_POOL_ACQUIRE: "30000",
				DB_POOL_EVICT: "2000",
				DB_POOL_MAX_USES: "0", // triggers Infinity fallback
			});

			expect(options2.pool).toMatchObject({
				max: 10,
				min: 1,
				idle: 5000,
				acquire: 30000,
				evict: 2000,
				maxUses: Number.POSITIVE_INFINITY,
			});
		});
	});
});
