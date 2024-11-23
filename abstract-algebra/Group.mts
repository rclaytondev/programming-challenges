import { Collection } from "./Collection.mjs";
import { Coset } from "./Coset.mjs";
import { FiniteCollection } from "./FiniteCollection.mjs";
import { FiniteGroup } from "./FiniteGroup.mjs";

export class Group<T> {
	elements: Collection<T>;
	operate: (element1: T, element2: T) => T;
	identity: T;
	inverse: (element: T) => T;

	constructor(operate: (element1: T, element2: T) => T, identity: T, inverse: (element: T) => T, elements: Collection<T>) {
		this.operate = operate;
		this.identity = identity;
		this.inverse = inverse;
		this.elements = elements;
	}

	quotient(normalSubgroup: Group<T>) {
		return new Group(
			(c1, c2) => c1.operate(c2, normalSubgroup),
			new Coset(this.identity, normalSubgroup),
			(coset) => coset.inverse(normalSubgroup),
			new Collection(
				(coset) => coset.subgroup === normalSubgroup && this.elements.includes(coset.representative),
				(c1, c2) => c1.equals(c2, normalSubgroup)
			)
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
				new Collection(
					(v) => this.elements.includes(v) && elementsOrFilter(v),
					this.elements.customEquality?.bind(this) ?? null
				)
			);
		}
		return new FiniteGroup(
			this.operate.bind(this),
			this.identity,
			this.inverse.bind(this),
			new FiniteCollection(elementsOrFilter, this.elements.customEquality)
		);
	}
}
