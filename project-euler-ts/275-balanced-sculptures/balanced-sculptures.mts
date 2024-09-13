import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { HashPartition } from "./HashPartition.mjs";

type Components = Set<Set<["left" | "right", number]>>;
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

	children(): PartialSculpture[] {
		const leftHeight = Math.max(...this.leftColumn) + this.blocksLeft;
		const rightHeight = Math.max(...this.rightColumn) + this.blocksLeft;
		const children = [];
		for(let leftBlocks = 0; leftBlocks < Math.min(leftHeight, this.blocksLeft); leftBlocks ++) {
			for(const leftColumn of Utils.subsets(Utils.range(1, leftHeight))) {
				for(let rightBlocks = 0; rightBlocks < Math.min(rightHeight, this.blocksLeft - leftBlocks); rightBlocks ++) {
					for(const rightColumn of Utils.subsets(Utils.range(1, rightHeight))) {
						children.push(this.getChild([...leftColumn], [...rightColumn]));
					}
				}
			}
		}
		return [];
	}
	getChild(leftColumn: number[], rightColumn: number[]) {
		const nextX = this.maxX + 1;
		return new PartialSculpture({
			leftColumn: new Set(leftColumn),
			rightColumn: new Set(rightColumn),
			symmetrical: this.symmetrical && Utils.setEquals(leftColumn, rightColumn),
			weightDifference: this.weightDifference + nextX * (rightColumn.length - leftColumn.length),
			blocksLeft: this.blocksLeft - (rightColumn.length + leftColumn.length),
			maxX: nextX,
			components: this.getNewComponents(leftColumn, rightColumn)
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
		for(const vector of this.components.values()) {
			newComponents.delete(vector);
		}
		return newComponents;
	}

	completionsTimes2() {
		if(this.blocksLeft === 0) {
			if(this.weightDifference !== 0 || this.components.numSets !== 0) { return 0n; }
			return this.symmetrical ? 2n : 1n;
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
}
