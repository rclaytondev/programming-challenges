import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { HashPartition } from "./HashPartition.mjs";

export class IntRange {
	/* 
	Represents a range of integers from `min` to `max`, inclusive.
	*/
	readonly min: number;
	readonly max: number;

	constructor(min: number, max: number) {
		if(min < 0 || min > max || min !== Math.floor(min) || max !== Math.floor(max)) {
			throw new Error(`Cannot construct IntRange: invalid min and max (min=${min}, max=${max}).`);
		}
		this.min = min;
		this.max = max;
	}

	toString() {
		return `[${this.min} .. ${this.max}]`;
	}
}

export class SidedRange {
	readonly side: "left" | "right";
	readonly range: IntRange;
	constructor(side: "left" | "right", range: IntRange) {
		this.side = side;
		this.range = range;
	}

	toString() {
		return `${this.range} on the ${this.side}`;
	}
}

export class Component {
	readonly left: readonly IntRange[];
	readonly right: readonly IntRange[];
	constructor(left: IntRange[], right: IntRange[]) {
		this.left = left;
		this.right = right;
	}

	sidedRanges() {
		return [
			...this.left.map(r => new SidedRange("left", r)),
			...this.right.map(r => new SidedRange("right", r)),
		];
	}
}

export class AbstractComponent {
	readonly outer: readonly IntRange[];
	readonly inner: readonly number[];

	constructor(outer: IntRange[], inner: number[]) {
		this.outer = outer;
		this.inner = inner;
	}
}

export class PartialSculpture {
	readonly left: number;
	readonly right: number;
	readonly weight: number;
	readonly blocks: number;
	readonly components: readonly Component[];

	constructor(left: number, right: number, weight: number, blocks: number, components: Component[]) {
		this.left = left;
		this.right = right;
		this.weight = weight;
		this.blocks = blocks;
		this.components = components;
	}

	abstractNextComponents() {
		const result: [AbstractComponent, AbstractComponent][] = [];
		const leftRanges = this.components.flatMap(c => c.left.map(r => new SidedRange("left", r)));
		const rightRanges = this.components.flatMap(c => c.right.map(r => new SidedRange("right",  r)));
		const expectedComponents = this.componentSets();
		for(let centralRanges = 0; centralRanges <= this.blocks; centralRanges ++) {
			const indices = ArrayUtils.range(0, centralRanges - 1);
			const allLeftConnections = GenUtils.cartesianPower([...indices, ...leftRanges], 2);
			const allRightConnections = GenUtils.cartesianPower([...indices, ...rightRanges], 2);
			for(const leftConnections of GenUtils.subsets(allLeftConnections)) {
				for(const rightConnections of GenUtils.subsets(allRightConnections)) {
					const component = this.abstractComponentPair(
						[...leftConnections, ...rightConnections],
						expectedComponents
					);
					result.push(component);
				}
			}
		}
		return result;
	}
	componentSets() {
		return new HashSet(this.components.map(c => new HashSet(c.sidedRanges())));
	}
	abstractComponentPair(
		connections: [number | SidedRange, number | SidedRange][],
		expectedSets: HashSet<HashSet<SidedRange>>,
		centralRanges: number
	) {
		const partition = HashPartition.empty<SidedRange | number>();
		for(const [endpoint1, endpoint2] of connections) {
			partition.add(endpoint1);
			partition.add(endpoint2);
			partition.merge(endpoint1, endpoint2);
		}
		const componentSets = partition.sets().map(s => 
			s.filter(rangeOrNumber => rangeOrNumber instanceof SidedRange)
		);
		if(!componentSets.equals(expectedSets)) {
			return null;
		}

		return [
			this.abstractComponentHalf("left", connections)
		]
	}
	abstractComponentHalf(side: "left" | "right", connections: [number | SidedRange, number | SidedRange][]) {
		const partition = HashPartition.empty<SidedRange | number>();
		for(const [endpoint1, endpoint2] of connections) {
			if((endpoint1 instanceof SidedRange && endpoint1.side === side) || (endpoint2 instanceof SidedRange && endpoint2.side === side)) {
				partition.add(endpoint1);
				partition.add(endpoint2);
				partition.merge(endpoint1, endpoint2);
			}
		}
		const sets = partition.sets();
		// return new AbstractComponent()
	}
}
