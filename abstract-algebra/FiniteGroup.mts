import { Collection } from "./Collection.mjs";
import { Coset } from "./Coset.mjs";
import { FiniteCollection } from "./FiniteCollection.mjs";
import { Group } from "./Group.mjs";

export class FiniteGroup<T> extends Group<T> {
	elements: FiniteCollection<T>;

	constructor(operate: (element1: T, element2: T) => T, identity: T, inverse: (element: T) => T, elements: FiniteCollection<T>) {
		super(operate, identity, inverse, elements);
		this.elements = elements;
	}

	static fromGroup<T>(group: Group<T>, elements: Iterable<T>) {
		return new FiniteGroup(
			group.operate.bind(group),
			group.identity,
			group.inverse.bind(group),
			new FiniteCollection(elements, group.elements.customEquality)
		);
	}

	cosets(subgroup: Group<T>) {
		const cosets = [];
		const elements = new Set(this.elements);
		while(elements.size > 0) {
			const [representative] = elements;
			const coset = new Coset(representative, subgroup);
			cosets.push(coset);
			for(const element of coset.elements(this)) {
				elements.delete(element);
			}
		}
		return cosets;
	}
	quotient(normalSubgroup: Group<T>) {
		return FiniteGroup.fromGroup(
			Group.prototype.quotient.call(this, normalSubgroup),
			this.cosets(normalSubgroup)
		);
	}
	subgroup(elementsOrFilter: Iterable<T> | ((element: T) => boolean)): FiniteGroup<T> {
		const result = super.subgroup(elementsOrFilter as any);
		const self = this;
		const elements = (typeof elementsOrFilter !== "function") ? elementsOrFilter : {
			[Symbol.iterator]: function*() {
				for(const element of self.elements) {
					if(elementsOrFilter(element)) {
						yield element;
					}
				}
			}
		};
		return FiniteGroup.fromGroup(result, elements);
	}

	*[Symbol.iterator]() {
		yield* this.elements;
	}

	commutes(element1: T, element2: T) {
		const product1 = this.operate(element1, element2);
		const product2 = this.operate(element2, element1);
		return this.elements.areEqual(product1, product2);
	}
	center() {
		const elements = [...this];
		return this.subgroup(elements.filter(a => elements.every(b => this.commutes(a, b))));
	}
}
