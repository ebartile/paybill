import { mockDatabase, Database } from "@paybilldev/sequelize";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

describe("migrator", () => {
	let db: Database;

	beforeEach(async () => {
		db = await mockDatabase({
			tablePrefix: "test_",
		});

		await db.clean({ drop: true });
	});

	afterEach(async () => {
		await db.close();
	});

	test("addMigrations", async () => {
		db.collection({
			name: "test",
			fields: [
				{
					type: "string",
					name: "status",
				},
			],
		});

		await db.sync();

		const r = db.getRepository("test");

		await r.create({
			values: [
				{ status: "s1" },
				{ status: "s1" },
				{ status: "s1" },
				{ status: "s2" },
				{ status: "s3" },
			],
		});

		const result = await r.find({
			attributes: [
				"status",
				[db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"],
			],
			sort: "status",
			group: "status",
		});

		expect(result.map((r) => r.toJSON())).toMatchObject([
			{ status: "s1", count: 3 },
			{ status: "s2", count: 1 },
			{ status: "s3", count: 1 },
		]);
	});
});
