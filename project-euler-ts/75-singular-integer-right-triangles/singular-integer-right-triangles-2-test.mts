import { describe, it } from "mocha";
import { solve, trianglesWithPerimeter } from "./singular-integer-right-triangles-2.mjs";
import { assert } from "chai";

describe("solve", () => {
	it("gives the same result as the naive algorithm for 1000", () => {
		const result = solve(1000);
		assert.equal(result, 110);
	});
});
describe("trianglesWithPerimeter", () => {
	it("works for the singular right triangles from Project Euler", () => {
		const triangles = trianglesWithPerimeter(50);
		assert.equal(triangles.get(12), 1);
		assert.equal(triangles.get(24), 1);
		assert.equal(triangles.get(30), 1);
		assert.equal(triangles.get(36), 1);
		assert.equal(triangles.get(40), 1);
		assert.equal(triangles.get(48), 1);
	});
	it("works for a perimeter of 120, for which there are 3 right triangles", () => {
		const triangles = trianglesWithPerimeter(150);
		assert.equal(triangles.get(120), 3);
	});
	it("works for a perimeter of 8, 9, 10, and 11, for which there are no right triangles", () => {
		const triangles = trianglesWithPerimeter(20);
		assert.isFalse(triangles.has(8));
		assert.isFalse(triangles.has(9));
		assert.isFalse(triangles.has(10));
		assert.isFalse(triangles.has(11));
	});
});
