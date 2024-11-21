export abstract class Group<T> {
	identity: T;
	operate: (element1: T, element2: T) => T;
	inverse: (element: T) => T;

	includes: (element: T) => boolean;
	areEqual: (element1: T, element2: T) => boolean;

	constructor(identity: T, operate: (element1: T, element2: T) => T, inverse: (element: T) => T, includes: (element: T) => boolean, areEqual?: (element1: T, element2: T) => boolean) {
		this.identity = identity;
		this.operate = operate;
		this.inverse = inverse;
		this.includes = includes;
		this.areEqual = areEqual ?? ((a, b) => a === b);
	}
}
