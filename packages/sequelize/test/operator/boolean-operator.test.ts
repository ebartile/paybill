import Database, { Collection, mockDatabase } from "@paybilldev/sequelize";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("boolean operator", () => {
	let db: Database;

	let User: Collection;

	afterEach(async () => {
		await db.close();
	});

	beforeEach(async () => {
		db = await mockDatabase({});

		await db.clean({ drop: true });

		User = db.collection({
			name: "users",
			fields: [{ type: "boolean", name: "activated" }],
		});

		await db.sync({
			force: true,
		});
	});

	it("should query $isFalsy", async () => {
		await db.getRepository("users").create({
			values: [
				{
					activated: false,
				},
				{
					activated: true,
				},
			],
		});

		const res = await db.getRepository("users").find({
			filter: {
				"activated.$isFalsy": true,
			},
		});

		expect(res.length).toBe(1);
	});

	it("should query $isTruly", async () => {
		await db.getRepository("users").create({
			values: [
				{
					activated: false,
				},
				{
					activated: true,
				},
			],
		});

		const res = await db.getRepository("users").find({
			filter: {
				"activated.$isTruly": true,
			},
		});

		expect(res.length).toBe(1);
	});
});
