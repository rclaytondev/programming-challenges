import { Coset } from "./Coset.mjs";
import { Group } from "./Group.mjs";

export class FiniteGroup<T> extends Group<T> {
	elements: Iterable<T>;

	static defaultIncludes<T>(elements: Iterable<T>, customEquality: ((a: T, b: T) => boolean) | null) {
		if(!customEquality && elements instanceof Set) {
			return Set.prototype.has.bind(elements);
		}
		return (element: T) => {
			for(const el of elements) {
				if(customEquality?.(element, el) ?? (element === el)) { return true; }
			}
			return false;
		};
	}

	constructor(elements: Iterable<T>, operate: (element1: T, element2: T) => T, identity: T, inverse: (element: T) => T, includes: ((element: T) => boolean) | null = null, customEquality: ((a: T, b: T) => boolean) | null = null) {
		super(operate, identity, inverse, includes ?? FiniteGroup.defaultIncludes(elements, customEquality), customEquality);
		this.elements = elements;
	}

	static fromGroup<T>(group: Group<T>, elements: Iterable<T>) {
		return new FiniteGroup(
			elements,
			group.operate.bind(group),
			group.identity,
			group.inverse.bind(group),
			group.includes.bind(group),
			group.customEquality?.bind(group) ?? null
		);
	}

	cosets(subgroup: Group<T>) {
		const cosets = [];
		const elements = new Set(this.elements);
		while(elements.size > 0) {
			const [representative] = elements;
			const coset = new Coset(representative, subgroup);
			cosets.push(coset);
			for(const element of coset) {
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
}
