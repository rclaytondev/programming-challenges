type Components = Set<Set<["left" | "right", number]>>;

class PartialSculpture {
	leftColumn: Set<number>;
	rightColumn: Set<number>;
	symmetrical: boolean;
	weightDifference: number; // positive value means the right side is heavier.
	blocksLeft: number;
	maxX: number;
	components: Components;

	constructor(leftColumn: Set<number>, rightColumn: Set<number>, symmetrical: boolean, weightDifference: number, blocksLeft: number, maxX: number, components: Components) {
		this.leftColumn = leftColumn;
		this.rightColumn = rightColumn;
		this.symmetrical = symmetrical;
		this.weightDifference = weightDifference;
		this.blocksLeft = blocksLeft;
		this.maxX = maxX;
		this.components = components;
	}

	children(): PartialSculpture[] {
		// TODO: implement this!
		return [];
	}

	completionsTimes2() {
		if(this.blocksLeft === 0) {
			if(this.weightDifference !== 0 || this.components.size !== 0) { return 0n; }
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
