export abstract class Group<T> {
	identity: T;
	abstract operate(element1: T, element2: T): T;
	abstract inverse(element: T): T;

	abstract includes(element: T): boolean;
	areEqual(element1: T, element2: T) {
		return element1 === element2;
	}

	constructor(identity: T) {
		this.identity = identity;
	}
}
