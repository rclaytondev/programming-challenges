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
			for(const element of elements) {
				if([...coset.elements(this)].some(e => this.elements.areEqual(element, e))) {
					elements.delete(element);
				}
			}
		}
		return cosets;
	}
	quotient(normalSubgroup: Group<T>) {
		return FiniteGroup.fromGroup(
			super.quotient(normalSubgroup),
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
	isNormal(subgroup: FiniteGroup<T>) {
		for(const element of subgroup.elements) {
			for(const conjugator of this) {
				if(!subgroup.elements.includes(this.conjugate(element, conjugator))) {
					return false;
				}
			}
		}
		return true;
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
	nextHigherCenter(previous: Group<T>) {
		const quotient = this.quotient(previous);
		return this.quotientPreimage(quotient.center());
	}
	upperCentralSeries() {
		let previous: FiniteGroup<T> = this;
		let current = this.center();
		const series = [previous, current];
		while(previous.elements.size !== current.elements.size) {
			[previous, current] = [current, this.nextHigherCenter(current)];
			series.push(current);
		}
		return series;
	}
	isNilpotent() {
		const ucs = this.upperCentralSeries();
		return ucs[ucs.length - 1].elements.size === this.elements.size;
	}

	quotientPreimage(subgroupOfQuotient: FiniteGroup<Coset<T>>) {
		return this.subgroup([...subgroupOfQuotient].flatMap(coset => [...coset.elements(this)]));
	}
}
