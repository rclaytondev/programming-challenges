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

export class Component {
	readonly left: readonly IntRange[];
	readonly right: readonly IntRange[];
	constructor(left: IntRange[], right: IntRange[]) {
		this.left = left;
		this.right = right;
	}
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
		const leftRanges = this.components.flatMap(c => c.left);
		const rightRanges = this.components.flatMap(c => c.right);
		for(let centralRanges = 0; centralRanges <= this.blocks; centralRanges ++) {
			const indices = ArrayUtils.range(0, centralRanges - 1);
			const leftOptions = GenUtils.subsets(GenUtils.cartesianPower([...indices, ...leftRanges], 2));
			const rightOptions = GenUtils.subsets(GenUtils.cartesianPower([...indices, ...rightRanges], 2));
			for(const leftConnections of leftOptions) {
				for(const rightConnections of rightOptions) {

				}
			}
		}
		return result;
	}
	getAbstractComponents(left: Set<[number | IntRange, number | IntRange]>) {

	}
}
