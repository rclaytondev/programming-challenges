import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

export class GeneratedIterable<T> {
	generatorFunction: () => Generator<T>;
	length: number;

	constructor(generatorFunction: () => Generator<T>, length: number) {
		this.generatorFunction = generatorFunction;
		this.length = length;
	}

	*[Symbol.iterator]() {
		yield* this.generatorFunction();
	}

	assertCorrectLength() {
		let count = 0;
		for(const _ of this.generatorFunction()) {
			count ++;
		}
		if(count !== this.length) {
			throw new Error(`Invalid GeneratedIterable: \`length\` property was ${this.length}, but the generator function had ${count} elements.`);
		}
	}

	map<S>(callback: (value: T) => S) {
		const self = this;
		return new GeneratedIterable(
			function*() {
				for(const value of self.generatorFunction()) {
					yield callback(value);
				}
			},
			this.length
		);
	}
	subsets(size?: number) {
		return new GeneratedIterable(
			() => GenUtils.subsets(this, size),
			typeof size === "number" ? MathUtils.binomial(this.length, size) : 2 ** this.length
		);
	}
	removeByHash(iterable: GeneratedIterable<T>, hashFunction: (value: T) => string = (x) => `${x}`) {
		const self = this;
		return new GeneratedIterable(
			function*() {
				const allHashes = new Set([...iterable].map(hashFunction));
				let numFound = 0;
				for(const value of self.generatorFunction()) {
					if(!allHashes.has(hashFunction(value))) {
						numFound ++;
						yield value;
					}
				}

				if(numFound !== self.length - iterable.length) {
					throw new Error(`Unexpected length after computing GeneratedIterable set difference (expected ${self.length - iterable.length} but got ${numFound}).`);
				}
			},
			this.length - iterable.length
		)
	}

	static EMPTY<T>() {
		return new GeneratedIterable<T>(function*() {}, 0);
	}
	static fromIterable<T>(iterable: Iterable<T>, length?: number) {
		if(length == null) {
			length = 0;
			for(const value of iterable) { length ++; }
		}
		return new GeneratedIterable(
			function*() {
				yield* iterable;
			},
			length
		);
	}
	static fromArray<T>(array: T[]) {
		return new GeneratedIterable(
			function*() { yield* array; },
			array.length
		);
	}
	static range(min: number, max: number) {
		return new GeneratedIterable(
			function*() {
				for(let i = min; i <= max; i ++) { yield i; }
			},
			max - min + 1
		);
	}

	static concat<T>(...iterables: GeneratedIterable<T>[]) {
		return new GeneratedIterable(
			function*() {
				for(const iterable of iterables) {
					yield* iterable;
				}
			},
			MathUtils.sum(iterables.map(i => i.length))
		)
	}
	static tuples<T extends Array<GeneratedIterable<unknown>>>(...iterables: T) {
		return new GeneratedIterable(
			() => GenUtils.cartesianProduct(...iterables),
			MathUtils.product(iterables.map(i => i.length))
		);
	}
}

const foo = GeneratedIterable.range(1, 3);
const bar = GeneratedIterable.range(1, 3);
const qux = GeneratedIterable.tuples(foo, bar);
