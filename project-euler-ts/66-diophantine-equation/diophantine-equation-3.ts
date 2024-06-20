import { assert } from "chai";
import { Sequence } from "../utils-ts/Sequence";

const minSolution: (D: number) => number = (D: number) => {
	const primes = [];
	let stepSize = 1;
	let offsets = [1];
	let nextOffsets = [];
	for(const [_, prime] of Sequence.PRIMES.entries()) {
		for(let step = 0; step < stepSize * prime; step += stepSize) {
			
		}
	}
	return 0; // TODO: finish this method
}



describe("minSolution", () => {
	const testCases = [
		{ input: 2, output: 3 },
		{ input: 3, output: 2 },
		{ input: 5, output: 9 },
		{ input: 6, output: 5 },
		{ input: 7, output: 8 },
		{ input: 8, output: 3 },

		{ input: 20, output: 9 },
		{ input: 101, output: 201 },
		{ input: 139, output: 77563250 }
	];
	for(const { input, output } of testCases) {
		it(`returns ${output} when given an input of ${input}`, () => {
			assert.equal(minSolution(input), output);
		});
	}
});
