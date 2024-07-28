import { describe, it } from "mocha";
import { solve, Wheel } from "./divisible-ranges-2.mjs";
import { assert } from "chai";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

describe("Wheel.create", () => {
	it("can create a 2-prime wheel", () => {
		const wheel = Wheel.create(2);
		assert.deepEqual(wheel.primes, [2, 3]);
		assert.deepEqual(wheel.offsets, [1, 5]);
		assert.equal(wheel.size, 6);
	});
	it("can create a 3-prime wheel", () => {
		const wheel = Wheel.create(3);
		assert.deepEqual(wheel.primes, [2, 3, 5]);
		assert.deepEqual(wheel.offsets, [1, 7, 11, 13, 17, 19, 23, 29]);
		assert.equal(wheel.size, 30);
	});
	it("can create a 4-prime wheel", () => {
		const wheel = Wheel.create(4);
		const expectedOffsets = Utils.range(1, 210).filter(n => n % 2 !== 0 && n % 3 !== 0 && n % 5 !== 0 && n % 7 !== 0);
		assert.deepEqual(wheel.primes, [2, 3, 5, 7]);
		assert.deepEqual(wheel.offsets, expectedOffsets);
		assert.equal(wheel.size, 210);
	});
});
describe("solve", () => {
	it("returns 6 when given 4", () => {
		assert.equal(solve(4), 6);
	});
});
