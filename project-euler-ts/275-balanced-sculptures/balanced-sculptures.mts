/*
This algorithm computes sculptures by building them row by row, from bottom to top.
*/

import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { HashPartition } from "./HashPartition.mjs";
import { Partition } from "./Partition.mjs";

const rangeSum = (min: number, max: number) => min * (max - min + 1) + (max - min) * (max - min + 1) / 2;

export const setsWithSum = (sum: number, min: number, max: number, size: number): number[][] => {
	// Note: can be optimized, and args can be standardized (WLOG min=0)
	const result = [];
	if(min === max) {
		if(size === 0 && sum === 0) { result.push([]); }
		if(size === 1 && sum === min) { result.push([min]); }
		return result;
	}
	if(max === min + 1) {
		if(size === 0 && sum === 0) { result.push([]); }
		if(size === 1 && sum === min) { result.push([min]); }
		if(size === 1 && sum === max) { result.push([max]); }
		if(size === 2 && sum === min + max) { result.push([min, max]); }
		return result;
	}
	const mid = Math.floor((min + max) / 2);
	for(let leftSize = 0; leftSize <= mid - min + 1 && leftSize <= size; leftSize ++) {
		const rightSize = size - leftSize;
		for(let leftSum = rangeSum(min, min + leftSize - 1); leftSum <= rangeSum(mid - (leftSize - 1), mid); leftSum ++) {
			const leftSets = setsWithSum(leftSum, min, mid, leftSize);
			if(leftSets.length === 0) { continue; }
			const rightSum = sum - leftSum;
			for(const rightSet of setsWithSum(rightSum, mid + 1, max, rightSize)) {
				for(const leftSet of leftSets) {
					result.push([...leftSet, ...rightSet]);
				}
			}
		}
	}
	return result;
};

export class PartialSculpture {
	readonly components: Partition<number>;
	readonly blocksLeft: number;
	readonly weight: number;
	readonly mode: "symmetrical" | "all";

	constructor(components: Partition<number>, blocksLeft: number, weight: number, mode: "symmetrical" | "all") {
		this.components = components;
		this.blocksLeft = blocksLeft;
		this.weight = weight;
		this.mode = mode;
	}

	completions() {
		if(this.blocksLeft < 0) { return 0; }
		if(this.blocksLeft === 0) {
			const valid = (this.components.numSets === 1 && this.weight === 0);
			return valid ? 1 : 0;
		}
		let result = 0;
		for(const blockPositions of this.nextBlockPositions()) {
			if(this.mode === "symmetrical" && [...blockPositions].some(x => !blockPositions.has(-x))) {
				continue;
			}
			const allComponentsContinue = this.components.sets().every(s => 
				[...s].some(position => blockPositions.has(position))
			);
			if(!allComponentsContinue) { continue; }

			const next = this.nextPartialSculpture([...blockPositions]);
			result += next.completions();
		}
		return result;
	}
	nextComponents(blockPositions: number[]) {
		type Position = ({ row: "current" | "next", x: number });
		const hashFunction = (position: Position) => `${position.row}, ${position.x}`;
		const partition = HashPartition.fromPartition(this.components).map(
			x => ({ row: "current", x: x }) as Position,
			hashFunction
		);
		for(const x of blockPositions) {
			const position = { x: x, row: "next" } as Position;
			partition.add(position);
		}
		for(const x of blockPositions) {
			const position = { x: x, row: "next" } as Position;
			partition.merge(position, { x: x - 1, row: "next" });
			partition.merge(position, { x: x + 1, row: "next" });
			partition.merge(position, { x: x, row: "current" });
		}
		return partition.filter((position) => position.row === "next").map(({ x }) => x);
	}
	nextPartialSculpture(blockPositions: number[]) {
		const components = this.nextComponents(blockPositions);
		return new PartialSculpture(
			Partition.fromHashPartition(components),
			this.blocksLeft - blockPositions.length,
			this.weight + MathUtils.sum(blockPositions),
			this.mode
		)
	}

	weightWidthBound(side: "left" | "right") {
		for(let overhang = 1; true; overhang ++) {
			if(!this.canOverhang(side, overhang)) {
				return (side === "left") ? this.left() - (overhang - 1) : this.right() + (overhang - 1);
			}
		}
	}
	canOverhang(side: "left" | "right", overhangBlocks: number): boolean {
		const left = this.left();
		const right = this.right();
		const notAbove = ArrayUtils.range(left, right).filter(x => !this.components.has(x));

		const overhangWeight = ((side === "right")
			? rangeSum(right + 1, right + overhangBlocks)
			: rangeSum(left - overhangBlocks, left - 1)
		);
		const aboveBlocks = this.components.numSets;
		const aboveWeight = MathUtils.sum(this.components.sets().map(
			s => (side === "right") ? Math.min(...s) : Math.max(...s))
		);
		const notAboveBlocks = this.components.numSets - 1;
		const notAboveWeight = MathUtils.sum(
			side === "right" ? notAbove.slice(0, notAboveBlocks) : notAbove.slice(-notAboveBlocks)
		);
		const remainingBlocks = this.blocksLeft - (overhangBlocks + aboveBlocks + notAboveBlocks);
		if(remainingBlocks < 0) { return false; }
		const oppositeOverhangWeight = ((side === "right")
			? rangeSum(left - remainingBlocks, left - 1)
			: rangeSum(right + 1, right + remainingBlocks)
		);
		const weight = this.weight + overhangWeight + aboveWeight + notAboveWeight + oppositeOverhangWeight;
		return (side === "right") ? weight <= 0 : weight >= 0;
	}

	nextBlockPositions() {
		const right = this.weightWidthBound("right");
		const left = this.weightWidthBound("left");
		const result = [];
		for(let blocks = 1; blocks <= this.blocksLeft; blocks ++) {
			const blocksAbove = this.blocksLeft - blocks;
			const minWeightAbove = rangeSum(left - blocksAbove + 1, left);
			const maxWeightAbove = rangeSum(right, right + blocksAbove - 1);
			const minWeight = -this.weight - maxWeightAbove;
			const maxWeight = -this.weight - minWeightAbove;
			for(let weight = minWeight; weight <= maxWeight; weight ++) {
				for(const blocksSet of setsWithSum(weight, left, right, blocks)) {
					result.push(new Set(blocksSet));
				}
			}
		}
		return result;
	}

	
	right() {
		return Math.max(...this.components.values());
	}
	left() {
		return Math.min(...this.components.values());
	}

	static numSculptures(blocks: number) {
		const all = new PartialSculpture(Partition.fromSets([[0]]), blocks, 0, "all").completions();
		const symmetrical = new PartialSculpture(Partition.fromSets([[0]]), blocks, 0, "symmetrical").completions();
		const asymmetrical = all - symmetrical;
		return all - (asymmetrical / 2);
	}
}

console.time();
console.log(PartialSculpture.numSculptures(10));
console.timeEnd();
debugger;
