import { describe } from "mocha";
import { allSculptures, Component, Range, sculptures } from "./balanced-sculptures-2.mjs";
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
	it("works when the components can be connected in 1 way using 2 blocks", () => {
		const components = [new Component([new Range(1)], [new Range(2)])];
		const result = sculptures(0, 2, 2, 2, components);
		assert.equal(result, 1n);
	});
	it("works when two vertical columns can be connected in 2 ways using 1 block", () => {
		const components = [new Component([new Range(0, 1)], [new Range(0, 1)])];
		const result = sculptures(0, 2, 1, 1, components);
		assert.equal(result, 2n);
	});
	it("works when two vertical columns can be connected in 3 ways using 1 block", () => {
		const components = [new Component([new Range(0, 2)], [new Range(0, 2)])];
		const result = sculptures(0, 2, 1, 1, components);
		assert.equal(result, 3n);
	});
	it("works when two vertical columns can be connected in many ways by 1 block", () => {
		const components = [new Component([new Range(0, 4)], [new Range(0, 4)])];
		const result = sculptures(0, 2, 1, 1, components);
		assert.equal(result, 5n);
	});
	it("works when two vertical columns can be connected in 4 ways with 2 blocks", () => {
		const components = [new Component([new Range(0, 2)], [new Range(0, 2)])];
		const result = sculptures(0, 2, 2, 2, components);
		assert.equal(result, 3n + 1n);
	});
	it("works when two vertical columns can be connected in many ways with 2 blocks", () => {
		const components = [new Component([new Range(0, 4)], [new Range(0, 4)])];
		const result = sculptures(0, 2, 2, 2, components);
		assert.equal(result, 5n * 4n / 2n + 1n);
	});
	it("returns 0 when the components cannot be connected because there are no blocks", () => {
		const components = [new Component([new Range(0)], [new Range(0)])];
		const result = sculptures(0, 2, 0, 0, components);
		assert.equal(result, 0n);
	});
	it("works when one of the sides has no components (TODO: WRITE A BETTER TEST NAME)", () => {
		const component = new Component([], [new Range(0)]);
		const result = sculptures(-2, 0, 1, -1, [component]);
		assert.equal(result, 1n);
	});


	it("works when two blocks can be connected by a horizontal bar in 1 way", () => {
		const components = [new Component([new Range(0)], [new Range(0)])];
		const result = sculptures(0, 4, 3, 1 + 2 + 3, components);
		assert.equal(result, 1n);
	});
	it("works when two blocks can be connected by a horizontal bar with an extra block", () => {
		const components = [new Component([new Range(1)], [new Range(1)])];
		const result = sculptures(0, 3, 3, 1 + 2 + 2, components);
		assert.equal(result, 2n);
	});
	it("works when two blocks can be connected by a horizontal bar with 2 extra blocks", () => {
		const components = [new Component([new Range(1)], [new Range(1)])];
		const result = sculptures(0, 3, 4, 1 + 2 + 1 + 2, components);
		assert.equal(result, 4n);
	});

	it("works when one of the sides has no components", () => {
		const components = [new Component([new Range(2)], [])];
		const result = sculptures(0, 4, 2, 1 + 2, components);
		assert.equal(result, 1n);
	});
	it("works when the region contains columns to the left and right of x=0", () => {
		const components = [new Component([new Range(1)], [new Range(1)])];
		const result = sculptures(-2, 1, 4, -1 + 0 + -1 + 0, components);
		assert.equal(result, 4n);
	});
	it("correctly generates the 1-wide sculptures for the first step", () => {
		const result = sculptures(-1, 1, 3, 0, [], "initial-all");
		assert.equal(result, 1n);
	});
	it("correctly generates sculptures starting with the 1-wide sculptures for a more complicated case", () => {
		const result = sculptures(-2, 2, 3, 0, [], "initial-all");
		assert.equal(result, 2n);
	});
});
describe("allSculptures", () => {
	// it("returns the number of balanced sculptures, counting symmetrical pairs twice", () => {
	// 	const result = allSculptures(6);
	// 	assert.equal(result, 27n);
	// });
});
