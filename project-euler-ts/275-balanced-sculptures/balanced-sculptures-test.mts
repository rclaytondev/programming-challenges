import { describe, it } from "mocha";
import { PartialSculpture } from "./balanced-sculptures.mjs";
import { assert } from "chai";
import { Partition } from "./Partition.mjs";

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
});
