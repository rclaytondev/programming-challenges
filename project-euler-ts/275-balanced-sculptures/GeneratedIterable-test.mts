import { describe } from "mocha";
import { GeneratedIterable } from "./GeneratedIterable.mjs";
import { assert } from "chai";

describe("GeneratedIterable.concat", () => {
	it("returns the concatenated iterable, with the correct length", () => {
		const iterable1 = new GeneratedIterable(
			function*() {
				yield "a";
				yield "b";
			},
			2
		);
		const iterable2 = new GeneratedIterable(
			function*() {
				yield "c";
				yield "d";
				yield "e";
			},
			3
		);
		const concatenation = GeneratedIterable.concat(iterable1, iterable2);
		assert.deepEqual([...concatenation], ["a", "b", "c", "d", "e"]);
		assert.equal(concatenation.length, 5);
	});
});
