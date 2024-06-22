import { describe, it } from "mocha";
import { assert } from "chai";
import { Sequence } from "../utils-ts/Sequence";
import { isPrime } from "../utils-ts/Math";
import { getArraySum } from "../utils-ts/Array";

const solve = (setSize: number = 5): number => {
	const cliques: number[][][] = new Array(setSize + 1).fill([]).map(v => []);
	const EMPTY_CLIQUE: number[] = [];
	cliques[0].push(EMPTY_CLIQUE);
	let maxPrime = Infinity;
	for(const [index, prime] of Sequence.PRIMES.entries()) {
		if(prime > maxPrime) { break; }
		for(let cliqueSize = 0; cliqueSize < setSize; cliqueSize ++) {
			for(const clique of cliques[cliqueSize]) {
				if(!clique.includes(prime) && clique.every(num => isPrime(Number.parseInt(`${num}${prime}`)) && isPrime(Number.parseInt(`${prime}${num}`)))) {
					cliques[cliqueSize + 1].push([...clique, prime]);
					if(cliqueSize + 1 === setSize) {
						console.log(`Found a ${cliqueSize + 1}-clique! (${[...clique, prime].join(",")})`)
						maxPrime = Math.min(maxPrime, prime - 2 * (setSize - 1));
					}
				}
			}
		}
	}
	return Math.min(...cliques[setSize].map(clique => getArraySum(clique)));
};

describe("solve", () => {
	it("solves the test case from Project Euler", () => {
		assert.equal(solve(4), 792);
	});
});
