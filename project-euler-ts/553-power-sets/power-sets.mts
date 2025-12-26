import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const numDisjointSets = (numElements: bigint, setSize: bigint, numSets: bigint) => {
	let result = 1n;
	for(let i = 0n; i < numSets; i ++) {
		result *= BigintMath.binomial(numElements - setSize * i, setSize);
	}
	return result / BigintMath.factorial(numSets);
};

let calls = 0;


export const graphsWithComponents = Utils.memoize((upperBound: bigint, numComponents: bigint, smallestComponentUnion: bigint = 1n, modulo: bigint = 1_000_000_007n) => {
	calls ++;
	if(numComponents === 1n) {
		let result = 0n;
		for(let i = smallestComponentUnion; i <= upperBound; i ++) {
			result += BigintMath.binomial(upperBound, i) * fullConnectedGraphs(i, modulo);
			result %= modulo;
		}
		return result;
	}
	if(numComponents === 0n) { return 1n; }

	let result = 0n;
	for(let componentUnionSize = smallestComponentUnion; componentUnionSize * numComponents <= upperBound; componentUnionSize ++) {
		for(let componentsWithSize = 1n; componentsWithSize <= numComponents; componentsWithSize ++) {
			if(componentUnionSize * componentsWithSize + (componentUnionSize + 1n) * (numComponents - componentsWithSize) > upperBound) {
				continue;
			}
			const remainingElements = upperBound - componentUnionSize * componentsWithSize;
			const remainingComponents = numComponents - componentsWithSize;
			if(remainingElements < 0n || remainingComponents < 0n) { break; }


			const setChoices = numDisjointSets(upperBound, componentUnionSize, componentsWithSize);
			const subgraphChoices = fullConnectedGraphs(componentUnionSize, modulo) ** componentsWithSize;
			const remainingChoices = graphsWithComponents(remainingElements, remainingComponents, componentUnionSize + 1n, modulo);
			result += setChoices * subgraphChoices * remainingChoices;
			result %= modulo;
		}
	}
	return result;
});

export const connectedGraphs = Utils.memoize((upperBound: bigint, modulo: bigint = 1_000_000_007n) => {
	calls ++;
	if(upperBound <= 0n) { throw new Error("Unimplemented."); }
	if(upperBound === 1n) { return 1n; }

	// const all = 2n ** (2n ** upperBound - 1n) - 1n;
	const all = BigintMath.modularExponentiate(2n, (2n ** upperBound - 1n), modulo) - 1n;
	let disconnected = 0n;
	for(let components = 2n; components <= upperBound; components ++) {
		disconnected += graphsWithComponents(upperBound, components, 1n, modulo);
		disconnected %= modulo;
	}
	return BigintMath.generalizedModulo(all - disconnected, modulo);
});

export const fullConnectedGraphs = Utils.memoize((upperBound: bigint, modulo: bigint = 1_000_000_007n) => {
	calls ++;
	if(upperBound <= 0) { throw new Error("Unimplemented."); }
	if(upperBound === 1n) { return 1n; }

	const all = connectedGraphs(upperBound, modulo);
	let notFull = 0n;
	for(let size = 1n; size < upperBound; size ++) {
		notFull += BigintMath.binomial(upperBound, size) * fullConnectedGraphs(size, modulo);
		notFull %= modulo;
	}
	return BigintMath.generalizedModulo(all - notFull, modulo);
});

console.time();
console.log(graphsWithComponents(100n, 10n));
console.timeEnd();
debugger;
