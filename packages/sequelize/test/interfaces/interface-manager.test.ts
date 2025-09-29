import { Database, mockDatabase } from "@paybilldev/sequelize";
import { BaseInterface } from "@paybilldev/sequelize";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("interface manager", () => {
	let db: Database;

	beforeEach(async () => {
		db = await mockDatabase();
		await db.clean({ drop: true });
	});

	afterEach(async () => {
		await db.close();
	});

	it("should register field interface", async () => {
		class TestInterface extends BaseInterface {
			toString(value: any) {
				return `test-${value}`;
			}
		}

		db.interfaceManager.registerInterfaceType("test", TestInterface);
		expect(db.interfaceManager.getInterfaceType("test")).toBe(TestInterface);
	});
});
