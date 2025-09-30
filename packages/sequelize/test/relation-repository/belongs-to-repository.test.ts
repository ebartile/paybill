import {
	BelongsToRepository,
	Collection,
	mockDatabase,
	Database,
} from "@paybilldev/sequelize";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

describe("belongs to repository", () => {
	let db: Database;
	let User: Collection;
	let Post: Collection;

	beforeEach(async () => {
		db = await mockDatabase();
		await db.clean({ drop: true });

		User = db.collection({
			name: "users",
			fields: [
				{ type: "string", name: "name" },
				{ type: "string", name: "status" },
				{ type: "hasMany", name: "posts" },
			],
		});

		Post = db.collection({
			name: "posts",
			fields: [
				{ type: "string", name: "title" },
				{ type: "belongsTo", name: "user" },
			],
		});

		await db.sync();
	});

	afterEach(async () => {
		await db.close();
	});

	test("firstOrCreate", async () => {
		const p1 = await Post.repository.create({
			values: { title: "p1" },
		});

		const PostUserRepository = new BelongsToRepository(Post, "user", p1.id);

		// Test basic creation
		const user1 = await PostUserRepository.firstOrCreate({
			filterKeys: ["name"],
			values: {
				name: "u1",
				status: "active",
			},
		});

		expect(user1.name).toEqual("u1");
		expect(user1.status).toEqual("active");

		// Verify that the association is established
		await p1.reload();
		expect(p1.userId).toEqual(user1.id);

		// Test to find existing records
		const user2 = await PostUserRepository.firstOrCreate({
			filterKeys: ["name"],
			values: {
				name: "u1",
				status: "inactive",
			},
		});

		expect(user2.id).toEqual(user1.id);
		expect(user2.status).toEqual("active");

		// Testing multiple filterKeys
		const user3 = await PostUserRepository.firstOrCreate({
			filterKeys: ["name", "status"],
			values: {
				name: "u1",
				status: "draft",
			},
		});

		expect(user3.id).not.toEqual(user1.id);
		expect(user3.status).toEqual("draft");
	});

	test("updateOrCreate", async () => {
		const p1 = await Post.repository.create({
			values: { title: "p1" },
		});

		const PostUserRepository = new BelongsToRepository(Post, "user", p1.id);

		// Test basic creation
		const user1 = await PostUserRepository.updateOrCreate({
			filterKeys: ["name"],
			values: {
				name: "u1",
				status: "active",
			},
		});

		expect(user1.name).toEqual("u1");
		expect(user1.status).toEqual("active");

		// Verify that the association is established
		await p1.reload();
		expect(p1.userId).toEqual(user1.id);

		// Test update existing records
		const user2 = await PostUserRepository.updateOrCreate({
			filterKeys: ["name"],
			values: {
				name: "u1",
				status: "inactive",
			},
		});

		expect(user2.id).toEqual(user1.id);
		expect(user2.status).toEqual("inactive");

		// Testing the creation of multiple filterKeys
		const user3 = await PostUserRepository.updateOrCreate({
			filterKeys: ["name", "status"],
			values: {
				name: "u1",
				status: "draft",
			},
		});

		expect(user3.id).not.toEqual(user1.id);
		expect(user3.status).toEqual("draft");

		// Verify that the association is updated
		await p1.reload();
		expect(p1.userId).toEqual(user3.id);
	});
});
