/*
This algorithm computes sculptures by building them row by row, from bottom to top.
*/

import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { HashPartition } from "./HashPartition.mjs";
import { Partition } from "./Partition.mjs";

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
		const right = this.weightWidthBound("right");
		const left = this.weightWidthBound("left");
		let result = 0;
		for(const blockPositions of GenUtils.subsets(ArrayUtils.range(left, right))) {
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
		const rangeSum = (min: number, max: number) => min * (max - min + 1) + (max - min) * (max - min + 1) / 2;

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
console.log(PartialSculpture.numSculptures(9));
console.timeEnd();
debugger;
