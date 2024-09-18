import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { HashPartition } from "./HashPartition.mjs";

export class Component {
	left: Range[];
	right: Range[];
	constructor(left: Range[], right: Range[]) {
		this.left = left;
		this.right = right;
	}
}
export class Range {
	min: number;
	max: number;
	constructor(min: number, max: number = min) {
		this.min = min;
		this.max = max;
	}

	intersects(range: Range) {
		return this.max >= range.min && this.min <= range.max;
	}
	isAdjacentTo(range: Range) {
		return range.min === this.max + 1 || this.min === range.max + 1;
	}

	toString() {
		return `${this.min}-${this.max}`;
	}
}

export const sculptures = (left: number, right: number, blocks: number, weight: number, components: Component[]): bigint => {
	/* Returns the number of partial sculptures in the region given by `left` and `right` that have the given weight and number of blocks (not including the two edge columns) and connect the given components. */
	if(right <= left + 1) {
		return blocks === 0 && weight === 0 && HashPartition.areConnectedComponents<["left" | "right", Range]>(
			components.map(c => [...c.left.map(r => ["left", r]), ...c.right.map(r => ["right", r])] as ["left" | "right", Range][]),
			(([side1, r1], [side2, r2]) => r1.intersects(r2) || (side1 === side2 && r1.isAdjacentTo(r2)))
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
