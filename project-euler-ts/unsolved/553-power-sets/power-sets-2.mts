import { BigintMath } from "../../../utils-ts/modules/math/BigintMath.mjs";
import { Utils } from "../../../utils-ts/modules/Utils.mjs";

const binomial = Utils.memoize(BigintMath.binomial);
let calls = 0;

export const graphsWithComponents = Utils.memoize((upperBound: bigint, components: bigint, modulo: bigint): bigint => {
	calls ++;
	/*
	Returns the number of elements A in P(P({1, 2, ... `upperBound`})) such that the graph for A has `components` components.
	*/
	if(upperBound <= 0n || components > upperBound) { return 0n; }

	if(components === 1n) {
		if(upperBound === 1n) { return 1n; }

		// const all = 2n ** (2n ** upperBound - 1n) - 1n;
		const all = BigintMath.modularExponentiate(2n, 2n ** upperBound - 1n, modulo) - 1n;
		let disconnected = 0n;
		for(let components = 2n; components <= upperBound; components ++) {
			disconnected += graphsWithComponents(upperBound, components, modulo);
			disconnected %= modulo;
		}
		return BigintMath.generalizedModulo(all - disconnected, modulo);
	}
	else {
		return (
			graphsContaining1(upperBound, components, modulo)
			+ graphsWithComponents(upperBound - 1n, components, modulo)
		) % modulo;
	}
});

export const graphsContaining1 = Utils.memoize((upperBound: bigint, components: bigint, modulo: bigint) => {
	calls ++;
	/*
	Returns the number of elements A in P(P({1, 2, ... `upperBound`})) such that:
	- The graph for A has `components` components.
	- The union of the sets in A contains 1.
	*/
	let count = 0n;
	for(let componentUnionSize = 1n; componentUnionSize + (components - 1n) <= upperBound; componentUnionSize ++) {
		const componentUnionChoices = binomial(upperBound - 1n, componentUnionSize - 1n);
		const componentChoices = fullConnectedGraphs(componentUnionSize, modulo);
		const remainingChoices = graphsWithComponents(upperBound - componentUnionSize, components - 1n, modulo);

		count += componentUnionChoices * componentChoices * remainingChoices;
		count %= modulo;
	}
	return count;
});

export const fullConnectedGraphs = Utils.memoize((upperBound: bigint, modulo: bigint) => {
	calls ++;
	/*
	Returns the number of elements A in P(P({1, 2, ... `upperBound`})) such that:
	- The graph for A is connected
	- The union of the sets in A is {1, 2, ... `upperBound`}.
	*/
	if(upperBound <= 0) { throw new Error("Unimplemented."); }
	if(upperBound === 1n) { return 1n; }

	const connected = graphsWithComponents(upperBound, 1n, modulo);
	let notFull = 0n;
	for(let size = 1n; size < upperBound; size ++) {
		notFull += binomial(upperBound, size) * fullConnectedGraphs(size, modulo);
		notFull %= modulo;
	}
	return BigintMath.generalizedModulo(connected - notFull, modulo);
});

// console.time();
// console.log(graphsWithComponents(300n, 10n, 1_000_000_007n));
// console.timeEnd();
// debugger;
