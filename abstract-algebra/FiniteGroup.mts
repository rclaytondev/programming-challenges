import { Group } from "./Group.mjs";

export abstract class FiniteGroup<T> extends Group<T> {
	elements: Iterable<T>;

	constructor(identity: T, operate: (element1: T, element2: T) => T, inverse: (element: T) => T, elements: Iterable<T>, areEqual: (a: T, b: T) => boolean) {
		super(
			identity, 
			operate, 
			inverse, 
			(element: T) => {
				for(const el of this.elements) {
					if(this.areEqual(el, element)) { return true; }
				}
				return false;
			}
		);
		this.elements = elements;
	}
}
