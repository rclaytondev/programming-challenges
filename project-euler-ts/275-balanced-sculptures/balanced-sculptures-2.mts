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
	reflect() {
		return new Component(this.right, this.left);
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
	static weightBound(left: number, right: number, blocks: number, components: Component[], type: "upper-bound" | "lower-bound") {
		if(right <= left + 1) {
			return 0;
		}
		if(right === left + 2) {
			return (left + 1) * blocks;
		}
		let weight = 0;
		let blocksUsed = 0;
		const connectorBlocks = (right - left - 3);
		let connectorWeight = 0;
		for(let x = left + 2; x < right - 1; x ++) {
			connectorWeight += x;
		}
		for(const component of components) {
			if(component.left.length !== 0 && component.right.length !== 0) {
				weight += (left + 1) * component.left.length + (right - 1) * component.right.length + connectorWeight;
				blocksUsed += component.left.length + component.right.length + connectorBlocks;
			}
		}
		const remainingBlocks = blocks - blocksUsed;
		if(remainingBlocks < 0) {
			return (type === "upper-bound") ? -Infinity : Infinity;
		}
		return weight + remainingBlocks * (type === "upper-bound" ? right - 1 : left + 1);
	}
	weightEstimate(left: number, right: number, blocks: number, type: "upper-bound" | "lower-bound") {
		if(right <= left + 1) {
			return 0;
		}
		if(right === left + 2) {
			return (left + 1) * blocks;
		}
		const leftWeight = (left + 1) * this.left.length;
		const rightWeight = (right - 1) * this.right.length;
		let connectingWeight = 0;
		if(this.left.length !== 0 && this.right.length !== 0) {
			for(let x = left + 2; x < right - 1; x ++) {
				connectingWeight += x;
			}
		}
		const remainingBlocks = (this.left.length !== 0 && this.right.length !== 0) ? blocks - this.left.length - this.right.length - (right - left - 3) : blocks;
		if(remainingBlocks < 0) { return type === "upper-bound" ? -Infinity : Infinity; }
		const extraBlockLocations = (type === "upper-bound") ? right - 1 : left + 1;
		return leftWeight + rightWeight + connectingWeight + extraBlockLocations * remainingBlocks;
	}
	weightLowerBound(left: number, right: number, blocks: number) {
		return this.weightEstimate(left, right, blocks, "lower-bound");
	}
	weightUpperBound(left: number, right: number, blocks: number) {
		return this.weightEstimate(left, right, blocks, "upper-bound");
	}
	bottom() {
		return Math.min(...[...this.left, ...this.right].map(c => c.min));
	}
	translateUp(amount: number) {
		return new Component(this.left.map(r => r.translate(amount)), this.right.map(r => r.translate(amount)));
	}
	translateDown(amount: number) {
		return new Component(this.left.map(r => r.translate(-amount)), this.right.map(r => r.translate(-amount)));
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
	translate(amount: number) {
		return new Range(this.min + amount, this.max + amount);
	}
 
	toString() {
		return `${this.min}-${this.max}`;
	}
}

const inSameSet = <T, >(v1: T, v2: T, partition: Set<Set<T>>) => (
	[...partition].find(s => s.has(v1)) === [...partition].find(s => s.has(v2))
);

export class SculpturesCounter {
	static cache = new Map<string, bigint>();

	static memoizedSculptures(left: number, right: number, blocks: number, weight: number, components: Component[], mode: "normal" | "initial-all" | "initial-symmetric" = "normal") {
		if(mode === "normal") {
			if(`${components},${weight - left * blocks}` < `${components.map(c => c.reflect())},${-weight - (-right) * blocks}`) {
				[left, right] = [-right, -left];
				weight = -weight;
				components = components.map(c => c.reflect());
			}
			[left, right, weight] = [0, right - left, weight - left * blocks];

			if(right >= left + 2) {
				const previousBottom = Math.min(...components.map(c => c.bottom()));
				const blocksRequired = MathUtils.sum(components.map(c => c.minBlocksRequired(right - left - 1)));
				if(blocksRequired > blocks) { return 0n; }
				const newBottom = Math.min(previousBottom, blocks - blocksRequired);
				components = components.map(c => c.translateUp(newBottom - previousBottom));
			}
		}


		const argsString = `${left},${right},${blocks},${weight},${components},${mode}`;
		const cachedResult = SculpturesCounter.cache.get(argsString);
		if(typeof cachedResult === "bigint") {
			return cachedResult;
		}
		const result = SculpturesCounter.sculptures(left, right, blocks, weight, components, mode);
		SculpturesCounter.cache.set(argsString, result);
		return result;
	}
	static sculptures(left: number, right: number, blocks: number, weight: number, components: Component[], mode: "normal" | "initial-all" | "initial-symmetric" = "normal"): bigint {
		/* Returns the number of partial sculptures in the region given by `left` and `right` that have the given weight and number of blocks (not including the two edge columns) and connect the given components. */
		if(right <= left + 1) {
			return blocks === 0 && weight === 0 && HashPartition.areConnectedComponents<["left" | "right", Range]>(
				components.map(c => [...c.left.map(r => ["left", r]), ...c.right.map(r => ["right", r])] as ["left" | "right", Range][]),
				(([side1, r1], [side2, r2]) => r1.intersects(r2) || (side1 === side2 && r1.isAdjacentTo(r2)))
			) ? 1n : 0n;
		}
		let result = 0n;
		const middle = Math.floor((left + right) / 2);
		const nextComponents = (mode === "normal") ? SculpturesCounter.components(blocks, components) : SculpturesInitializer.components(blocks);
		for(const [leftComponents, rightComponents] of nextComponents) {
			const middleBlocks = MathUtils.sum(leftComponents.map(c => c.numRightBlocks()));
			const minLeftBlocks = MathUtils.sum(leftComponents.map(c => c.minBlocksRequired(middle - left - 1)));
			const maxLeftBlocks = blocks - middleBlocks - MathUtils.sum(rightComponents.map(c => c.minBlocksRequired(right - middle - 1)));
			for(let leftBlocks = minLeftBlocks; leftBlocks <= maxLeftBlocks; leftBlocks ++) {
				const rightBlocks = blocks - middleBlocks - leftBlocks;
				const minLeftWeight = Math.max(
					Component.weightBound(left, middle, leftBlocks, leftComponents, "lower-bound"),
					weight - middle * middleBlocks - Component.weightBound(middle, right, rightBlocks, rightComponents, "upper-bound")
				);
				const maxLeftWeight = Math.min(
					Component.weightBound(left, middle, leftBlocks, leftComponents, "upper-bound"),
					weight - middle * middleBlocks - Component.weightBound(middle, right, rightBlocks, rightComponents, "lower-bound")
				);
				for(let leftWeight = minLeftWeight; leftWeight <= maxLeftWeight; leftWeight ++) {
					const rightWeight = weight - (middle * middleBlocks) - leftWeight;
					if(mode === "initial-symmetric" && (leftBlocks !== rightBlocks || leftWeight !== -rightWeight || !Component.isSymmetric(leftComponents, rightComponents))) {
						continue;
					}
					const leftSculptures = SculpturesCounter.memoizedSculptures(left, middle, leftBlocks, leftWeight, leftComponents);
					if(leftSculptures === 0n) { continue; }
					const rightSculptures = SculpturesCounter.memoizedSculptures(middle, right, rightBlocks, rightWeight, rightComponents);
					result += (mode === "initial-symmetric") ? leftSculptures : leftSculptures * rightSculptures;
				}
			}
		}
		return result;
	}
	static components(blocks: number, components: Component[]): [Component[], Component[]][] {
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
					for(const ranges of SculpturesCounter.ranges(numMidRanges, height + blocks - 1)) {
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
	static ranges(numRanges: number, maxHeight: number, minHeight: number = 0) {
		if(numRanges === 0) {
			return [[]];
		}
		const rangeCombinations: Range[][] = [];
		for(let min = minHeight; min <= maxHeight; min ++) {
			for(let max = min; max <= maxHeight; max ++) {
				for(const ranges of SculpturesCounter.ranges(numRanges - 1, maxHeight, max + 2)) {
					rangeCombinations.push([new Range(min, max), ...ranges]);
				}
			}
		}
		return rangeCombinations;
	}
}

export class SculpturesInitializer {
	static components(blocks: number): [Component[], Component[]][] {
		let result: [Component[], Component[]][] = [];
		for(const ranges of SculpturesInitializer.ranges(blocks)) {
			result = result.concat(SculpturesInitializer.rangeConnections(ranges));
		}
		return result;
	}
	static ranges(blocks: number, ranges: Range[] = []): Range[][] {
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
					lastRange.size() === 1 || ranges.length === 1 ? min - lastRange.max + 1 :
					min - lastRange.max
				);
				const nextRange = new Range(min, max);
				for(const rangeCombination of SculpturesInitializer.ranges(blocks - nextRange.size() - sideBlocks, [...ranges, nextRange])) {
					result.push(rangeCombination);
				}
			}
		}
		return result;
	}
	static rangeConnections(ranges: Range[]): [Component[], Component[]][] {
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
export const allSculptures = (blocks: number) => SculpturesCounter.memoizedSculptures(
	-Math.ceil(blocks / 2),
	Math.ceil(blocks / 2),
	blocks,
	0,
	[],
	"initial-all"
);
export const symmetricalSculptures = (blocks: number) => SculpturesCounter.memoizedSculptures(
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
