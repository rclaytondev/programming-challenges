import { assert } from "chai";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export class Sequence {
	/*
	Represents an increasing infinite sequence of numbers, indexed starting at 0.
	Some methods may not work properly or may loop forever if the sequence is not ascending, or if the sequence is eventually constant.
	*/

	private readonly unmemoizedTerms: (Generator<number, never>) | null;
	private readonly unmemoizedGetTerm: ((index: number) => number) | null;
	private readonly cachedTerms: Map<number, number> = new Map();

	constructor(func: (() => Generator<number, never>) | ((index: number) => number)) {
		const GeneratorFunction = Object.getPrototypeOf(function*() {}).constructor;
		if(func instanceof GeneratorFunction) {
			this.unmemoizedTerms = (func as () => Generator<number, never>)();
			this.unmemoizedGetTerm = null;
		}
		else {
			this.unmemoizedTerms = null;
			this.unmemoizedGetTerm = func as ((index: number) => number);
		}
	}

	getTerm(index: number) {
		if(this.cachedTerms.has(index)) {
			return this.cachedTerms.get(index)!;
		}
		else if(this.unmemoizedGetTerm) {
			const result = this.unmemoizedGetTerm(index);
			this.cachedTerms.set(index, result);
			return result;
		}
		else {
			while(!this.cachedTerms.has(index)) {
				const nextTerm = this.unmemoizedTerms!.next().value;
				this.cachedTerms.set(this.cachedTerms.size, nextTerm);
			}
			return this.cachedTerms.get(index)!;
		}
	}
	*entries() {
		for(let index = 0; index < Infinity; index ++) {
			yield [index, this.getTerm(index)];
		}
	}



	*termsBelow(upperBound: number, mode: "inclusive" | "exclusive" = "inclusive") {
		let index = 0;
		let term = this.getTerm(index);
		while((mode === "inclusive" && term <= upperBound) || (mode === "exclusive" && term < upperBound)) {
			yield term;
			index ++;
			term = this.getTerm(index);
		}
	}
	*termsBetween(lowerBound: number, upperBound: number, lowerMode: "inclusive" | "exclusive" = "inclusive", upperMode: "inclusive" | "exclusive" = "exclusive") {
		let index = 0;
		let term = this.getTerm(index);
		while((upperMode === "inclusive" && term <= upperBound) || (upperMode === "exclusive" && term < upperBound)) {
			if((lowerMode === "inclusive" && term >= lowerBound) || (lowerMode === "exclusive" && term > lowerBound)) {
				yield term;
			}
			index ++;
			term = this.getTerm(index);
		}
	}
	slice(startIndex: number, endIndex: number, startMode: "inclusive" | "exclusive" = "inclusive", endMode: "inclusive" | "exclusive" = "exclusive") {
		let result = [];
		for(let index = (startMode === "inclusive") ? startIndex : startIndex + 1; (endMode === "inclusive") ? (index <= endIndex) : (index < endIndex); index ++) {
			result.push(this.getTerm(index));
		}
		return result;
	}
	*setsWithSum(setSize: number, sum: number, lowerBound: number = -Infinity): Generator<number[]> {
		if(setSize === 0 && sum === 0) {
			yield [];
		}
		else if(setSize !== 0) {
			for(const firstTerm of this.termsBetween(lowerBound, sum, "exclusive", "inclusive")) {
				for(const set of this.setsWithSum(setSize - 1, sum - firstTerm, firstTerm)) {
					yield [firstTerm, ...set];
				}
			}
		}
	}



	static PRIMES = new Sequence(function*() {
		let num = 2;
		while(true) {
			if(MathUtils.isPrime(num)) {
				yield num;
			}
			num ++;
		}
	})
}

describe("Sequence.getTerm", () => {
	it("can return the nth term of a sequence given by an explicit formula, and uses memoization", () => {
		let timesCalled = 0;
		const sequence = new Sequence(n => {
			timesCalled ++;
			return n * n;
		});
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(sequence.getTerm(5), 25);
		assert.equal(timesCalled, 1);
	});
	it("can return the nth term of a sequence given by a generator function, and uses memoization", () => {
		let timesYielded = 0;
		const powersOf2 = new Sequence(function*() {
			let num = 1;
			while(true) {
				timesYielded ++;
				yield num;
				num *= 2;
			}
		});
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(powersOf2.getTerm(5), 32);
		assert.equal(timesYielded, 6);

		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(powersOf2.getTerm(7), 128);
		assert.equal(timesYielded, 8);

		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(powersOf2.getTerm(2), 4);
		assert.equal(timesYielded, 8);
	});
});
describe("Sequence.setsWithSum", () => {
	it("returns all the sets of elements of the sequence that add up to the given value, sorted in ascending order", () => {
		const sequence = new Sequence(n => n);
		const sets = [...sequence.setsWithSum(2, 5)];
		assert.sameDeepMembers(sets, [
			[0, 5],
			[1, 4],
			[2, 3],
		]);
	});
});
