import { Group } from "./Group.mjs";

export class FiniteGroup<T> extends Group<T> {
	elements: Iterable<T>;

	constructor(elements: Iterable<T>, operate: (element1: T, element2: T) => T, identity: T, inverse: (element: T) => T, includes: (element: T) => boolean) {
		super(operate, identity, inverse, includes);
		this.elements = elements;
	}
}
