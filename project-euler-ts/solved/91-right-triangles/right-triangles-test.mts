import { assert } from "chai";
import { describe, it } from "mocha";
import { numRightTriangles } from "./right-triangles.mjs";

describe("numRightTriangles", () => {
	it("returns the number of triangles with one vertex at the origin in the given square", () => {
		assert.equal(numRightTriangles(2), 14);
	});
});
