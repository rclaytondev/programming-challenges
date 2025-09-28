import { assert } from "chai";
import { cardsRequired } from "./rooms-of-doom.mjs";
import { describe, it } from "mocha";


describe("cardsRequired", () => {
	it("works for 2 rooms and 3 cards", () => {
		const result = cardsRequired(2, 3);
		assert.equal(result, 3);
	});
	it("works for 3 rooms and 3 cards", () => {
		const result = cardsRequired(3, 3);
		assert.equal(result, 6);
	});
	it("works for 3 cards and 6 rooms", () => {
		const result = cardsRequired(6, 3);
		assert.equal(result, 123);
	});
	it("works for 4 cards and 6 rooms", () => {
		const result = cardsRequired(6, 4);
		assert.equal(result, 23);
	});
});
