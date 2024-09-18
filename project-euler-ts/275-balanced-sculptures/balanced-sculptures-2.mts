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

export const sculptures = (left: number, right: number, blocks: number, weight: number, components: Component[]): bigint => {
	/* Returns the number of partial sculptures in the region given by `left` and `right` that have the given weight and number of blocks (not including the two edge columns) and connect the given components. */
	if(right <= left + 1) {
		return blocks === 0 && weight === 0 && HashPartition.areConnectedComponents<["left" | "right", number]>(
			components.map(c => [...c.left.map(n => ["left", n]), ...c.right.map(n => ["right", n])] as ["left" | "right", number][]),
			(([side1, y1], [side2, y2]) => y1 === y2 || (side1 === side2 && Math.abs(y1 - y2) <= 1))
		) ? 1n : 0n;
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
