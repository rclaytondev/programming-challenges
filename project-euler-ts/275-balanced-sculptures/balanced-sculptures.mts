import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { HashPartition } from "./HashPartition.mjs";

type SculptureInfo = {
	leftColumn: Set<number>;
	rightColumn: Set<number>;
	symmetrical: boolean;
	weightDifference: number;
	blocksLeft: number;
	maxX: number;
	components: HashPartition<Vector>;
};

export class PartialSculpture {
	leftColumn: Set<number>;
	rightColumn: Set<number>;
	symmetrical: boolean;
	weightDifference: number; // positive value means the right side is heavier.
	blocksLeft: number;
	maxX: number;
	components: HashPartition<Vector>;

	constructor(config: SculptureInfo) {
		this.leftColumn = config.leftColumn;
		this.rightColumn = config.rightColumn;
		this.symmetrical = config.symmetrical;
		this.weightDifference = config.weightDifference;
		this.blocksLeft = config.blocksLeft;
		this.maxX = config.maxX;
		this.components = config.components;
	}
	static getVerticalSculpture(blocks: number[], totalBlocks: number) {
		const components = HashPartition.fromSets<Vector>(blocks.map(b => [new Vector(0, b)]));
		for(const block of blocks) {
			components.merge(new Vector(0, block), new Vector(0, block + 1));
		}
		return new PartialSculpture({
			leftColumn: new Set(blocks),
			rightColumn: new Set(blocks),
			symmetrical: true,
			weightDifference: 0,
			blocksLeft: totalBlocks - blocks.length,
			maxX: 0,
			components: components
		});
	}
	static verticalSculptures(totalBlocks: number) {
		const sculptures: PartialSculpture[] = [];
		const checkSubset = (blocks: number[], requiredSideBlocks: number) => {
			if(blocks.length + requiredSideBlocks <= totalBlocks) {
				sculptures.push(PartialSculpture.getVerticalSculpture(blocks, totalBlocks));
			}
			if(blocks.length + requiredSideBlocks < totalBlocks) {
				const last = blocks[blocks.length - 1];
				checkSubset(
					[...blocks, last + 1],
					requiredSideBlocks
				);
				const runLengthIs1 = (blocks[blocks.length - 2]) < last - 1;
				const extraSideBlocks = runLengthIs1 ? 1 : 2;
				for(let gap = 1; (blocks.length + 1) + (requiredSideBlocks + gap + extraSideBlocks) <= totalBlocks; gap ++) {
					checkSubset(
						[...blocks, last + gap + 1],
						requiredSideBlocks + gap + extraSideBlocks
					);
				}
			}
		};
		checkSubset([1], 0 );
		return sculptures;
	}

	children(): PartialSculpture[] {
		const leftHeight = Math.max(...this.leftColumn) + this.blocksLeft - 1;
		const rightHeight = Math.max(...this.rightColumn) + this.blocksLeft - 1;
		const children = [];
		for(const [leftBlocks, rightBlocks] of this.nextBlockCounts()) {
			for(const leftColumn of Utils.subsets(Utils.range(1, leftHeight), leftBlocks)) {
				for(const rightColumn of Utils.subsets(Utils.range(1, rightHeight), rightBlocks)) {
					const child = this.getChild([...leftColumn], [...rightColumn]);
					if(child !== null) {
						children.push(child);
					}
				}
			}
		}
		return children;
	}
	getChild(leftColumn: number[], rightColumn: number[]) {
		const nextX = this.maxX + 1;
		const components = this.getNewComponents(leftColumn, rightColumn);
		if(components === null) { return null; }
		return new PartialSculpture({
			leftColumn: new Set(leftColumn),
			rightColumn: new Set(rightColumn),
			symmetrical: this.symmetrical && Utils.setEquals(leftColumn, rightColumn),
			weightDifference: this.weightDifference + nextX * (rightColumn.length - leftColumn.length),
			blocksLeft: this.blocksLeft - (rightColumn.length + leftColumn.length),
			maxX: nextX,
			components: components
		});
	}
	getNewComponents(leftColumn: number[], rightColumn: number[]) {
		const nextX = this.maxX + 1;
		const newComponents = this.components.copy();
		for(const y of rightColumn) {
			newComponents.add(new Vector(nextX, y));
			newComponents.merge(new Vector(nextX, y), new Vector(this.maxX, y));
			newComponents.merge(new Vector(nextX, y), new Vector(nextX, y - 1));
		}
		for(const y of leftColumn) {
			newComponents.add(new Vector(-nextX, y));
			newComponents.merge(new Vector(-nextX, y), new Vector(-this.maxX, y));
			newComponents.merge(new Vector(-nextX, y), new Vector(-nextX, y - 1));
		}
		for(const component of newComponents.sets()) {
			if(![...component].some(v => v.x === nextX || v.x === -nextX)) {
				return null;
			}
		}
		for(const vector of this.components.values()) {
			newComponents.delete(vector);
		}
		return newComponents;
	}
	maxWeightOnSide(blocksLeft: number) {
		/* Returns the maximum possible weight difference that could be obtained after having added 1 more column to both sides, resulting in `blocksLeft` blocks remaining. */
		let result = 0;
		for(let i = this.maxX + 2; i <= this.maxX + blocksLeft + 1; i ++) {
			result += i;
		}
		return result;
	}
	nextBlockCounts() {
		const leftHeight = Math.max(...this.leftColumn) + this.blocksLeft - 1;
		const rightHeight = Math.max(...this.rightColumn) + this.blocksLeft - 1;
		const result: [number, number][] = [];
		for(let leftBlocks = 0; leftBlocks <= Math.min(leftHeight, this.blocksLeft); leftBlocks ++) {
			const newWeightDifference = this.weightDifference - (this.maxX + 1) * leftBlocks;
			if(this.maxWeightOnSide(this.blocksLeft - leftBlocks) < Math.abs(newWeightDifference)) {
				continue;
			}
			for(let rightBlocks = 0; rightBlocks <= Math.min(rightHeight, this.blocksLeft - leftBlocks); rightBlocks ++) {
				const newWeightDifference2 = this.weightDifference - (this.maxX + 1) * leftBlocks + (this.maxX + 1) * rightBlocks;
				if(this.maxWeightOnSide(this.blocksLeft - leftBlocks - rightBlocks) < Math.abs(newWeightDifference2)) {
					continue;
				}
				result.push([leftBlocks, rightBlocks]);
			}
		}
		return result;
	}

	completionsTimes2() {
		if(this.blocksLeft === 0) {
			if(this.weightDifference !== 0 || this.components.numSets !== 1) { return 0n; }
			return this.symmetrical ? 2n : 1n;
		}
		if(this.blocksLeft === 1) {
			if(this.components.numSets !== 1) {
				return 0n;
			}
			if(this.weightDifference === this.maxX + 1) {
				return BigInt(this.leftColumn.size);
			}
			if(this.weightDifference === -(this.maxX + 1)) {
				return BigInt(this.rightColumn.size);
			}
			return 0n;
		}
		let result = 0n;
		for(const child of this.children()) {
			result += child.completionsTimes2();
		}
		return result;
	}
	completions() {
		return this.completionsTimes2() / 2n;
	}
	toString() {
		const componentsString = this.components.sets().map(set => `[${[...set].sort()}]`).join(", ");
		return `${this.symmetrical}, ${this.weightDifference}, ${this.blocksLeft}, ${componentsString}`;
	}
}

export const balancedSculptures = (blocks: number) => {
	let count = 0n;
	for(const sculpture of PartialSculpture.verticalSculptures(blocks)) {
		count += sculpture.completions();
	}
	return count;
};
