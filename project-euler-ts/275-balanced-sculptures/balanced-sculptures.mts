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
}
