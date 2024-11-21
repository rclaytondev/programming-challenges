import { Group } from "./Group.mjs";

export abstract class FiniteGroup<T> extends Group<T> {
	elements: Iterable<T>;

	constructor(identity: T, elements: Iterable<T>) {
		super(identity);
		this.elements = elements;
	}
}
