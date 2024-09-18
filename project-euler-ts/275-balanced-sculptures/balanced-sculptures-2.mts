import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { HashPartition } from "./HashPartition.mjs";
import { Partition } from "./Partition.mjs";

type Component = { left: number[], right: number[] };

const isRange = (numbers: number[]) => {
	for(const [i, num] of numbers.entries()) {
		if(i + 1 < numbers.length && numbers[i + 1] !== num + 1) {
			return false;
		}
	}
	return true;
};

const areConnectedComponents = (components: Component[]) => {
	const partition = HashPartition.empty<["left" | "right", number]>();
	for(const component of components) {
		for(const block of component.left) {
			if(partition.has(["left", block-1]) || partition.has(["left", block+1]) || partition.has(["right", block])) {
				return false;
			}
		}
		for(const block of component.right) {
			if(partition.has(["right", block-1]) || partition.has(["right", block+1]) || partition.has(["left", block])) {
				return false;
			}
		}

		for(const block of component.left) {
			partition.add(["left", block]);
		}
		for(const block of component.right) {
			partition.add(["right", block]);
		}
		for(const block of component.left) {
			partition.merge(["left", block], ["right", block]);
			partition.merge(["left", block], ["left", block + 1]);
		}
		for(const block of component.right) {
			partition.merge(["right", block], ["right", block + 1]);
		}
	}
	return partition.numSets === components.length;
};

export const sculptures = (left: number, right: number, blocks: number, weight: number, components: Component[]): bigint => {
	/* Returns the number of partial sculptures in the region given by `left` and `right` that have the given weight and number of blocks (not including the two edge columns) and connect the given components. */
	if(right <= left + 1) {
		return blocks === 0 && weight === 0 && areConnectedComponents(components) ? 1n : 0n;
	}
	let result = 0n;
	const middle = Math.floor((left + right) / 2);
	for(const [leftComponents, rightComponents] of getNextComponents(components)) {
		const middleBlocks = MathUtils.sum(leftComponents.map(c => c.right.length));
		for(let leftBlocks = 0; leftBlocks <= blocks; leftBlocks ++) {
			const rightBlocks = blocks - middleBlocks - leftBlocks;
			for(let leftWeight = 0; leftWeight <= blocks; leftWeight ++) {
				const rightWeight = weight - (middle * middleBlocks) - leftWeight;
				const leftSculptures = sculptures(left, middle, leftBlocks, leftWeight, leftComponents);
				const rightSculptures = sculptures(middle, right, rightBlocks, rightWeight, rightComponents);
				result += leftSculptures * rightSculptures;
			}
		}
	}
	return result;
};

const getNextComponents = (components: Component[]): [Component[], Component[]][] => {
	throw new Error("Unimplemented.");
};
