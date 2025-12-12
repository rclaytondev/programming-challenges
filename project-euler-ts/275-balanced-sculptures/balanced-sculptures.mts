import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";

export class IntRange {
	/* 
	Represents a range of integers from `min` to `max`, inclusive.
	*/
	readonly min: number;
	readonly max: number;

	constructor(min: number, max: number) {
		if(min < 0 || min > max || min !== Math.floor(min) || max !== Math.floor(max)) {
			throw new Error(`Cannot construct IntRange: invalid min and max (min=${min}, max=${max}).`);
		}
		this.min = min;
		this.max = max;
	}

	toString() {
		return `[${this.min} .. ${this.max}]`;
	}
}

// export class SidedRange {
// 	readonly side: "left" | "right";
// 	readonly range: IntRange;
// 	constructor(side: "left" | "right", range: IntRange) {
// 		this.side = side;
// 		this.range = range;
// 	}

// 	toString() {
// 		return `${this.range} on the ${this.side}`;
// 	}
// }

export class Component {
	readonly left: readonly IntRange[];
	readonly right: readonly IntRange[];
	constructor(left: IntRange[], right: IntRange[]) {
		this.left = left;
		this.right = right;
	}

	// sidedRanges() {
	// 	return [
	// 		...this.left.map(r => new SidedRange("left", r)),
	// 		...this.right.map(r => new SidedRange("right", r))
	// 	];
	// }
}

export class AbstractComponent {
	outer: readonly IntRange[];
	inner: readonly number[];

	constructor(outer: IntRange[], inner: number[]) {
		this.outer = outer;
		this.inner = inner;
	}
}

export class PartialSculpture {
	readonly left: number;
	readonly right: number;
	readonly weight: number;
	readonly blocks: number;
	readonly components: readonly Component[];

	constructor(left: number, right: number, weight: number, blocks: number, components: Component[]) {
		this.left = left;
		this.right = right;
		this.weight = weight;
		this.blocks = blocks;
		this.components = components;
	}

	abstractNextComponents() {
		const result: AbstractComponent[] = [];
		// const leftRanges = this.components.flatMap(c => c.left.map(r => new SidedRange("left", r)));
		// const rightRanges = this.components.flatMap(c => c.right.map(r => new SidedRange("right", r)));
		const leftRanges = this.components.flatMap(c => c.left);
		const rightRanges = this.components.flatMap(c => c.right);
		// const ranges = this.sidedRanges();
		for(let centralRanges = 0; centralRanges <= this.blocks; centralRanges ++) {
			const indices = ArrayUtils.range(0, centralRanges - 1);
			const leftOptions = GenUtils.subsets(GenUtils.cartesianPower([...indices, ...leftRanges], 2));
			const rightOptions = GenUtils.subsets(GenUtils.cartesianPower([...indices, ...rightRanges], 2));
			// const allConnections = GenUtils.cartesianPower([...indices, ...ranges], 2);
			for(const leftConnections of leftOptions) {
				for(const rightConnections of rightOptions) {

				}
			}
			// const leftOptions = [...GenUtils.subsets([...leftRanges, ...indices])];
			// const rightOptions = [...GenUtils.subsets([...rightRanges, ...indices])];
			// const options = GenUtils.cartesianProduct(leftOptions, rightOptions);
			// for(const connection of GenUtils.cartesianPower(options, ranges)) {
			// 	result.push(this.getAbstractComponents(connection));
			// }
		}
		return result;
	}
	getAbstractComponents(left: Set<[number | IntRange, number | IntRange]>) {

	}

	// getAbstractComponents(connections: [Set<number | IntRange>, Set<number | IntRange>][]) {
	// 	const partition = HashPartition.empty<SidedRange | number>();
	// 	for(const sidedRange of this.sidedRanges()) {
	// 		partition.add(sidedRange);
	// 	}
	// 	for(let i = 0; i < connections.length; i ++) {
	// 		partition.add(i);
	// 	}

	// }



	/*
	Utility methods
	*/
	// sidedRanges() {
	// 	return this.components.flatMap(c => c.sidedRanges());
	// }
}
