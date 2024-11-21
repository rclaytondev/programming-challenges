export class Group<T> {
	operate: (element1: T, element2: T) => T;
	identity: T;
	inverse: (element: T) => T;

	includes: (element: T) => boolean;
	areEqual(element1: T, element2: T) {
		return element1 === element2;
	}

	constructor(operate: (element1: T, element2: T) => T, identity: T, inverse: (element: T) => T, includes: (element: T) => boolean) {
		this.operate = operate;
		this.identity = identity;
		this.inverse = inverse;
		this.includes = includes;
	}
}
