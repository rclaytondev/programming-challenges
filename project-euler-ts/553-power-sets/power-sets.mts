import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const numDisjointSets = (numElements: number, setSize: number, numSets: number) => {
	let result = 1;
	for(let i = 0; i < numSets; i ++) {
		result *= MathUtils.binomial(numElements - setSize * i, setSize);
	}
	return result / MathUtils.factorial(numSets);
};


export const graphsWithComponents = Utils.memoize((upperBound: number, numComponents: number, smallestComponentUnion: number = 1) => {
	if(numComponents === 1) {
		let result = 0;
		for(let i = smallestComponentUnion; i <= upperBound; i ++) {
			result += MathUtils.binomial(upperBound, i) * fullConnectedGraphs(i);
		}
		return result;
	}
	if(numComponents === 0) { return 1; }

	let result = 0;
	for(let componentUnionSize = smallestComponentUnion; componentUnionSize < upperBound; componentUnionSize ++) {
		for(let componentsWithSize = 1; componentsWithSize <= numComponents; componentsWithSize ++) {
			const remainingElements = upperBound - componentUnionSize * componentsWithSize;
			const remainingComponents = numComponents - componentsWithSize;
			if(remainingElements < 0 || remainingComponents < 0) { break; }


			const setChoices = numDisjointSets(upperBound, componentUnionSize, componentsWithSize);
			const subgraphChoices = fullConnectedGraphs(componentUnionSize) ** componentsWithSize;
			const remainingChoices = graphsWithComponents(remainingElements, remainingComponents, componentUnionSize + 1);
			result += setChoices * subgraphChoices * remainingChoices;
		}
	}
	return result;
});

export const connectedGraphs = Utils.memoize((upperBound: number) => {
	if(upperBound <= 0) { throw new Error("Unimplemented."); }
	if(upperBound === 1) { return 1; }

	const all = 2 ** (2 ** upperBound - 1) - 1;
	let disconnected = 0;
	for(let components = 2; components <= upperBound; components ++) {
		disconnected += graphsWithComponents(upperBound, components);
	}
	return all - disconnected;
});

export const fullConnectedGraphs = Utils.memoize((upperBound: number) => {
	if(upperBound <= 0) { throw new Error("Unimplemented."); }
	if(upperBound === 1) { return 1; }

	const all = connectedGraphs(upperBound);
	let notFull = 0;
	for(let size = 1; size < upperBound; size ++) {
		notFull += MathUtils.binomial(upperBound, size) * fullConnectedGraphs(size);
	}
	return all - notFull;
});

console.time();
console.log(graphsWithComponents(100, 10));
console.timeEnd();
debugger;
