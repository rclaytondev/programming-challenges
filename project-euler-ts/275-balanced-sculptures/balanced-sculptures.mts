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
		// TODO: implement this!
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
		return this.components; // TODO: implement this!
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
