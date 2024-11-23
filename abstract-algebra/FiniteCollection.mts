import { Collection } from "./Collection.mjs";

export class FiniteCollection<T> extends Collection<T> {
	elements: Iterable<T>;
	
	constructor(elements: Iterable<T>, customEquality: ((value1: T, value2: T) => boolean) | null = null) {
		super((value: T) => {
			if(!customEquality && elements instanceof Set) {
				return elements.has(value);
			}
			for(const v of elements) {
				if(customEquality?.(v, value) ?? (v === value)) { return true; }
			}
			return false;
		});
		this.elements = elements;
		this.customEquality = customEquality;
	}
	static fromGenerator<ArgsType extends unknown[], T>(generatingFunction: (...args: ArgsType) => Iterable<T>, customEquality: ((v1: T, v2: T) => boolean) | null = null, ...args: ArgsType) {
		return new FiniteCollection(
			{
				[Symbol.iterator]: function*() {
					yield* generatingFunction(...args);
				}
			},
			customEquality
		);
	}

	*[Symbol.iterator]() {
		yield* this.elements;
	}

	get size() {
		if(this.elements instanceof Set) {
			return this.elements.size;
		}
		if(Array.isArray(this.elements)) {
			return this.elements.length;
		}
		let count = 0;
		for(const value of this.elements) { count ++; }
		return count;
	}
}
