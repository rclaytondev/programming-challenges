/*
This algorithm computes sculptures by building them row by row, from bottom to top.
*/

import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";

export class Component {
	readonly positions: number[];
	constructor(positions: number[]) {
		this.positions = positions;
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
			const allComponentsContinue = this.components.every(c => 
				c.positions.some(p => blockPositions.has(p))
			);
			if(!allComponentsContinue) { continue; }


		}
	}
	nextComponents(blockPositions: number[]) {
		
	}

	nextMaxRight() {
		// TODO: optimize this!
		return this.right() + (this.blocksLeft - 1);
	}
	nextMinLeft() {
		return this.left() - (this.blocksLeft - 1);
	}

	
	right() {
		return Math.max(...this.components.map(c => Math.max(...c.positions)));
	}
	left() {
		return Math.min(...this.components.map(c => Math.min(...c.positions)));
	}
}
