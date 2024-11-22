import { Coset } from "./Coset.mjs";
import { FiniteGroup } from "./FiniteGroup.mjs";

export class Group<T> {
	operate: (element1: T, element2: T) => T;
	identity: T;
	inverse: (element: T) => T;

	includes: (element: T) => boolean;
	customEquality: ((element1: T, element2: T) => boolean) | null;
	areEqual(element1: T, element2: T) {
		return this.customEquality?.(element1, element2) ?? (element1 === element2);
	}

	constructor(operate: (element1: T, element2: T) => T, identity: T, inverse: (element: T) => T, includes: (element: T) => boolean, customEquality: ((element1: T, element2: T) => boolean) | null = null) {
		this.operate = operate;
		this.identity = identity;
		this.inverse = inverse;
		this.includes = includes;
		this.customEquality = customEquality;
	}

	quotient(normalSubgroup: Group<T>) {
		return new Group(
			(c1, c2) => c1.operate(c2, normalSubgroup),
			new Coset(this.identity, normalSubgroup),
			(coset) => coset.inverse(normalSubgroup),
			(coset) => coset.subgroup === normalSubgroup && this.includes(coset.representative),
			(c1, c2) => c1.equals(c2, normalSubgroup)
		);
	}

	subgroup(elements: Iterable<T>): FiniteGroup<T>;
	subgroup(filter: (element: T) => boolean): Group<T>;
	subgroup(elementsOrFilter: Iterable<T> | ((element: T) => boolean)) {
		if(typeof elementsOrFilter === "function") {
			return new Group(
				this.operate.bind(this),
				this.identity,
				this.inverse.bind(this),
				(v) => this.includes(v) && elementsOrFilter(v),
				this.customEquality?.bind(this) ?? null
			);
		}
		return new FiniteGroup(
			elementsOrFilter,
			this.operate.bind(this),
			this.identity,
			this.inverse.bind(this),
			null,			
			this.customEquality?.bind(this) ?? null
		);
	}
}
