import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { INPUT } from "./balanced-sculptures-2.mjs";
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

const cachedResults = new Map<string, bigint>();

export class PartialSculpture {
	leftColumn: Set<number>;
	rightColumn: Set<number>;
	symmetrical: boolean;
	weightDifference: number; // positive value means the right side is heavier.
	blocksLeft: number;
	maxX: number;
	components: HashPartition<Vector>;

	static canBeBalanced(weightDifference: number, maxX: number, blocks: number, canUseLeft: boolean = true, canUseRight: boolean = true) {
		if(blocks === 0 || (!canUseLeft && !canUseRight)) {
			return blocks === 0 && weightDifference === 0;
		}
		for(let leftBlocks = 0; leftBlocks <= blocks && (canUseLeft || leftBlocks === 0); leftBlocks ++) {
			for(let rightBlocks = 0; leftBlocks + rightBlocks <= blocks && (canUseRight || rightBlocks === 0); rightBlocks ++) {
				if(PartialSculpture.canBeBalanced(
					weightDifference + (rightBlocks - leftBlocks) * (maxX + 1),
					maxX + 1,
					blocks - (leftBlocks + rightBlocks),
					canUseLeft && leftBlocks !== 0,
					canUseRight && rightBlocks !== 0
				)) { return true; }
			}
		}
		return false;
	}

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
		const children = [];
		for(const [leftBlocks, rightBlocks] of this.nextBlockCounts()) {
			for(const leftColumn of this.nextColumnCombinations("left", leftBlocks)) {
				for(const rightColumn of this.nextColumnCombinations("right", rightBlocks)) {
					const child = this.getChild([...leftColumn], [...rightColumn]);
					if(child !== null) {
						children.push(child);
					}
				}
			}
		}
		return children;
	}
	nextColumnCombinations(side: "left" | "right", numBlocks: number): Iterable<Set<number>> {
		if(numBlocks === 0) {
			return [new Set([])];
		}
		const height = Math.max(...(side === "left" ? this.leftColumn : this.rightColumn)) + this.blocksLeft - 1;
		return Utils.subsets(Utils.range(1, height), numBlocks);
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
		const sets = newComponents.sets();
		for(const component of sets) {
			if(![...component].some(v => v.x === nextX || v.x === -nextX)) {
				return null;
			}
		}
		let foundLeftOnly = false;
		let foundRightOnly = false;
		for(const component of sets) {
			if([...component].every(v => v.x < 0)) {
				foundLeftOnly = true;
			}
			if([...component].every(v => v.x > 0)) {
				foundRightOnly = true;
			}
			if(foundLeftOnly && foundRightOnly) {
				return null;
			}
		}
		for(const vector of this.components.values()) {
			newComponents.delete(vector);
		}
		return newComponents;
	}
	nextBlockCounts() {
		const leftHeight = Math.max(...this.leftColumn) + this.blocksLeft - 1;
		const rightHeight = Math.max(...this.rightColumn) + this.blocksLeft - 1;
		const result: [number, number][] = [];
		for(let leftBlocks = 0; leftBlocks === 0 || leftBlocks <= Math.min(leftHeight, this.blocksLeft); leftBlocks ++) {
			if(this.leftColumn.size === 0 && leftBlocks > 0) { break; }
			for(let rightBlocks = 0; rightBlocks === 0 || rightBlocks <= Math.min(rightHeight, this.blocksLeft - leftBlocks); rightBlocks ++) {
				if(this.rightColumn.size === 0 && rightBlocks > 0) { break; }
				if(!PartialSculpture.canBeBalanced(
					this.weightDifference + (rightBlocks - leftBlocks) * (this.maxX + 1),
					this.maxX + 1,
					this.blocksLeft - (leftBlocks + rightBlocks)
				)) { continue; }
				result.push([leftBlocks, rightBlocks]);
			}
		}
		return result;
	}

	completions(mode: "symmetrical" | "asymmetrical") {
		if(this.blocksLeft === 0) {
			const balanced = this.weightDifference === 0;
			const connected = this.components.numSets === 1;
			const matchesMode = this.symmetrical === (mode === "symmetrical");
			return (balanced && connected && matchesMode) ? 1n : 0n;
		}
		const sculptureString = `${this.toString()}, ${mode}`;
		if(cachedResults.has(sculptureString)) {
			return cachedResults.get(sculptureString)!;
		}
		let result = 0n;
		for(const child of this.children()) {
			result += child.completions(mode);
		}
		cachedResults.set(sculptureString, result);
		return result;
	}
	toString() {
		const componentsString = this.components.sets().map(set => `[${[...set].sort()}]`).join(", ");
		return `${this.symmetrical}, ${this.weightDifference}, ${this.blocksLeft}, ${componentsString}`;
	}
}

export const balancedSculptures = (blocks: number) => {
	let count = 0n;
	for(const sculpture of PartialSculpture.verticalSculptures(blocks)) {
		count += sculpture.completions("symmetrical");
		count += sculpture.completions("asymmetrical") / 2n;
	}
	return count;
};

// console.time();
// console.log(`1st algorithm outputs ${balancedSculptures(INPUT)}`);
// console.timeEnd();
// debugger;
