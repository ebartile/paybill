import {
	mockDatabase,
	EncryptionField,
	MockDatabase,
} from "@paybilldev/sequelize";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("encryption field", () => {
	let db: MockDatabase;

	beforeEach(async () => {
		db = await mockDatabase();
		await db.clean({ drop: true });
		db.registerFieldTypes({
			encryption: EncryptionField,
		});
	});

	afterEach(async () => {
		await db.close();
	});

	it("basic", async () => {
		db.collection({
			name: "tests",
			fields: [
				{
					type: "encryption",
					name: "name1",
					iv: "1234567890123456",
				},
			],
		});
		await db.sync();
		const r = db.getRepository("tests");
		const model = await r.create({
			values: {
				name1: "aaa",
			},
		});
		expect(model.get("name1")).not.toBe("aaa");
		const model2 = await r.findOne();
		expect(model2.get("name1")).toBe("aaa");
	});

	it("should throw error when value is object", async () => {
		db.collection({
			name: "tests",
			fields: [
				{
					type: "encryption",
					name: "name1",
					iv: "1234567890123456",
				},
			],
		});
		await db.sync();
		const r = db.getRepository("tests");
		let err: Error;
		try {
			await r.create({
				values: {
					name1: { obj: "aaa" },
				},
			});
		} catch (error) {
			err = error;
		}
		expect(err?.message).toBe(
			"string violation: name1 cannot be an array or an object",
		);
	});

	it("should throw error when value is number", async () => {
		db.collection({
			name: "tests",
			fields: [
				{
					type: "encryption",
					name: "name1",
					iv: "1234567890123456",
				},
			],
		});
		await db.sync();
		const r = db.getRepository("tests");
		let err: Error;
		try {
			await r.create({
				values: {
					name1: 123,
				},
			});
		} catch (error) {
			err = error;
		}
		expect(err?.message).toBe(
			"Encrypt Failed: The value must be a string, but got number",
		);
	});

	it("should throw error when `iv` incorrect", async () => {
		db.collection({
			name: "tests",
			fields: [
				{
					type: "encryption",
					name: "name1",
					iv: "1",
				},
			],
		});
		await db.sync();
		const r = db.getRepository("tests");
		let err: Error;
		try {
			await r.create({
				values: {
					name1: "aaa",
				},
			});
		} catch (error) {
			err = error;
		}
		expect(err.message).toBe(
			"Encrypt Failed: The `iv` must be a 16-character string",
		);
	});

	it("should not throw error when value is `null` or `undefined` or empty string", async () => {
		db.collection({
			name: "tests",
			fields: [
				{
					type: "encryption",
					name: "name1",
					iv: "1234567890123456",
				},
			],
		});
		await db.sync();
		const r = db.getRepository("tests");
		const fn = vi.fn();
		try {
			await r.create({
				values: [
					{
						name1: null,
					},
					{
						name1: undefined,
					},
					{
						name1: "",
					},
				],
			});
		} catch {
			fn();
		}
		expect(fn).toHaveBeenCalledTimes(0);
	});
});
