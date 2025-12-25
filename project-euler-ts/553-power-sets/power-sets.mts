import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export const graphsWithComponents = (upperBound: number, components: number) => {
	if(upperBound === 0) {
		return (components === 0 || components === 1) ? 1 : 0;
	}
	if(components === 1) {
		return connectedGraphs(1);
	}

	let result = 0;
	for(const vertices of GenUtils.subsets(GenUtils.subsets(ArrayUtils.range(1, upperBound), components))) {
		result += MathUtils.product([...vertices].map(component => connectedGraphs(component.size)));
	}
	return result;
};

export const connectedGraphs = (upperBound: number) => {
	if(upperBound === 0) { return 2; }

	const all = 2 ** (2 ** upperBound);
	let disconnected = 0;
	for(let components = 2; components <= upperBound; components ++) {
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
