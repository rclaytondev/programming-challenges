import { describe } from "mocha";
import { allSculptures, balancedSculptures, Component, Range, SculpturesCounter, symmetricalSculptures } from "./balanced-sculptures-2.mjs";
import { assert } from "chai";

let storedCache = new Map<string, bigint>();
const setupCacheHooks = () => {
	beforeEach(() => {
		storedCache = SculpturesCounter.cache;
		SculpturesCounter.cache = new Map<string, bigint>();
	});
	afterEach(() => {
		SculpturesCounter.cache = storedCache;
	});
};

describe("SculpturesCounter.sculptures", () => {
	setupCacheHooks();
	it("returns 1 when left=right and weight=blocks=0 and everything is valid", () => {
		const ranges = [new Range(10)];
		const result = SculpturesCounter.sculptures(7, 7, 0, 0, [new Component(ranges, ranges)]);
		assert.equal(result, 1n);
	});
	it("returns 0 when left=right and the components are not connected", () => {
		const ranges = [new Range(10), new Range(12)];
		const result = SculpturesCounter.sculptures(7, 7, 0, 0, [new Component(ranges, ranges)]);
		assert.equal(result, 0n);
	});
	it("returns 0 when left=right and there are different components that are connected to each other", () => {
		const ranges1 = [new Range(10, 11)];
		const ranges2 = [new Range(12)];
		const result = SculpturesCounter.sculptures(7, 7, 0, 0, [
			new Component(ranges1, ranges1), new Component(ranges2, ranges2)
		]);
		assert.equal(result, 0n);
	});
	it("returns 1 when right=left+1 and weight=blocks=0 and everything is valid", () => {
		const component = new Component([new Range(1, 2)], [new Range(2, 3)]);
		const result = SculpturesCounter.sculptures(3, 4, 0, 0, [component]);
		assert.equal(result, 1n);
	});
	it("returns 0 when right=left+1 and there are components that are not connected", () => {
		const component = new Component([new Range(1, 2)], [new Range(3, 4)]);
		const result = SculpturesCounter.sculptures(3, 4, 0, 0, [component]);
		assert.equal(result, 0n);
	});
	it("returns 0 when right=left+1 and there are different components that are connected to each other", () => {
		const components = [
			new Component([new Range(1, 2)], []),
			new Component([], [new Range(2, 3)])
		];
		const result = SculpturesCounter.sculptures(3, 4, 0, 0, components);
		assert.equal(result, 0n);
	});

	it("works when the components can be connected in exactly 1 way, using 1 block", () => {
		const components = [new Component([new Range(0)], [new Range(0)])];
		const result = SculpturesCounter.sculptures(0, 2, 1, 1, components);
		assert.equal(result, 1n);
	});
	it("works when the components can be connected in 2 ways, using 2 blocks", () => {
		const components = [new Component([new Range(1)], [new Range(1)])];
		const result = SculpturesCounter.sculptures(0, 2, 2, 2, components);
		assert.equal(result, 2n);
	});
	it("works when the components can be connected in 1 way using 2 blocks", () => {
		const components = [new Component([new Range(1)], [new Range(2)])];
		const result = SculpturesCounter.sculptures(0, 2, 2, 2, components);
		assert.equal(result, 1n);
	});
	it("works when two vertical columns can be connected in 2 ways using 1 block", () => {
		const components = [new Component([new Range(0, 1)], [new Range(0, 1)])];
		const result = SculpturesCounter.sculptures(0, 2, 1, 1, components);
		assert.equal(result, 2n);
	});
	it("works when two vertical columns can be connected in 3 ways using 1 block", () => {
		const components = [new Component([new Range(0, 2)], [new Range(0, 2)])];
		const result = SculpturesCounter.sculptures(0, 2, 1, 1, components);
		assert.equal(result, 3n);
	});
	it("works when two vertical columns can be connected in many ways by 1 block", () => {
		const components = [new Component([new Range(0, 4)], [new Range(0, 4)])];
		const result = SculpturesCounter.sculptures(0, 2, 1, 1, components);
		assert.equal(result, 5n);
	});
	it("works when two vertical columns can be connected in 4 ways with 2 blocks", () => {
		const components = [new Component([new Range(0, 2)], [new Range(0, 2)])];
		const result = SculpturesCounter.sculptures(0, 2, 2, 2, components);
		assert.equal(result, 3n + 1n);
	});
	it("works when two vertical columns can be connected in many ways with 2 blocks", () => {
		const components = [new Component([new Range(0, 4)], [new Range(0, 4)])];
		const result = SculpturesCounter.sculptures(0, 2, 2, 2, components);
		assert.equal(result, 5n * 4n / 2n + 1n);
	});
	it("returns 0 when the components cannot be connected because there are no blocks", () => {
		const components = [new Component([new Range(0)], [new Range(0)])];
		const result = SculpturesCounter.sculptures(0, 2, 0, 0, components);
		assert.equal(result, 0n);
	});
	it("works when one of the sides has no components (TODO: WRITE A BETTER TEST NAME)", () => {
		const component = new Component([], [new Range(0)]);
		const result = SculpturesCounter.sculptures(-2, 0, 1, -1, [component]);
		assert.equal(result, 1n);
	});


	it("works when two blocks can be connected by a horizontal bar in 1 way", () => {
		const components = [new Component([new Range(0)], [new Range(0)])];
		const result = SculpturesCounter.sculptures(0, 4, 3, 1 + 2 + 3, components);
		assert.equal(result, 1n);
	});
	it("works when two blocks can be connected by a horizontal bar with an extra block", () => {
		const components = [new Component([new Range(1)], [new Range(1)])];
		const result = SculpturesCounter.sculptures(0, 3, 3, 1 + 2 + 2, components);
		assert.equal(result, 2n);
	});
	it("works when two blocks can be connected by a horizontal bar with 2 extra blocks", () => {
		const components = [new Component([new Range(1)], [new Range(1)])];
		const result = SculpturesCounter.sculptures(0, 3, 4, 1 + 2 + 1 + 2, components);
		assert.equal(result, 4n);
	});

	it("works when one of the sides has no components", () => {
		const components = [new Component([new Range(2)], [])];
		const result = SculpturesCounter.sculptures(0, 4, 2, 1 + 2, components);
		assert.equal(result, 1n);
	});
	it("works when the region contains columns to the left and right of x=0", () => {
		const components = [new Component([new Range(1)], [new Range(1)])];
		const result = SculpturesCounter.sculptures(-2, 1, 4, -1 + 0 + -1 + 0, components);
		assert.equal(result, 4n);
	});
	it("correctly generates the 1-wide sculptures for the first step", () => {
		const result = SculpturesCounter.sculptures(-1, 1, 3, 0, [], "initial-all");
		assert.equal(result, 1n);
	});
	it("correctly generates sculptures starting with the 1-wide sculptures for a more complicated case", () => {
		const result = SculpturesCounter.sculptures(-2, 2, 3, 0, [], "initial-all");
		assert.equal(result, 2n);
	});
});
describe("SculpturesCounter.memoizedSculptures", () => {
	setupCacheHooks();
	
	let originalSculptures = SculpturesCounter.sculptures;
	afterEach(() => SculpturesCounter.sculptures = originalSculptures);

	it("works when placing multiple blocks at the bottom of a column", () => {
		const component = new Component([new Range(0)], [new Range(0)]);
		const result = SculpturesCounter.memoizedSculptures(0, 2, 3, 3, [component]);
		assert.equal(result, 1n);
	});
	it("works when placing multiple blocks at the bottom of a column in multiple ways", () => {
		const component = new Component([new Range(1)], [new Range(1)]);
		const result = SculpturesCounter.memoizedSculptures(0, 2, 3, 3, [component]);
		assert.equal(result, 2n);
	});
	it("works when placing multiple blocks near the bottom of a column", () => {
		const component = new Component([new Range(4)], [new Range(4)]);
		const result = SculpturesCounter.memoizedSculptures(0, 2, 3, 3, [component]);
		assert.equal(result, 3n);
	});
	it("works when placing multiple blocks very high in a column", () => {
		const component = new Component([new Range(10)], [new Range(10)]);
		const result = SculpturesCounter.memoizedSculptures(0, 2, 3, 3, [component]);
		assert.equal(result, 3n);
	});

	it("avoids duplicate computations using invariance under some vertical translations", () => {
		const result1 = SculpturesCounter.memoizedSculptures(0, 2, 3, 3, [new Component([new Range(4)], [new Range(4)])]);
		SculpturesCounter.sculptures = () => { throw new Error("Failed memoization: did not expect the function to be called again."); };
		const result2 = SculpturesCounter.memoizedSculptures(0, 2, 3, 3, [new Component([new Range(10)], [new Range(10)])]);
		assert.equal(result1, 3n);
		assert.equal(result2, 3n);
	});
	it("avoids duplicate computations using invariance under reflection and horizontal translation", () => {
		const component = new Component([new Range(1)], [new Range(2)]);
		const reflected = new Component([new Range(2)], [new Range(1)]);
		const result1 = SculpturesCounter.memoizedSculptures(1, 4, 3, 2 + 2 + 3, [component]);
		SculpturesCounter.sculptures = () => { throw new Error("Failed memoization: did not expect the function to be called again."); };
		const result2 = SculpturesCounter.memoizedSculptures(1, 4, 3, 2 + 3 + 3, [reflected]);
		assert.equal(result1, 1n);
		assert.equal(result2, 1n);
	});
	it("avoids duplicate combinations, and works when the components are symmetrical", () => {
		const result1 = SculpturesCounter.memoizedSculptures(0, 4, 4, 1+2+2+3, [new Component([new Range(1)], [new Range(1)])]);
		SculpturesCounter.sculptures = () => { throw new Error("Failed memoization: did not expect the function to be called again."); };
		const result2 = SculpturesCounter.memoizedSculptures(-4, 0, 4, -(1+2+2+3), [new Component([new Range(1)], [new Range(1)])]);
		assert.equal(result1, 2n);
		assert.equal(result2, 2n);
	});
	it("avoids duplicate computations, and works when the components are symmetrical but the sculptures are asymmetrical due to the weight", () => {
		const component = new Component([new Range(1)], [new Range(1)]);
		const result1 = SculpturesCounter.memoizedSculptures(0, 3, 3, 1+2+2, [component]);
		SculpturesCounter.sculptures = () => { throw new Error("Failed memoization: did not expect the function to be called again."); };
		const result2 = SculpturesCounter.memoizedSculptures(0, 3, 3, 1+1+2, [component]);
		assert.equal(result1, 2n);
		assert.equal(result2, 2n);
	});
});
describe("allSculptures", () => {
	setupCacheHooks();
	it("can compute the number of sculptures with 1 block, counting symmetrical pairs twice", () => {
		const result = allSculptures(1);
		assert.equal(result, 1n);
	});
	it("can compute the number of sculptures with 2 blocks, counting symmetrical pairs twice", () => {
		const result = allSculptures(2);
		assert.equal(result, 1n);
	});
	it("can compute the number of sculptures with 2 blocks, counting symmetrical pairs twice", () => {
		const result = allSculptures(3);
		assert.equal(result, 2n);
	});
	// it("can compute the number of sculptures with 6 blocks, counting symmetrical pairs twice", () => {
	// 	const result = allSculptures(6);
	// 	assert.equal(result, 27n);
	// });
});
describe("symmetricalSculptures", () => {
	setupCacheHooks();
	it("can compute the number of symmetrical sculptures with 1 block", () => {
		const result = symmetricalSculptures(1);
		assert.equal(result, 1n);
	});
	it("can compute the number of symmetrical sculptures with 2 blocks", () => {
		const result = symmetricalSculptures(2);
		assert.equal(result, 1n);
	});
	it("can compute the number of symmetrical sculptures with 3 blocks", () => {
		const result = symmetricalSculptures(3);
		assert.equal(result, 2n);
	});
});
describe("balancedSculptures", () => {
	setupCacheHooks();
	it("correctly counts the balanced sculptures of order 1", () => {
		const result = balancedSculptures(1);
		assert.equal(result, 1n);
	});
	it("correctly counts the balanced sculptures of order 2", () => {
		const result = balancedSculptures(2);
		assert.equal(result, 1n);
	});
	it("correctly counts the balanced sculptures of order 3", () => {
		const result = balancedSculptures(3);
		assert.equal(result, 2n); // 2 sculptures: vertical sculpture and a T-shape
	});
	it("correctly counts the balanced sculptures of order 4", () => {
		const result = balancedSculptures(4);
		assert.equal(result, 4n);
	});
});
describe("Component.minBlocksRequired", () => {
	it("returns 0 when there is only 1 range", () => {
		const component = new Component([new Range(3, 5)], []);
		const blocks = component.minBlocksRequired(3);
		assert.equal(blocks, 0);
	});
	it("works when there are ranges on both sides", () => {
		const component = new Component([new Range(3, 5)], [new Range(6, 7)]);
		const blocks = component.minBlocksRequired(3);
		assert.equal(blocks, 4);
	});
	it("works when there are ranges on only 1 side, but more than 1 range total", () => {
		const component = new Component([new Range(3, 5), new Range(6, 7)], []);
		const blocks = component.minBlocksRequired(3);
		assert.equal(blocks, 2);
	});
	it("works when there are overlapping ranges on opposite sides", () => {
		const component = new Component([new Range(0, 4)], [new Range(2)]);
		const blocks = component.minBlocksRequired(3);
		assert.equal(blocks, 3);
	});
	it("works when there are overlapping ranges on opposite sides with a length longer than 1", () => {
		const component = new Component([new Range(0, 4)], [new Range(2, 3)]);
		const blocks = component.minBlocksRequired(3);
		assert.equal(blocks, 3);
	});
});
