/* Represents a finite or infinite sequence of integers. */
class Sequence {
	constructor(func, properties = {}) {
		const GeneratorFunction = Object.getPrototypeOf(function*() {}).constructor;
		const isGeneratorFunc = (func instanceof GeneratorFunction);
		if(isGeneratorFunc) {
			this.generator = func;
		}
		else {
			this.nthTerm = func;
			this.generator = function*() {
				for(let index = 0; index < Infinity; index ++) {
					yield func(index);
				}
			};
		}
		this[Symbol.iterator] = this.generator;
		this.entries = function*() {
			let index = 0;
			for(const term of this) {
				yield [term, index];
				index ++;
			}
		};

		this.isMonotonic = properties.isMonotonic ?? null;
	}

	nthTerm(termIndex) {
		/* returns the term at the given zero-based index. */
		let iterations = 0;
		for(const term of this) {
			if(iterations === termIndex) { return term; }
			iterations ++;
		}
	}
	indexOf(searchTarget) {
		/*
		returns the index of the first occurence, or -1 if it is not present.
		Note that this will loop infinitely if searching for a nonexistent item in a non-monotonic sequence.
		*/
		if(this.isMonotonic) {
			const isIncreasing = this.nthTerm(1) > this.nthTerm(0);
			let index = 0;
			for(const term of this) {
				if(
					(term > searchTarget && isIncreasing) ||
					(term < searchTarget && !isIncreasing)
				) {
					return -1;
				}
				if(term === searchTarget) { return index; }
				index ++;
			}
		}
		else {
			let index = 0;
			for(const term of this) {
				if(term === searchTarget) { return index; }
				index ++;
			}
		}
	}
	filter(callback) {
		const originalSequence = this;
		return new Sequence(
			function*() {
				let iterations = 0;
				for(const value of originalSequence) {
					if(callback(value, iterations, originalSequence)) {
						yield value;
					}
					iterations ++;
				}
			}
		);
	}
	map(callback) {
		const originalSequence = this;
		return new Sequence(
			function*() {
				let iterations = 0;
				for(const value of originalSequence) {
					yield callback(value, iterations, originalSequence);
					iterations ++;
				}
			}
		);
	}

	isIncreasing() {
		if(this.isMonotonic == null) { return null; }
		if(!this.isMonotonic) { return false; }
		let firstTerm = null;
		for(const term of this) {
			firstTerm ??= term;
			if(term !== firstTerm) {
				return term > firstTerm;
			}
		}
	}
	isDecreasing() {
		if(this.isMonotonic == null) { return null; }
		return !this.isIncreasing();
	}

	static union(...sequences) {
		for(const s of sequences) {
			if(!s.isMonotonic) {
				throw new Error("Cannot calculuate a union of non-monotonic sequences.");
			}
		}
		let increasing = sequences[0].isIncreasing();
		for(const s of sequences) {
			if(s.isIncreasing() !== increasing) {
				throw new Error("Sequences must be either all increasing or all decreasing.");
			}
		}

		return new Sequence(
			function*() {
				let generators = sequences.map(s => s.generator());
				let values = generators.map(s => s.next().value);
				while(true) {
					const nextVal = increasing ? values.min() : values.max();
					yield nextVal;
					values.forEach((val, i) => {
						while(values[i] === nextVal) {
							values[i] = generators[i].next().value;
						}
					});
				}
			},
			{ isMonotonic: true }
		);
	}

	slice(minIndex, maxIndex = Infinity) {
		/*
		Returns an array if `minIndex` and `maxIndex` are provided, and a Sequence if `maxIndex` is not provided.
		`minIndex` is inclusive, and `maxIndex` is exclusive.
		*/
		if(maxIndex === Infinity) {
			if(this.hasOwnProperty("nthTerm")) {
				return new Sequence(
					index => this.nthTerm(index + minIndex),
					{ isMonotonic: this.isMonotonic }
				);
			}
			else {
				const originalSequence = this;
				return new Sequence(
					function*() {
						let iterations = 0;
						for(const number of originalSequence) {
							if(iterations >= minIndex) { yield number; }
							iterations ++;
						}
					},
					{ isMonotonic: this.isMonotonic }
				);
			}
		}
		else {
			if(this.hasOwnProperty("nthTerm")) {
				const terms = [];
				for(let i = minIndex; i < maxIndex; i ++) {
					terms.push(this.nthTerm(i));
				}
				return terms;
			}
			else {
				const terms = [];
				let iterations = 0;
				for(const term of this) {
					if(iterations >= maxIndex) { break; }
					if(iterations >= minIndex) {
						terms.push(term);
					}
					iterations ++;
				}
				return terms;
			}
		}
	}

	static POSITIVE_INTEGERS = new Sequence(
		function*() {
			for(let i = 1; i < Infinity; i ++) {
				yield i;
			}
		},
		{ isMonotonic: true }
	);
	static INTEGERS = new Sequence(
		function*() {
			yield 0;
			for(let i = 1; i < Infinity; i ++) {
				yield i;
				yield -i;
			}
		},
		{ isMonotonic: false }
	);
	static PRIMES = new Sequence(
		function*() {
			yield 2;
			yield 3;
			const primes = [2, 3];
			const isPrime = (num) => {
				for(let i = 0; i < primes.length && primes[i] ** 2 <= num; i ++) {
					if(num % primes[i] === 0) { return false; }
				}
				return true;
			};
			for(let i = 6; i < Infinity; i += 6) {
				for(const value of [i - 1, i + 1]) {
					if(isPrime(value)) {
						primes.push(value);
						yield value;
					}
				}
			}
		},
		{ isMonotonic: true }
	);
	static powersOf(num) {
		return new Sequence(
			index => num ** index,
			{ isMonotonic: num >= 0 }
		);
	}
	static fibonacci(start1 = 1, start2 = 1) {
		return new Sequence(
			function*() {
				yield start1;
				yield start2;
				let v1 = start1, v2 = start2;
				while(true) {
					const next = v1 + v2;
					yield next;
					v1 = v2, v2 = next;
				}
			}
		)
	}
}
