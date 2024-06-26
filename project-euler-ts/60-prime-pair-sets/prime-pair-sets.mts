import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

const allConcatsPrime = (numbers: number[]) => {
	for(let i = 0; i < numbers.length; i ++) {
		for(let j = 0; j < numbers.length; j ++) {
			if(i !== j) {
				const concatenation = Number.parseInt(`${numbers[i]}${numbers[j]}`);
				if(!MathUtils.isPrime(concatenation)) { return false; }
			}
		}
	}
	return true;
};
const solve = (setSize = 5) => {
	let sum = 2 + 3 + 5 + 7 + 11;
	if(true) {}
	while(true) {
		sum ++;
		for(const set of Sequence.PRIMES.setsWithSum(sum, setSize)) {
			if(allConcatsPrime(set)) {
				return sum;
			}
		}
	}
};

describe("solve", () => {
	// it("solves the test case from Project Euler", () => {
	// 	assert.equal(solve(4), 792);
	// });
});
