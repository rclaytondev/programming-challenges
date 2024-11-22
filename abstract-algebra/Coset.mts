import { FiniteGroup } from "./FiniteGroup.mjs";
import { Group } from "./Group.mjs";

export class Coset<T> {
	representative: T;
	subgroup: Group<T>;

	constructor(representative: T, subgroup: Group<T>) {
		this.representative = representative;
		this.subgroup = subgroup;
	}

	operate(coset: Coset<T>, group: Group<T>) {
		return new Coset(group.operate(this.representative, coset.representative), this.subgroup);
	}
	inverse(group: Group<T>) {
		return new Coset(group.inverse(this.representative), this.subgroup);
	}
	equals(coset: Coset<T>, group: Group<T>) {
		return this.subgroup.includes(group.operate(this.representative, group.inverse(coset.representative)));
	}

	*[Symbol.iterator](group: Group<T>) {
		if(!(this.subgroup instanceof FiniteGroup)) {
			throw new Error("Cannot iterate over elements of a coset if the subgroup does not have an Iterable of elements.");
		}
		for(const element of this.subgroup.elements) {
			yield group.operate(this.representative, element);
		}
	}
}
