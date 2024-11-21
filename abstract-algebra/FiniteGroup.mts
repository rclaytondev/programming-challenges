import { Group } from "./Group.mjs";

export class FiniteGroup<T> extends Group<T> {
	elements: Iterable<T>;

	static defaultIncludes<T>(elements: Iterable<T>, customEquality: ((a: T, b: T) => boolean) | null) {
		if(!customEquality && elements instanceof Set) {
			return Set.prototype.has.bind(elements);
		}
		return (element: T) => {
			for(const el of elements) {
				if(customEquality?.(element, el) ?? (element === el)) { return true; }
			}
			return false;
		};
	}

	constructor(elements: Iterable<T>, operate: (element1: T, element2: T) => T, identity: T, inverse: (element: T) => T, includes: ((element: T) => boolean) | null = null, customEquality: ((a: T, b: T) => boolean) | null = null) {
		super(operate, identity, inverse, includes ?? FiniteGroup.defaultIncludes(elements, customEquality), customEquality);
		this.elements = elements;
	}
}
