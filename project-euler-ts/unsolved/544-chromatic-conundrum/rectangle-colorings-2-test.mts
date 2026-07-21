import { describe } from "mocha";
import { ColoredRectangle } from "./rectangle-colorings-2.mjs";
import { assert } from "chai";

describe("ColoredRectangle.colorings", () => {
	it("matches the result from Project Euler for a 2x2 square with 3 colors", () => {
		const rectangle = ColoredRectangle.empty(2, 2, 3);
		const colorings = rectangle.colorings();
		assert.equal(colorings, 18);
	});
});
