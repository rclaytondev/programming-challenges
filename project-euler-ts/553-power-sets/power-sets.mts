import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { SetUtils } from "../../utils-ts/modules/core-extensions/SetUtils.mjs";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { GeneratedIterable } from "./GeneratedIterable.mjs";

export const maxUnionSubsets = (upperBound: number) => {
	/* 
	Returns the sets A of subsets of {1, 2, ... upperBound} such that union(A) = {1, 2, ... upperBound}.
	*/
	if(upperBound === 0) {
		return GeneratedIterable.fromArray([new Set([new Set<number>([])])]);
	}

	const all = 2 ** (2 ** upperBound);
	let notMaxUnion = 0;
	for(let i = 1; i <= upperBound; i ++) {
		const sign = (i % 2 === 0) ? -1 : 1;
		notMaxUnion += sign * MathUtils.binomial(upperBound, i) * (2 ** (2 ** (upperBound - i)));
	}
	return new GeneratedIterable(
		function*() {
			for(const set of GenUtils.subsets(GenUtils.subsets(ArrayUtils.range(1, upperBound)))) {
				if(SetUtils.union(...set).size === upperBound) {
					yield set;
				}
			}
		},
		all - notMaxUnion
	)
};

export const subsetsWithElements = (upperBound: number, requiredElements: Set<Set<number>>) => {
	/*
	Returns the sets A of subsets of {1, 2, ... upperBound} such that union(A) contains at least one element from each required set.
	*/
};

export const connectedGraphs = (upperBound: number): GeneratedIterable<HashSet<HashSet<number>>> => {
	if(upperBound === 0) {
		return GeneratedIterable.fromArray([new HashSet([new HashSet<number>()])]);
	}
	const notContainingLast = connectedGraphs(upperBound - 1);
	const containingLast: GeneratedIterable<HashSet<HashSet<number>>>[] = [];
	for(const unionOfVertices of GenUtils.subsets(ArrayUtils.range(1, upperBound - 1))) {
		for(const unionsOfComponents of SetUtils.partitions(unionOfVertices)) {
			const subgraphChoices = [...unionsOfComponents].map(fullConnectedSubgraphs);
			// const connectionsChoices = maxUnionSubsets(upperBound - 1).map(
			// 	subsets => new HashSet(subsets).map(component => new HashSet([...component, upperBound]))
			// );
			const connectionsChoices = maxUnionSubsets(upperBound - 1).map(
				subsets => new HashSet(subsets).map(component => new HashSet([...component, upperBound]))
			);
			const allChoices = [...subgraphChoices, connectionsChoices];
			const combinations = GeneratedIterable.tuples(...allChoices);
			containingLast.push(combinations.map((sets) => HashSet.union<HashSet<number>>(...sets)));
		}
	}
	return GeneratedIterable.concat(notContainingLast, ...containingLast);
};

export const fullConnectedGraphs = (upperBound: number): GeneratedIterable<HashSet<HashSet<number>>> => {
	if(upperBound === 0) {
		return GeneratedIterable.fromArray([new HashSet([new HashSet<number>()])]);
	}
	// const all = GeneratedIterable.fromArray(ArrayUtils.range(1, upperBound)).subsets();
	const all = connectedGraphs(upperBound);
	const notFull = GeneratedIterable.concat(
		...ArrayUtils.range(1, upperBound - 1)
		.map(n => 
			GeneratedIterable.tuples(
				fullConnectedGraphs(n),
				GeneratedIterable.range(1, upperBound).subsets().map(s => [...s])
			)
			.map(([graph, labels]) => graph.map(set => set.map(i => labels[i])))
		)
	);
	return all.removeByHash(notFull);
};

const fullConnectedSubgraphs = (labels: Iterable<number>) => {
	const labelsArray = [...labels];
	return fullConnectedGraphs(labelsArray.length).map(set => set.map(s => s.map(i => labelsArray[i])));
};


const foo = [
	GeneratedIterable.range(1, 3),
	GeneratedIterable.range(4, 6),
];
const bar = GeneratedIterable.range(7, 9);
const qux = GeneratedIterable.tuples(
	...foo,
	bar
);
