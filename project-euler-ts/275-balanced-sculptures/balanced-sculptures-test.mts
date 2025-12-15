import { describe, it } from "mocha";
import { componentsOfArray, PartialSculpture } from "./balanced-sculptures.mjs";
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
			[[1]],
			3,
			-3,
			"all"
		);
		const result = sculpture.completions();
		assert.equal(result, 2);
	});
	it("works for a sculpture with width>1", () => {
		const sculpture = new PartialSculpture(
			[[-1, 0, 1]],
			2,
			0,
			"all"
		);
		const result = sculpture.completions();
		assert.equal(result, 2);
	});
	it("works for a very wide sculpture", () => {
		const sculpture = new PartialSculpture([[-3, -2, -1, 0, 1, 2, 3]], 4, 0, "all");
		const result = sculpture.completions();
		assert.equal(result, 24);
	});
});
describe("PartialSculpture.weightWidthBound", () => {
	it("returns the maximum x-position that could be in the next row while still having enough blocks to balance the sculpture", () => {
		const sculpture = new PartialSculpture(
			[[0]],
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
			[[10]],
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
			[[0]],
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
			[[3]],
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
			[[-1, 1]],
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
			[[-1], [1]],
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
describe("Partial.nextBlockPositions", () => {
	it("returns a list containing all the possible combinations for the next row", () => {
		const sculpture = new PartialSculpture(
			[[0]],
			5,
			0,
			"all"
		)
		const positions = sculpture.nextBlockPositions();
		assert.deepInclude(positions, new Set([-2, -1, 0, 1, 2]));
		assert.deepInclude(positions, new Set([-1, 0, 1]));
		assert.deepInclude(positions, new Set([-1, 0]));
		assert.deepInclude(positions, new Set([0, 1]));
		assert.deepInclude(positions, new Set([0]));
	});
	it("works for a sculpture with width>1", () => {
		const sculpture = new PartialSculpture(
			[[-1, 0, 1]],
			2,
			0,
			"all"
		);
		const positions = sculpture.nextBlockPositions();
		assert.deepInclude(positions, new Set([-1, 1]));
		assert.deepInclude(positions, new Set([0]));
	});
});
describe("PartialSculpture.translate", () => {
	it("preserves the number of completions for a trivial examples", () => {
		const sculpture = new PartialSculpture(
			[[0]],
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
			[[0]],
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
describe("PartialSculpture.reflect", () => {
	it("preserves the number of completions", () => {
		const sculpture = new PartialSculpture(
			[[10]],
			3,
			9 + 10 + 10,
			"all"
		);
		const completions = sculpture.completions();
		const reflected = sculpture.reflect();
		const reflectedCompletions = reflected.completions();
		assert.equal(completions, reflectedCompletions);
	});
});
describe("componentsOfArray", () => {
	it("groups the sorted array into connected components based on adjacency", () => {
		const array = [0, 1, 2, 7, 8, 9, 15, 18, 19];
		const components = componentsOfArray(array);
		assert.deepEqual(components, [
			[0, 1, 2],
			[7, 8, 9],
			[15],
			[18, 19]
		]);
	});
});
describe("PartialSculpture.nextComponents", () => {
	it("returns the next components based on the given block positions", () => {
		const components = [[0, 1, 2], [5, 6, 7, 10], [14], [16, 17, 18]];
		const sculpture = new PartialSculpture(components, 10, 0, "all");
		const result = sculpture.nextComponents([0, 2, 4, 5, 11, 14, 20, 21]);
		const sets = result.map(set => [...set].sort((a, b) => a - b).join(", "));
		assert.sameMembers(sets, ["0, 2", "4, 5", "11", "14", "20, 21"]);
	});
});
