import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;
type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;


const chineseRemainderTheorem = <VarCount extends number>(modulo1: bigint, solutions1: Tuple<bigint, VarCount>[], modulo2: bigint, solutions2: Tuple<bigint, VarCount>[]): Tuple<bigint, VarCount>[] => {
	const result = [];
	for(const solution1 of solutions1) {
		for(const solution2 of solutions2) {
			result.push(solution1.map((value, i) => binaryCRT(modulo1, value, modulo2, solution2[i])) as Tuple<bigint, VarCount>);
		}
	}
	return result;
};
export const binaryCRT = (modulo1: bigint, remainder1: bigint, modulo2: bigint, remainder2: bigint) => {
	const [coef1, coef2] = MathUtils.bezoutCoefficients(Number(modulo1), Number(modulo2));
	return BigintMath.generalizedModulo(remainder1 * BigInt(coef2) * modulo2 + remainder2 * BigInt(coef1) * modulo1, modulo1 * modulo2);
};

export class DiophantineEquation<VarCount extends number> {
	varCount: VarCount;
	lhs: (...variables: Tuple<bigint, VarCount>) => bigint;
	rhs: (...variables: Tuple<bigint, VarCount>) => bigint;

	constructor(varCount: VarCount, lhs: (...variables: Tuple<bigint, VarCount>) => bigint, rhs: (...variables: Tuple<bigint, VarCount>) => bigint) {
		this.varCount = varCount;
		this.lhs = lhs;
		this.rhs = rhs;
	}

	*solutions(): Generator<Tuple<bigint, VarCount>> {
		let modulo = 1n;
		let modularSolutions = [new Array(this.varCount).fill(1n)] as Tuple<bigint, VarCount>[];
		for(const prime of Sequence.PRIMES) {
			const solutionsModuloPrime = this.modularSolutions(BigInt(prime));
			const newModularSolutions = chineseRemainderTheorem(modulo, modularSolutions, BigInt(prime), solutionsModuloPrime);
			for(const solution of newModularSolutions) {
				if(this.lhs(...solution) === this.rhs(...solution)) {
					yield solution;
				}
			}
			modularSolutions = newModularSolutions;
			modulo *= BigInt(prime);
		}
	}

	modularSolutions(modulo: bigint) {
		const solutions: Tuple<bigint, VarCount>[] = [];
		const options = new Array(this.varCount).fill([]).map(_ => Utils.range(0, Number(modulo) - 1).map(BigInt));
		for(const variables of Utils.cartesianProduct(...options) as Generator<Tuple<bigint, VarCount>>) {
			const lhs = this.lhs(...variables);
			const rhs = this.rhs(...variables);
			if(lhs % modulo === rhs % modulo) {
				solutions.push(variables);
			}
		}
		return solutions;
	}
}
