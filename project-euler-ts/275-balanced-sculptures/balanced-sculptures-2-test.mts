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
	it("returns 0 when left=right and there are different components that are connected to each other", () => {
		const ranges1 = [new Range(10, 11)];
		const ranges2 = [new Range(12)];
		const result = sculptures(7, 7, 0, 0, [
			new Component(ranges1, ranges1), new Component(ranges2, ranges2)
		]);
		assert.equal(result, 0n);
	});
	it("returns 1 when right=left+1 and weight=blocks=0 and everything is valid", () => {
		const component = new Component([new Range(1, 2)], [new Range(2, 3)]);
		const result = sculptures(3, 4, 0, 0, [component]);
		assert.equal(result, 1n);
	});
	it("returns 0 when right=left+1 and there are components that are not connected", () => {
		const component = new Component([new Range(1, 2)], [new Range(3, 4)]);
		const result = sculptures(3, 4, 0, 0, [component]);
		assert.equal(result, 0n);
	});
	it("returns 0 when right=left+1 and there are different components that are connected to each other", () => {
		const components = [
			new Component([new Range(1, 2)], []),
			new Component([], [new Range(2, 3)])
		];
		const result = sculptures(3, 4, 0, 0, components);
		assert.equal(result, 0n);
	});

	it("works when the components can be connected in exactly 1 way, using 1 block", () => {
		const components = [new Component([new Range(0)], [new Range(0)])];
		const result = sculptures(0, 2, 1, 1, components);
		assert.equal(result, 1n);
	});
	it("works when the components can be connected in 2 ways, using 2 blocks", () => {
		const components = [new Component([new Range(1)], [new Range(1)])];
		const result = sculptures(0, 2, 2, 2, components);
		assert.equal(result, 2n);
	});
});
