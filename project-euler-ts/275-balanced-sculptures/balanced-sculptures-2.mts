import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { HashPartition } from "./HashPartition.mjs";

export class Component {
	left: Range[];
	right: Range[];
	constructor(left: Range[], right: Range[]) {
		this.left = left;
		this.right = right;
	}

	height() {
		return Math.max(
			...this.left.map(r => r.max),
			...this.right.map(r => r.max)
		);
	}
	toString() {
		return `([${this.left}], [${this.right}])`;
	}
	numLeftBlocks() {
		return MathUtils.sum(this.left.map(range => range.max - range.min + 1));
	}
	numRightBlocks() {
		return MathUtils.sum(this.right.map(range => range.max - range.min + 1));
	}
	connectableSides(): ("left" | "right" | "both")[] {
		if(this.left.length !== 0 && this.right.length !== 0) {
			return ["left", "right", "both"];
		}
		if(this.left.length !== 0) {
			return ["left"];
		}
		if(this.right.length !== 0) {
			return ["right"];
		}
		throw new Error("Called connectableSides on an empty component.");
	}
	isEmpty() {
		return this.left.length === 0 && this.right.length === 0;
	}
	isReflectionOf(component: Component) {
		return (
			Utils.arrayEquals(this.left, component.right, (r1, r2) => r1.equals(r2)) &&
			Utils.arrayEquals(this.right, component.left, (r1, r2) => r1.equals(r2))
		);
	}
	minBlocksRequired(width: number) {
		if(this.left.length + this.right.length <= 1) { return 0; }
		if(this.left.length === 0) {
			return this.right[this.right.length - 1].min - this.right[0].max + 1;
		}
		if(this.right.length === 0) {
			return this.left[this.left.length - 1].min - this.left[0].max + 1;
		}
		return width + Math.max(
			this.left[0].distanceTo(this.right[this.right.length - 1]),
			this.left[this.left.length - 1].distanceTo(this.right[0]),
		);
	}

	static isSymmetric(leftComponents: Component[], rightComponents: Component[]) {
		return Utils.arrayEquals(leftComponents, rightComponents, (c1, c2) => c1.isReflectionOf(c2));
	}
}
export class Range {
	min: number;
	max: number;
	constructor(min: number, max: number = min) {
		this.min = min;
		this.max = max;
	}

	intersects(range: Range) {
		return this.max >= range.min && this.min <= range.max;
	}
	isAdjacentTo(range: Range) {
		return range.min === this.max + 1 || this.min === range.max + 1;
	}
	equals(range: Range) {
		return this.min === range.min && this.max === range.max;
	}
	distanceTo(range: Range) {
		if(this.intersects(range)) { return 0; }
		return Math.min(
			Math.abs(this.min - range.max),
			Math.abs(range.min - this.max)
		);
	}
	size() {
		return this.max - this.min + 1;
	}
 
	toString() {
		return `${this.min}-${this.max}`;
	}
}

const inSameSet = <T, >(v1: T, v2: T, partition: Set<Set<T>>) => (
	[...partition].find(s => s.has(v1)) === [...partition].find(s => s.has(v2))
);

