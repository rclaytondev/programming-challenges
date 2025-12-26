import { MapUtils } from "../../utils-ts/modules/core-extensions/MapUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const intPartitions = (num: number, parts: number, lowerBound: number = 1) => {
	if(parts === 1) {
		return (num >= lowerBound) ? [[num]] : [];
	}
	let result: number[][] = [];
	for(let first = lowerBound; first * parts <= num; first ++) {
		for(const partition of intPartitions(num - first, parts - 1, first)) {
			result.push([first, ...partition]);
		}
	}
	return result;
};

const numDisjointSets = (numElements: number, setSizes: number[]) => {
	let partialSum = 0;
	let result = 1;
	for(const setSize of setSizes) {
		result *= MathUtils.binomial(numElements - partialSum, setSize);
		partialSum += setSize;
	}
	return result;
};

export const graphsWithComponents = Utils.memoize((upperBound: number, numComponents: number) => {
	if(upperBound <= 0) { throw new Error("Unimplemented."); }
	if(upperBound === 1) {
		return (numComponents === 1) ? 1 : 0;
	}
	if(numComponents === 1) {
		return connectedGraphs(upperBound);
	}

	let result = 0;
	for(let graphUnionSize = numComponents; graphUnionSize <= upperBound; graphUnionSize ++) {
		for(const componentSizes of intPartitions(graphUnionSize, numComponents)) {
			const multiplicities = [...MapUtils.groupBy(componentSizes, n => n).values()].map(arr => arr.length);
			const graphCombinations = MathUtils.product(componentSizes.map(fullConnectedGraphs));
			const subsetCombinations = numDisjointSets(upperBound, componentSizes);
			const overcounting = MathUtils.product(multiplicities.map(MathUtils.factorial));
			result += graphCombinations * subsetCombinations / overcounting;
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
console.log(graphsWithComponents(40, 3));
console.timeEnd();
debugger;
