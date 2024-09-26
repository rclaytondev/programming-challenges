import { Utils } from "../../utils-ts/modules/Utils.mjs";

type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;
type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;

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

	}

	solutionsModPrimePower(modulo: bigint) {
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
