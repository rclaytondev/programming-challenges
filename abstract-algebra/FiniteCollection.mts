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

	*[Symbol.iterator]() {
		yield* this.elements;
	}
}
