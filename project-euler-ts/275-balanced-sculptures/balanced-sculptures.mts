/*
This algorithm computes sculptures by building them row by row, from bottom to top.
*/

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
	readonly ranges: readonly IntRange[];
	constructor(ranges: IntRange[]) {
		this.ranges = ranges;
	}
}

export class PartialSculpture {
	readonly components: readonly Component[];
	readonly blocksLeft: number;
	readonly weight: number;

	constructor(components: Component[], blocksLeft: number, weight: number) {
		this.components = components;
		this.blocksLeft = blocksLeft;
		this.weight = weight;
	}

	completions() {
		const right = this.nextMaxRight();
		const left = this.nextMinLeft();
		for(const blockPositions of GenUtils.subsets(ArrayUtils.range(left, right))) {
			const sorted = [...blockPositions].sort((a, b) => a - b);
		}
	}

	nextMaxRight() {
		// TODO: optimize this!
		return this.right() + (this.blocksLeft - 1);
	}
	nextMinLeft() {
		return this.left() - (this.blocksLeft - 1);
	}

	
	right() {
		return Math.max(...this.components.map(c => Math.max(...c.ranges.map(r => r.max))));
	}
	left() {
		return Math.min(...this.components.map(c => Math.min(...c.ranges.map(r => r.min))));
	}
}
