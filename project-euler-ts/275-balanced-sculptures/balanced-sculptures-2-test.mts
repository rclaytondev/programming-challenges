import { describe } from "mocha";
import { Component, Range, sculptures } from "./balanced-sculptures-2.mjs";
import { assert } from "chai";

describe("sculptures", () => {
	it("returns 1 when left=right and weight=blocks=0 and everything is valid", () => {
		const ranges = [new Range(10)];
		const result = sculptures(7, 7, 0, 0, [new Component(ranges, ranges)]);
		assert.equal(result, 1n);
	});
	it("returns 0 when left=right and the components are not connected", () => {
		const ranges = [new Range(10), new Range(12)];
		const result = sculptures(7, 7, 0, 0, [new Component(ranges, ranges)]);
		assert.equal(result, 0n);
	});
	it("returns 0 when there are different components that are connected to each other", () => {
		const ranges1 = [new Range(10, 11)];
		const ranges2 = [new Range(12)];
		const result = sculptures(7, 7, 0, 0, [
			new Component(ranges1, ranges1), new Component(ranges2, ranges2)
		]);
		assert.equal(result, 0n);
	});
});
