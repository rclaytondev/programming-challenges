import { GenUtils } from "../../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { HashSet } from "../../../utils-ts/modules/HashSet.mjs";
import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";

type Bit = 0 | 1;

export class BinaryCircleState {
	numBits: number;
	bits: Bit[];
	remainingSequences: HashSet<Bit[]>;

	constructor(numBits: number, bits: Bit[], remainingSequences: HashSet<Bit[]>) {
		this.numBits = numBits;
		this.bits = bits;
		this.remainingSequences = remainingSequences;
	}
	static initial(numBits: number) {
		const remainingSequences = new HashSet(GenUtils.cartesianPower([0, 1] as Bit[], numBits));
		remainingSequences.delete(new Array(numBits).fill(0));
		return new BinaryCircleState(
			numBits,
			new Array(numBits).fill(0),
			remainingSequences,
		);
	}

	static completions(state: BinaryCircleState): BinaryCircleState[] {
		if(state.remainingSequences.size === 0) {
			return [state];
		}

		const completions = [];
		const last = state.bits.slice(state.bits.length - state.numBits + 1);
		for(const nextBit of [0, 1] as Bit[]) {
			if(state.remainingSequences.has([...last, nextBit])) {
				const newRemainingSequences = state.remainingSequences.copy();
				newRemainingSequences.delete([...last, nextBit]);
				completions.push(...BinaryCircleState.completions(new BinaryCircleState(
					state.numBits,
					[...state.bits, nextBit],
					newRemainingSequences,
				)));
			}
		}
		return completions;
	}
}

export class Problem265 {
	static solve(numBits: number = 5) {
		const initialState = BinaryCircleState.initial(numBits);
		const completions = BinaryCircleState.completions(initialState);
		const bitStrings = completions.map(s => s.bits.slice(0, -numBits + 1));
		const numbers = bitStrings.map(b => Number.parseInt(b.join(""), 2));
		return MathUtils.sum(numbers);
	}
}

// console.time();
// console.log(Problem265.solve(5));
// console.timeEnd();
// debugger;
