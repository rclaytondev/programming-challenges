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

const areConnectedComponents = <T, >(components: Iterable<Iterable<T>>, areAdjacent: (v1: T, v2: T) => boolean) => {
	const partition = HashPartition.empty<T>();
	for(const component of components) {
		for(const value of component) {
			if([...partition.values()].some(v => areAdjacent(value, v))) {
				return false;
			}
		}
		for(const value of component) {
			partition.add(value);
			for(const oldValue of partition.values()) {
				if(areAdjacent(value, oldValue)) {
					partition.merge(value, oldValue);
				}
			}
		}
	}
	return partition.numSets === [...components].length;
};

export const sculptures = (left: number, right: number, blocks: number, weight: number, components: Component[]): bigint => {
	/* Returns the number of partial sculptures in the region given by `left` and `right` that have the given weight and number of blocks (not including the two edge columns) and connect the given components. */
	if(right <= left + 1) {
		return blocks === 0 && weight === 0 && areConnectedComponents<["left" | "right", number]>(
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
