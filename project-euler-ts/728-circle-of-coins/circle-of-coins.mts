import { Field } from "../../utils-ts/modules/math/Field.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Matrix } from "../../utils-ts/modules/math/Matrix.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const factorize = (num: number) => {
	let factors = [];
	for(const [index, prime] of Sequence.PRIMES.entries()) {
		while(num % prime === 0) {
			factors.push(prime);
			num /= prime;
		}
		if(prime > num) {
			break;
		}
	}
	return factors;
};

const MODULO = 1000000007;
const ZMod2Z = Field.integersModulo(2);

const getMovesMatrix = (numCoins: number, flipsPerMove: number) => {
	const movesMatrix = new Matrix(numCoins, numCoins, ZMod2Z);
	for(let startPosition = 0; startPosition < numCoins; startPosition ++) {
		for(let coinPosition = 0; coinPosition < flipsPerMove; coinPosition ++) {
			movesMatrix.set((startPosition + coinPosition) % numCoins, startPosition, 1);
		}
	}
	return movesMatrix;
};
export const getNullity = Utils.memoize(
	(numCoins: number, flipsPerMove: number) => {
		const movesMatrix = getMovesMatrix(numCoins, flipsPerMove);
		return movesMatrix.nullity();
	},
	(numCoins: number, flipsPerMove: number) => {
		numCoins = flipsPerMove + (numCoins % flipsPerMove);
		return [numCoins, flipsPerMove] as [number, number];
	}
) as (numCoins: number, flipsPerMove: number) => number;
export const numSolvableStates = (numCoins: number, flipsPerMove: number, modulo: number = MODULO) => {
	if(MathUtils.gcd(flipsPerMove, numCoins) === 1) {
		return MathUtils.modularExponentiate(2, flipsPerMove % 2 === 0 ? numCoins - 1 : numCoins, modulo);
	}
	
	const nullity = getNullity(numCoins, flipsPerMove);
	const rank = numCoins - nullity;
	return MathUtils.modularExponentiate(2, rank, modulo);
};
export const solve = (upperBound: number, modulo: number = MODULO) => {
	let result = 0;
	let totals = [];
	for(let numCoins = 1; numCoins <= upperBound; numCoins ++) {
		let partialResults = [];
		for(let flipsPerMove = 1; flipsPerMove <= numCoins; flipsPerMove ++) {
			result += numSolvableStates(numCoins, flipsPerMove, modulo);
			partialResults.push(numSolvableStates(numCoins, flipsPerMove, modulo));
			result %= modulo;
		}
		console.log(`n=${numCoins}: sum is ${partialResults.map(n => `2^${Math.log2(n)}`).join(" + ")} = ${partialResults.join(" + ")} = ${MathUtils.sum(partialResults)}`);
		totals.push(MathUtils.sum(partialResults));
		if(numCoins === 15) {
			console.log(totals.map(t => factorize(t)));
			debugger;
		}
	}
	return result;
};

(() => {
	// const MAX_N = 25;
	// const matrix = new Matrix(MAX_N, MAX_N, Field.REALS);
	// for(let n = 1; n <= MAX_N; n ++) {
	// 	for(let k = 1; k <= n; k ++) {
	// 		matrix.set(n - 1, k - 1, getMovesMatrix(n, k).nullity());
	// 	}
	// }
	// console.log(matrix.toString());
	// debugger;
}) ();

(() => {
	// const matrix = getMovesMatrix(15, 5);
	// const steps = [matrix, ...[...matrix.gaussianElimination(false)].map(step => step.after)];
	// for(const step of steps) {
	// 	console.log("\n");
	// 	console.log(step.toString());
	// }
	// debugger;
}) ();

// const MAX_N = 10;
// const MAX_K = 10;

// for(let n = 1; n < MAX_N; n ++) {
// 	for(let k = 1; k <= n; k ++) {
// 		console.log(`nullity(M_${n},${k}) = ${getMovesMatrix(n, k).nullity()}`);
// 	}
// }
// debugger;
