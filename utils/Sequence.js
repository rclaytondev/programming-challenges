/* Represents a finite or infinite sequence of integers. */
class Sequence {
	constructor(func, properties = {}) {
		const GeneratorFunction = Object.getPrototypeOf(function*() {}).constructor;
		const isGeneratorFunc = (func instanceof GeneratorFunction);
		const self = this;
		if(isGeneratorFunc) {
			this.generatorFunction = func;
		}
		else {
			this.nthTerm = (termIndex) => {
				const term = func(termIndex);
				this.cachedTerms[termIndex] = term;
				return term;
			};
			this.generatorFunction = function*() {
				for(let index = 0; index < Infinity; index ++) {
					const term = func(index);
					self.cachedTerms[index] = term;
					yield term;
				}
			};
		}
		this.generator = this.generatorFunction();
		this[Symbol.iterator] = function*() {
			for(let index = 0; index < Infinity; index ++) {
				if(index < this.numCachedTerms) {
					yield this.cachedTerms[index];
				}
				else {
					const term = this.generator.next().value;
					this.cachedTerms[index] = term;
					this.numCachedTerms ++;
					yield term;
				}
			}
		};
		this.cachedTerms = [];
		this.numCachedTerms = 0;

		this.isMonotonic = properties.isMonotonic ?? null;
	}

	nthTerm(termIndex) {
		/* returns the term at the given zero-based index. */
		if(typeof this.cachedTerms[termIndex] === "number") {
			return this.cachedTerms[termIndex];
		}
		if(this.hasOwnProperty("nthTerm")) {
			return this.nthTerm(termIndex);
		}

		for(let i = this.numCachedTerms; i <= termIndex; i ++) {
			this.cachedTerms[i] = this.generator.next().value;
		}
		this.numCachedTerms = termIndex + 1;
		return this.cachedTerms[termIndex];
	}
	nextTerm(term) {
		return this.nthTerm(this.indexOf(term) + 1);
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
	find(callback) {
		for(const [term, index] of this.entries()) {
			if(callback(term, index, this)) {
				return term;
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
				let generators = sequences.map(s => s[Symbol.iterator]());
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

	isIncreasing() {
		if(this.isMonotonic == null) { return null; }
		if(!this.isMonotonic) { return false; }
		let firstTerm = null;
		for(const term of this) {
			firstTerm ??= term;
			if(term !== firstTerm) {
				this.isIncreasing = () => term > firstTerm;
				return term > firstTerm;
			}
		}
	}
	isDecreasing() {
		if(this.isMonotonic == null) { return null; }
		return !this.isIncreasing();
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
					if(typeof this.cachedTerms[i] === "number") {
						terms.push(this.cachedTerms[i]);
					}
					else {
						terms.push(this.nthTerm(i));
					}
				}
				return terms;
			}
			else {
				if(minIndex === maxIndex) { return []; }
				const terms = [];
				let iterations = 0;
				for(const term of this) {
					if(iterations >= minIndex) {
						terms.push(term);
					}
					iterations ++;
					if(iterations >= maxIndex) { break; }
				}
				return terms;
			}
		}
	}
	termsBelow(maximum, inclusive) {
		if(!this.isIncreasing()) {
			throw new Error("Cannot calculate the terms below a maximum for a non-increasing sequence.");
		}
		let terms = [];
		for(const term of this) {
			if(term > maximum || (term >= maximum && !inclusive)) {
				return terms;
			}
			terms.push(term);
		}
	}
	*entries() {
		let index = 0;
		for(const term of this) {
			yield [term, index];
			index ++;
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
			const factorsMap = new Map();
			for(let possiblePrime = 2; possiblePrime < Infinity; possiblePrime ++) {
				const factors = factorsMap.get(possiblePrime) ?? [];
				if(factors.length === 0) {
					yield possiblePrime;
					factorsMap.set(possiblePrime ** 2, [possiblePrime]);
				}
				else {
					for(const factor of factors) {
						const nextNumber = possiblePrime + factor;
						if(!factorsMap.has(nextNumber)) {
							factorsMap.set(nextNumber, []);
						}
						factorsMap.get(nextNumber).push(factor);
					}
					factorsMap.delete(possiblePrime);
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
