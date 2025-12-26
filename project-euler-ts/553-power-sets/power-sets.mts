import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { SetUtils } from "../../utils-ts/modules/core-extensions/SetUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const graphsWithComponents = (upperBound: number, numComponents: number) => {
	if(upperBound === 0) {
		return (numComponents === 0 || numComponents === 1) ? 1 : 0;
	}
	if(numComponents === 1) {
		return connectedGraphs(upperBound);
	}

	let result = 0;
	const allComponentUnions = [
		...SetUtils.partitions(ArrayUtils.range(1, upperBound), numComponents),
		...[...SetUtils.partitions(ArrayUtils.range(1, upperBound), numComponents - 1)].map(s => new Set([...s, new Set([])])),
	];
	for(const componentUnions of allComponentUnions) {
		result += MathUtils.product([...componentUnions].map(componentUnion => fullConnectedGraphs(componentUnion.size)));
	}
	return result;
};

export const connectedGraphs = (upperBound: number) => {
	if(upperBound === 0) { return 2; }

	const all = 2 ** (2 ** upperBound);
	let disconnected = 0;
	for(let components = 2; components <= 2 ** upperBound; components ++) {
		disconnected += graphsWithComponents(upperBound, components);
	}
	return all - disconnected;
};

export const fullConnectedGraphs = (upperBound: number) => {
	if(upperBound === 0) { return 2; }

	const all = connectedGraphs(upperBound);
	let notFull = 0;
	for(let size = 0; size < upperBound; size ++) {
		notFull += MathUtils.binomial(upperBound, size) * fullConnectedGraphs(size);
	}
	return all - notFull;
};
