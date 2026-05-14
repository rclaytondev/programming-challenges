import { describe } from "mocha";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const solve = (setSize: number = 5): number => {
	const cliques: number[][][] = new Array(setSize + 1).fill([]).map(_ => []);
	const EMPTY_CLIQUE: number[] = [];
	cliques[0].push(EMPTY_CLIQUE);
	let maxPrime = Infinity;
	for(const prime of Sequence.PRIMES) {
		if(prime > maxPrime) { break; }
		for(let cliqueSize = 0; cliqueSize < setSize; cliqueSize ++) {
			for(const clique of cliques[cliqueSize]) {
				if(!clique.includes(prime) && clique.every(num => MathUtils.isPrime(Number.parseInt(`${num}${prime}`)) && MathUtils.isPrime(Number.parseInt(`${prime}${num}`)))) {
					cliques[cliqueSize + 1].push([...clique, prime]);
					if(cliqueSize + 1 === setSize) {
						maxPrime = Math.min(maxPrime, prime - 2 * (setSize - 1));
					}
				}
			}
		}
	}
	return Math.min(...cliques[setSize].map(clique => MathUtils.sum(clique)));
};

describe("solve", () => {
	// it("solves the test case from Project Euler", () => {
	// 	assert.equal(solve(4), 792);
	// });
});
