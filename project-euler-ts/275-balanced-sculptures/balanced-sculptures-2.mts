import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

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
	for(const component of components) {
		if(!isRange(component.left)) {
			return false;
		}
	}
	const usedBlocks = new Set<number>();
	for(const component of components) {
		for(const block of component.left) {
			if(usedBlocks.has(block - 1) || usedBlocks.has(block + 1)) {
				return false;
			}
		}
		for(const block of component.left) {
			usedBlocks.add(block);
		}
	}
	return true;
};

export const sculptures = (left: number, right: number, blocks: number, weight: number, components: Component[]): bigint => {
	/* Returns the number of partial sculptures in the region given by `left` and `right` that have the given weight and number of blocks (not including the two edge columns) and connect the given components. */
	if(right === left) {
		return blocks === 0 && weight === 0 && areConnectedComponents(components) ? 1n : 0n;
	}
	else if(right === left + 1) {
		throw new Error("Unimplemented.");
	}
	else {
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
	}
};

const getNextComponents = (components: Component[]): [Component[], Component[]][] => {
	throw new Error("Unimplemented.");
};
