import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { FiniteCollection } from "../FiniteCollection.mjs";
import { FiniteGroup } from "../FiniteGroup.mjs";

export class SymmetricGroup extends FiniteGroup<number[]> {
	order: number;

	constructor(order: number) {
		super(
			SymmetricGroup.compose,
			SymmetricGroup.identity(order), 
			SymmetricGroup.inverse,
			FiniteCollection.fromGenerator(SymmetricGroup.permutations, Utils.arrayEquals, order)
		);
		this.order = order;
	}

	static compose(permutation1: number[], permutation2: number[]) {
		return permutation2.map(v => permutation1[v]);
	}
	static inverse(permutation: number[]) {
		const result = [];
		for(const [index, value] of permutation.entries()) {
			result[value] = index;
		}
		return result;
	}
	static identity(order: number) {
		return Utils.range(0, order - 1);
	}
	static *permutations(order: number) {
		const permutations = function*(partialPermutation: number[], unused: Set<number>): Iterable<number[]> {
			if(unused.size === 0) {
				yield partialPermutation;
				return;
			}
			for(const next of unused) {
				const newUnused = new Set(unused);
				newUnused.delete(next);
				yield* permutations([...partialPermutation, next], newUnused);
			}
		};
		yield* permutations([], new Set(Utils.range(0, order - 1)));
	}
}
