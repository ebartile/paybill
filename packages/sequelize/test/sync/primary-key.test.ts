import { mockDatabase, Database } from "@paybilldev/sequelize";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("primary key", () => {
	let db: Database;

	beforeEach(async () => {
		db = await mockDatabase({});

		await db.clean({ drop: true });
	});

	afterEach(async () => {
		await db.close();
	});

	it("should create primary key without auto increment", async () => {
		const User = db.collection({
			name: "users",
			autoGenId: false,
			timestamps: false,
		});

		await db.sync();

		User.setField("someField", {
			primaryKey: true,
			type: "string",
			defaultValue: "12321",
		});

		await db.sync();

		const getTableInfo = async () => {
			return await db.sequelize
				.getQueryInterface()
				.describeTable(User.getTableNameWithSchema());
		};

		const assertPrimaryKey = async (fieldName, primaryKey) => {
			const tableInfo = await getTableInfo();
			const field = User.model.rawAttributes[fieldName].field;
			expect(tableInfo[field].primaryKey).toBe(primaryKey);
		};

		await assertPrimaryKey("someField", true);
	});

	it("should create primary key with auto increment", async () => {
		const User = db.collection({
			name: "users",
			autoGenId: false,
			timestamps: false,
		});

		await db.sync();

		User.setField("someField", {
			primaryKey: true,
			autoIncrement: true,
			type: "integer",
			defaultValue: null,
		});

		await db.sync();

		const getTableInfo = async () => {
			return await db.sequelize
				.getQueryInterface()
				.describeTable(User.getTableNameWithSchema());
		};

		const assertPrimaryKey = async (fieldName, primaryKey) => {
			const tableInfo = await getTableInfo();
			const field = User.model.rawAttributes[fieldName].field;
			expect(tableInfo[field].primaryKey).toBe(primaryKey);
		};

		await assertPrimaryKey("someField", true);
	});
});

describe("primary key not in sqlite", () => {
	let db: Database;

	beforeEach(async () => {
		db = await mockDatabase({});

		await db.clean({ drop: true });
	});

	afterEach(async () => {
		await db.close();
	});

	it("should change primary key", async () => {
		if (!db.inDialect("sqlite")) return;
		const User = db.collection({
			name: "users",
			autoGenId: false,
			timestamps: false,
		});

		await db.sync();

		const getTableInfo = async () => {
			return await db.sequelize
				.getQueryInterface()
				.describeTable(User.getTableNameWithSchema());
		};

		const assertPrimaryKey = async (fieldName, primaryKey) => {
			const tableInfo = await getTableInfo();
			const field = User.model.getAttributes()[fieldName].field;
			expect(tableInfo[field].primaryKey).toBe(primaryKey);
		};

		// add a field as primary key
		User.setField("name", { type: "string", name: "name", primaryKey: true });
		await db.sync();

		await assertPrimaryKey("name", true);
		// use  another field as primary key
		User.setField("name", { type: "string", name: "name", primaryKey: false });
		await db.sync();
		await assertPrimaryKey("name", false);

		if (db.inDialect("sqlite")) {
			// SQLite does not support altering primary keys via ALTER TABLE.
			// Unlike Postgres or MySQL, SQLite has very limited ALTER TABLE capabilities.
			return; // skip test, SQLite can't do this
		}

		User.setField("fullName", {
			type: "string",
			name: "fullName",
			primaryKey: true,
		});
		await db.sync();
		await assertPrimaryKey("fullName", true);
	});
});
