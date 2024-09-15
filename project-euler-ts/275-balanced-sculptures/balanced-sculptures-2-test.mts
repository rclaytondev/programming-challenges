import { describe } from "mocha";
import { sculptures } from "./balanced-sculptures-2.mjs";
import { assert } from "chai";

describe("sculptures", () => {
	it("returns 1 when left=right and weight=blocks=0 and everything is valid", () => {
		const result = sculptures(7, 7, 0, 0, [{ left: [10], right: [10] }]);
		assert.equal(result, 1n);
	});
	it("returns 0 when left=right and the components are not connected", () => {
		const result = sculptures(7, 7, 0, 0, [{ left: [10, 12], right: [10, 12] }]);
		assert.equal(result, 0n);
	});
	it("returns 0 when there are different components that are connected to each other", () => {
		const result = sculptures(7, 7, 0, 0, [
			{ left: [10, 11], right: [10, 11] },
			{ left: [12], right: [12] }
		]);
		assert.equal(result, 0n);
	});
});
