import { describe, it } from "mocha";
import { PartialSculpture, setsWithSum } from "./balanced-sculptures.mjs";
import { assert } from "chai";
import { Partition } from "./Partition.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";

describe("PartialSculpture.numSculptures", () => {
	it("correctly counts the balanced sculptures of order 1", () => {
		const result = PartialSculpture.numSculptures(1);
		assert.equal(result, 1);
	});
	it("correctly counts the balanced sculptures of order 2", () => {
		const result = PartialSculpture.numSculptures(2);
		assert.equal(result, 1);
	});
	it("correctly counts the balanced sculptures of order 3", () => {
		const result = PartialSculpture.numSculptures(3);
		assert.equal(result, 2); // 2 sculptures: vertical sculpture and a T-shape
	});
	it("correctly counts the balanced sculptures of order 4", () => {
		const result = PartialSculpture.numSculptures(4);
		assert.equal(result, 4);
	});
	it("correctly counts the balanced sculptures of order 5", () => {
		const result = PartialSculpture.numSculptures(5);
		assert.equal(result, 9);
	});
});
describe("PartialSculpture.completions", () => {
	it("works for an example with nonzero weight that is not centered at 0", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[1]]),
			3,
			-3,
			"all"
		);
		const result = sculpture.completions();
		assert.equal(result, 2);
	});
});
describe("PartialSculpture.weightWidthBound", () => {
	it("returns the maximum x-position that could be in the next row while still having enough blocks to balance the sculpture", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[0]]),
			21,
			0,
			"all"
		);
		const right = sculpture.weightWidthBound("right");
		const left = sculpture.weightWidthBound("left");
		assert.equal(right, 10);
		assert.equal(left, -10);
	});
	it("works when the sculpture is not centered at 0", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[10]]),
			21,
			0,
			"all"
		);
		const right = sculpture.weightWidthBound("right");
		const left = sculpture.weightWidthBound("left");
		assert.equal(right, 10);
		assert.equal(left, -10);
	});
	it("works when the sculpture has nonzero weight", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[0]]),
			4,
			1 + 2 + 3,
			"all"
		);
		const right = sculpture.weightWidthBound("right");
		const left = sculpture.weightWidthBound("left");
		assert.equal(right, 0);
		assert.equal(left, -3);
	});
	it("works when the sculpture is not centered at 0 and has nonzero weight", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[3]]),
			4,
			-(3 + 4 + 5 + 6),
			"all"
		);
		const right = sculpture.weightWidthBound("right");
		const left = sculpture.weightWidthBound("left");
		assert.equal(right, 6);
		assert.equal(left, 3);
	});
	it("works when the width is greater than 1", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[-1, 1]]),
			6,
			0,
			"all"
		);
		const right = sculpture.weightWidthBound("right");
		const left = sculpture.weightWidthBound("left");
		assert.equal(right, 3);
		assert.equal(left, -3);
	});
	it("works when there are multiple components", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[-1], [1]]),
			6,
			0,
			"all"
		);
		const right = sculpture.weightWidthBound("right");
		const left = sculpture.weightWidthBound("left");
		assert.equal(right, 2);
		assert.equal(left, -2);
	});
});
describe("setsWithSum", () => {
	it("works for a small example", () => {
		const sets = setsWithSum(9, 9, 3, 6, 2);
		assert.deepEqual(new Set(sets), new Set([
			[3, 6],
			[4, 5]
		]));
	});
	it("works for a trivial example", () => {
		const sets = setsWithSum(0, 0, -1, 1, 1);
		assert.deepEqual(sets, [[0]]);
	});
	const naiveAlgorithm = (minSum: number, maxSum: number, min: number, max: number, size: number) => (
		[...GenUtils.subsets(ArrayUtils.range(min, max), size)]
		.filter(s => minSum <= MathUtils.sum(s) && MathUtils.sum(s) <= maxSum)
	);
	it("works for a larger example", () => {
		const sets = setsWithSum(15, 25, 0, 10, 4).map(s => new Set(s));
		const expected = naiveAlgorithm(15, 25, 0, 10, 4);
		assert.sameDeepMembers(sets, expected);
	});
});
describe("PartialSculpture.translate", () => {
	it("preserves the number of completions for a trivial examples", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[0]]),
			1,
			0,
			"all"
		);
		const completions = sculpture.completions();
		const translated = sculpture.translate(1);
		const translatedCompletions = translated.completions();
		assert.equal(completions, translatedCompletions);
	});
	it("preserves the number of completions for a more complex example", () => {
		const sculpture = new PartialSculpture(
			Partition.fromSets([[0]]),
			5,
			0,
			"all"
		);
		const completions = sculpture.completions();
		const translated = sculpture.translate(3);
		const translatedCompletions = translated.completions();
		assert.equal(completions, translatedCompletions);
	});
});
