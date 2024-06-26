import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";

const cartesianProduct = function*<T>(...arrays: T[][]): Generator<T[]> {
	if(arrays.length === 1) {
		for(const value of arrays[0]) {
			yield [value];
		}
	}
	else if(arrays.length > 1) {
		for(const firstItem of arrays[0]) {
			for(const tuple of cartesianProduct(...arrays.slice(1))) {
				yield [firstItem, ...tuple];
			}
		}
	}
};

export class Tree {
	children: Tree[];
	constructor(children: Tree[]) {
		this.children = children;
	}

	static line(numNodes: number): Tree {
		if(numNodes === 1) { return new Tree([]); }
		return new Tree([Tree.line(numNodes - 1)]);
	}
	static star(numTotalNodes: number) {
		const result = new Tree([]);
		for(let i = 0; i < numTotalNodes - 1; i ++) {
			result.children.push(new Tree([]));
		}
		return result;
	}


	private static multisetsOfTrees(treeSizes: number[]): Tree[][] {
		const distinctTreeSizes = [...new Set(treeSizes)].sort((a, b) => a - b);
		const treeSets = distinctTreeSizes.map(size => [...Utils.combinations(
			[...Tree.treesUpToReordering(size)], 
			treeSizes.filter(s => s === size).length, 
			"unlimited-duplicates", "sets")]
		);
		return [...cartesianProduct(...treeSets)].map(arr => arr.flat(1));
	}
	static *treesUpToReordering(numNodes: number) {
		if(numNodes === 1) {
			yield new Tree([]);
			return;
		}

		const POSITIVE_INTEGERS = new Sequence(n => n + 1);
		for(let numChildren = 1; numChildren < numNodes; numChildren ++) {
			for(const partition of POSITIVE_INTEGERS.multisetsWithSum(numChildren, numNodes - 1)) {
				for(const trees of Tree.multisetsOfTrees(partition)) {
					yield new Tree(trees);
				}
			}
		}
	}

	equals(tree: Tree): boolean {
		return this.children.length === tree.children.length && this.children.every((t, i) => t.equals(tree.children[i]));
	}
}
