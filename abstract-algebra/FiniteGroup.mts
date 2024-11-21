import { Group } from "./Group.mjs";

export class FiniteGroup<T> extends Group<T> {
	elements: Iterable<T>;

	constructor(elements: Iterable<T>, operate: (element1: T, element2: T) => T, identity: T, inverse: (element: T) => T, includes: (element: T) => boolean, customEquality: ((a: T, b: T) => boolean) | null = null) {
		super(operate, identity, inverse, includes, customEquality);
		this.elements = elements;
	}
}
