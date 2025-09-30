import { BaseValueParser as ValueParser } from "@paybilldev/sequelize";
import { beforeEach, describe, expect, it } from "vitest";

describe("number value parser", () => {
	let parser: ValueParser;

	beforeEach(() => {
		parser = new ValueParser({}, {});
	});

	it("should be converted to an array", () => {
		expect(parser.toArr("A/B", "/")).toEqual(["A", "B"]);
		expect(parser.toArr("A,B")).toEqual(["A", "B"]);
		expect(parser.toArr("A, B")).toEqual(["A", "B"]);
		expect(parser.toArr("A， B")).toEqual(["A", "B"]);
		expect(parser.toArr("A, B ")).toEqual(["A", "B"]);
		expect(parser.toArr("A， B  ")).toEqual(["A", "B"]);
		expect(parser.toArr("A、 B")).toEqual(["A", "B"]);
		expect(parser.toArr("A ,, B")).toEqual(["A", "B"]);
	});
});