export class SculpturesCounter {
	static sculptures(left: number, right: number, blocks: number, weight: number, components: Component[], mode: "normal" | "initial-all" | "initial-symmetric" = "normal"): bigint {
		/* Returns the number of partial sculptures in the region given by `left` and `right` that have the given weight and number of blocks (not including the two edge columns) and connect the given components. */
		if(right <= left + 1) {
			return blocks === 0 && weight === 0 && HashPartition.areConnectedComponents<["left" | "right", Range]>(
				components.map(c => [...c.left.map(r => ["left", r]), ...c.right.map(r => ["right", r])] as ["left" | "right", Range][]),
				(([side1, r1], [side2, r2]) => r1.intersects(r2) || (side1 === side2 && r1.isAdjacentTo(r2)))
			) ? 1n : 0n;
		}
		if(MathUtils.sum(components.map(c => c.minBlocksRequired(right - left - 1))) > blocks) {
			return 0n;
		}
		let result = 0n;
		const middle = Math.floor((left + right) / 2);
		const nextComponents = (mode === "normal") ? SculpturesCounter.getNextComponents(blocks, components) : SculpturesInitializer.getFirstComponents(blocks);
		for(const [leftComponents, rightComponents] of nextComponents) {
			const middleBlocks = MathUtils.sum(leftComponents.map(c => c.numRightBlocks()));
			for(let leftBlocks = 0; leftBlocks <= blocks; leftBlocks ++) {
				const rightBlocks = blocks - middleBlocks - leftBlocks;
				const minLeftWeight = (left + 1) * leftBlocks;
				const maxLeftWeight = (middle - 1) * leftBlocks;
				for(let leftWeight = minLeftWeight; leftWeight <= maxLeftWeight; leftWeight ++) {
					const rightWeight = weight - (middle * middleBlocks) - leftWeight;
					if(mode === "initial-symmetric" && (leftBlocks !== rightBlocks || leftWeight !== -rightWeight || !Component.isSymmetric(leftComponents, rightComponents))) {
						continue;
					}
					const leftSculptures = SculpturesCounter.sculptures(left, middle, leftBlocks, leftWeight, leftComponents);
					const rightSculptures = SculpturesCounter.sculptures(middle, right, rightBlocks, rightWeight, rightComponents);
					result += (mode === "initial-symmetric") ? leftSculptures : leftSculptures * rightSculptures;
				}
			}
		}
		return result;
	}
	static getNextComponents(blocks: number, components: Component[]): [Component[], Component[]][] {
		const EMPTY: [Component[], Component[]] = [
			components.map(c => new Component(c.left, [])).filter(c => !c.isEmpty()),
			components.map(c => new Component([], c.right)).filter(c => !c.isEmpty())
		];
		const twoSidedComponents = components.filter(c => c.left.length !== 0 && c.right.length !== 0);
		const result: [Component[], Component[]][] = (twoSidedComponents.length === 0) ? [EMPTY] : [];
		const height = Math.max(...components.map(c => c.height()));
		for(let numMidRanges = Math.max(1, twoSidedComponents.length); numMidRanges <= blocks; numMidRanges ++) {
			for(const connections of Utils.combinations(components, numMidRanges, "unlimited-duplicates", "tuples")) {
				for(const whichSide of Utils.cartesianProduct(...connections.map(c => c.connectableSides()))) {
					if(!twoSidedComponents.every(component => connections.some((connection, i) => connection === component && whichSide[i] === "both"))) {
						continue;
					}
					for(const ranges of SculpturesCounter.getRangeCombinations(numMidRanges, height + blocks - 1)) {
						const leftComponents = components
						.filter(c => c.left.length !== 0)
						.map(c => new Component(
							c.left,
							ranges.filter((r, i) => connections[i] === c && ["left", "both"].includes(whichSide[i]))
						)).concat(ranges.filter((r, i) => whichSide[i] === "right").map(r => new Component([], [r])));
						const rightComponents = components
						.filter(c => c.right.length !== 0)
						.map(c => new Component(
							ranges.filter((r, i) => connections[i] === c && ["right", "both"].includes(whichSide[i])),
							c.right
						)).concat(ranges.filter((r, i) => whichSide[i] === "left").map(r => new Component([r], [])));
						result.push([leftComponents, rightComponents]);
					}
				}
			}
		}
		return result;
	}
	static getRangeCombinations(numRanges: number, maxHeight: number, minHeight: number = 0) {
		if(numRanges === 0) {
			return [[]];
		}
		const rangeCombinations: Range[][] = [];
		for(let min = minHeight; min <= maxHeight; min ++) {
			for(let max = min; max <= maxHeight; max ++) {
				for(const ranges of SculpturesCounter.getRangeCombinations(numRanges - 1, maxHeight, max + 2)) {
					rangeCombinations.push([new Range(min, max), ...ranges]);
				}
			}
		}
		return rangeCombinations;
	}
}

export class SculpturesInitializer {
	static getFirstComponents(blocks: number): [Component[], Component[]][] {
		let result: [Component[], Component[]][] = [];
		for(const ranges of SculpturesInitializer.getFirstRangeCombinations(blocks)) {
			result = result.concat(SculpturesInitializer.getRangeConnections(ranges));
		}
		return result;
	}
	static getFirstRangeCombinations(blocks: number, ranges: Range[] = []): Range[][] {
		if(blocks < 0) { return []; }
		if(blocks === 0) { return [ranges]; }
		const result = ranges.length === 0 ? [] : [ranges];
		const startY = (ranges.length === 0) ? 0 : ranges[ranges.length - 1].max + 2;
		for(let min = startY; min <= startY + blocks; min ++) {
			if(ranges.length === 0 && min > 0) { break; }
			for(let max = min; max <= min + blocks; max ++) {
				const lastRange = ranges[ranges.length - 1];
				const sideBlocks = (
					(ranges.length === 0) ? 0 : 
					lastRange.size() === 1 ? min - lastRange.max + 1 :
					min - lastRange.max
				);
				const nextRange = new Range(min, max);
				for(const rangeCombination of SculpturesInitializer.getFirstRangeCombinations(blocks - nextRange.size() - sideBlocks, [...ranges, nextRange])) {
					result.push(rangeCombination);
				}
			}
		}
		return result;
	}
	static getRangeConnections(ranges: Range[]): [Component[], Component[]][] {
		const result = [];
		for(const leftPartition of Utils.setPartitions(ranges)) {
			for(const rightPartition of Utils.setPartitions(ranges)) {
				if(HashPartition.areConnected(
					ranges, 
					(r1, r2) => inSameSet(r1, r2, leftPartition) || inSameSet(r1, r2, rightPartition))
				) {
					result.push([
						[...leftPartition].map(set => new Component([], [...set])),
						[...rightPartition].map(set => new Component([...set], []))
					] as [Component[], Component[]]);
				}
			}
		}
		return result;
	}
}
export const allSculptures = (blocks: number) => SculpturesCounter.sculptures(
	-Math.ceil(blocks / 2),
	Math.ceil(blocks / 2),
	blocks,
	0,
	[],
	"initial-all"
);
export const symmetricalSculptures = (blocks: number) => SculpturesCounter.sculptures(
	-Math.ceil(blocks / 2),
	Math.ceil(blocks / 2),
	blocks,
	0,
	[],
	"initial-symmetric"
);
export const balancedSculptures = (blocks: number) => {
	const total = allSculptures(blocks);
	const symmetrical = symmetricalSculptures(blocks);
	const pairs = (total - symmetrical) / 2n;
	return symmetrical + pairs;
};
