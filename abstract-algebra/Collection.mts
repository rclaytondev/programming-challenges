export class Collection<T> {
	includes: (value: T) => boolean;
	customEquality: ((value1: T, value2: T) => boolean) | null;

	constructor(includes: (value: T) => boolean, customEquality: ((value1: T, value2: T) => boolean) | null = null) {
		this.includes = includes;
		this.customEquality = customEquality;
	}

	areEqual(value1: T, value2: T) {
		return this.customEquality?.(value1, value2) ?? (value1 === value2);
	}
}
