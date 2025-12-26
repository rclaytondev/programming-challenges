import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { SetUtils } from "../../utils-ts/modules/core-extensions/SetUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const graphsWithComponents = Utils.memoize((upperBound: number, numComponents: number) => {
	if(upperBound <= 0) { throw new Error("Unimplemented."); }
	if(upperBound === 1) {
		return (numComponents === 1) ? 1 : 0;
	}
	if(numComponents === 1) {
		return connectedGraphs(upperBound);
	}

	let result = 0;
	for(const graphUnion of GenUtils.subsets(ArrayUtils.range(1, upperBound))) {
		for(const componentUnions of SetUtils.partitions(graphUnion, numComponents)) {
			result += MathUtils.product([...componentUnions].map(componentUnion => fullConnectedGraphs(componentUnion.size)));
		}
	}
	return result;
});

export const connectedGraphs = Utils.memoize((upperBound: number) => {
	if(upperBound <= 0) { throw new Error("Unimplemented."); }
	if(upperBound === 1) { return 1; }

	const all = 2 ** (2 ** upperBound - 1) - 1;
	let disconnected = 0;
	for(let components = 2; components <= 2 ** upperBound; components ++) {
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
console.log(graphsWithComponents(11, 3));
console.timeEnd();
debugger;
