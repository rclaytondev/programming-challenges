import { describe } from "mocha";
import { GroupedArray } from "./GroupedArray.mjs";
import { assert } from "chai";

describe("GroupedArray.fromArray", () => {
	it("can construct a grouped array with the same elements as the array", () => {
		const array = GroupedArray.fromArray(["a", "a", "b", "a", "c", "c", "c"]);
		assert.deepEqual(array.groups, [
			{ value: "a", length: 2 },
			{ value: "b", length: 1 },
			{ value: "a", length: 1 },
			{ value: "c", length: 3 }
		]);
	});
	it("returns an array with no groups when given the empty array", () => {
		const array = GroupedArray.fromArray([]);
		assert.deepEqual(array.groups, []);
	});
	it("returns an array with 1 group when all the items are equal", () => {
		const array = GroupedArray.fromArray(["a", "a", "a"]);
		assert.deepEqual(array.groups, [{ value: "a", length: 3 }]);
	});
});
describe("GroupedArray.groupIndex", () => {
	it("returns the index of the group containing the given array index", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b"]);
		assert.equal(array.groupIndex(2), 0);
		assert.equal(array.groupIndex(3), 1);
	});
	it("returns -1 if the given index is too large", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b"]);
		assert.equal(array.groupIndex(5), -1);
	});
});
describe("GroupedArray.get", () => {
	it("returns the value at the given index", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b"]);
		assert.equal(array.get(2), "a");
		assert.equal(array.get(3), "b");
	});
});
describe("GroupedArray.isValid", () => {
	it("returns false if there are groups with length not a positive integer", () => {
		assert.isFalse(new GroupedArray([{ length: 0, value: "a" }]).isValid());
		assert.isFalse(new GroupedArray([{ length: -1, value: "a" }]).isValid());
		assert.isFalse(new GroupedArray([{ length: 1.2, value: "a" }]).isValid());
	});
	it("returns false if there are consecutive groups with the same value", () => {
		assert.isFalse(new GroupedArray([{ length: 1, value: "a" }, { length: 2, value: "a" }]).isValid());
	});
	it("returns true has no consecutive groups with the same value and no invalid group lengths", () => {
		assert.isTrue(new GroupedArray([{ length: 1, value: "a" }, { length: 2, value: "b" }]).isValid());
	});
});
describe("GroupedArray.set", () => {
	it("works when setting the 0th index in an empty array", () => {
		const array = new GroupedArray([]);
		array.set(0, "a");
		assert.deepEqual([...array], ["a"]);
		assert.isTrue(array.isValid());
	});
	it("throws an error when setting a nonzero index in an empty array", () => {
		const array = new GroupedArray([]);
		assert.throws(() => array.set(1, "a"));
	});
	it("works when setting a value at the beginning of an array", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b", "b", "b"]);
		array.set(0, "x");
		assert.deepEqual([...array], ["x", "a", "a", "b", "b", "b", "b"]);
		assert.isTrue(array.isValid());
	});
	it("works when setting a value at the beginning of a group", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b", "b", "b"]);
		array.set(3, "x");
		assert.deepEqual([...array], ["a", "a", "a", "x", "b", "b", "b"]);
		assert.isTrue(array.isValid());
	});
	it("works when setting a value in the middle of a group", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b", "b", "b"]);
		array.set(4, "x");
		assert.deepEqual([...array], ["a", "a", "a", "b", "x", "b", "b"]);
		assert.isTrue(array.isValid());
	});
	it("works when setting a value at the end of a group", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b", "b", "b"]);
		array.set(2, "x");
		assert.deepEqual([...array], ["a", "a", "x", "b", "b", "b", "b"]);
		assert.isTrue(array.isValid());
	});
	it("works when setting a value at the end of the array", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b", "b", "b"]);
		array.set(6, "x");
		assert.deepEqual([...array], ["a", "a", "a", "b", "b", "b", "x"]);
		assert.isTrue(array.isValid());
	});
	it("works when adding a new value to the end of the array", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b", "b", "b"]);
		array.set(7, "x");
		assert.deepEqual([...array], ["a", "a", "a", "b", "b", "b", "b", "x"]);
		assert.isTrue(array.isValid());
	});
	it("throws an error when setting a value at an invalid index", () => {
		const array = GroupedArray.fromArray(["a", "a", "a", "b", "b", "b", "b"]);
		assert.throws(() => array.set(-1, "x"));
		assert.throws(() => array.set(1.2, "x"));
		assert.throws(() => array.set(8, "x"));
	});
	it("works when setting a value at the beginning of the array that is equal to the value in the second group", () => {
		const array = GroupedArray.fromArray(["a", "b", "b", "a"]);
		array.set(0, "b");
		assert.deepEqual([...array], ["b", "b", "b", "a"]);
		assert.isTrue(array.isValid());
	});
	it("works when setting a value that is equal to the value in the next group", () => {
		const array = GroupedArray.fromArray(["a", "b", "b", "a"]);
		array.set(2, "a");
		assert.deepEqual([...array], ["a", "b", "a", "a"]);
		assert.isTrue(array.isValid());
	});
	it("works when setting a value at the end of the array that is equal to the value in the second-to-last group", () => {
		const array = GroupedArray.fromArray(["a", "b", "b", "a"]);
		array.set(3, "b");
		assert.deepEqual([...array], ["a", "b", "b", "b"]);
		assert.isTrue(array.isValid());
	});
	it("works when adding a value to the end of an array that is equal to the value in the last group", () => {
		const array = GroupedArray.fromArray(["a", "b", "b", "a"]);
		array.set(4, "a");
		assert.deepEqual([...array], ["a", "b", "b", "a", "a"]);
		assert.isTrue(array.isValid());
	});
	it("works when setting a value that is equal to the value in the previous group", () => {
		const array = GroupedArray.fromArray(["a", "b", "b", "a"]);
		array.set(1, "a");
		assert.deepEqual([...array], ["a", "a", "b", "a"]);
		assert.isTrue(array.isValid());
	});
	it("works when setting a value that is equal to the value in both adjacent groups", () => {
		const array = GroupedArray.fromArray(["a", "a", "b", "a"]);
		array.set(2, "a");
		assert.deepEqual([...array], ["a", "a", "a", "a"]);
		assert.isTrue(array.isValid());
	});
});
