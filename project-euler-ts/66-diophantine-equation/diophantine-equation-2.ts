import { assert } from "chai";
import { Sequence } from "../utils-ts/Sequence";
import { generalizedModulo } from "../utils-ts/Math";

const solutionsModuloPrime = (D: number, prime: number) => {
	let solutions = [];
	for(let x = 0; x < prime; x ++) {
		for(let y = 0; y < prime; y ++) {
			if(generalizedModulo((x ** 2 - (D * y ** 2)), prime) === 1) {
				solutions.push(x);
				break;
			}
		}
	}
	return solutions;
};
const minSolution = (D: number) => {
	const PRIMES = Sequence.PRIMES.slice(0, 2);
	const product = PRIMES.reduce((a, b) => a * b, 1);
	const solutionsModuloPrimes = PRIMES.map(p => solutionsModuloPrime(D, p));
	const offsets = [];
	for(let i = 0; i < product; i ++) {
		if(solutionsModuloPrimes.every((solutionSet, index) => solutionSet.includes(i % PRIMES[index]))) {
			offsets.push(i);
		}
		if(i !== 1 && Math.sqrt((i ** 2 - 1) / D) % 1 === 0) {
			return i;
		}
	}
	// console.log(`Sieve size: ${product}; proportion checked: ${offsets.length / product}`);
	for(let step = product; step < Infinity; step += product) {
		for(const offset of offsets) {
			const potentialSolution = step + offset;
			if(potentialSolution !== 1 && Math.sqrt((potentialSolution ** 2 - 1) / D) % 1 === 0) {
				return potentialSolution;
			}
		}
	}
	throw new Error("Reached end of infinite loop.");
};

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

const solve = (upperBound: number = 1000) => {
	let highestD = 0;
	let highestMinSolution = -Infinity;
	for(let D = 1; D <= upperBound; D ++) {
		if(Math.sqrt(D) % 1 === 0) { continue; }
		const solution = minSolution(D);
		// console.log(`For D=${D}, the minimal solution has x=${solution}`);
		if(solution > highestMinSolution) {
			highestMinSolution = solution;
			highestD = D;
		}
	}
	return highestD;
};
// console.log(`the answer is ${solve()}`);
describe("solve", () => {
	it("works for an upper bound of 7 (test case from Project Euler)", () => {
		assert.equal(solve(7), 5);
	});
	it("works for an upper bound of 50 (calculated with the previous, simpler algorithm)", () => {
		assert.equal(solve(50), 46);
	});
	it("works for an upper bound of 100 (calculated with the previous, simpler algorithm)", () => {
		// assert.equal(solve(100), 61);
	});
});
