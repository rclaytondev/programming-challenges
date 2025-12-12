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
	static mapPairs<T, S, R>(iterable1: GeneratedIterable<T>, iterable2: GeneratedIterable<S>, callback: (v1: T, v2: S) => R) {
		return new GeneratedIterable<R>(
			function*() {
				for(const v1 of iterable1.generatorFunction()) {
					for(const v2 of iterable2.generatorFunction()) {
						yield callback(v1, v2);
					}
				}
			},
			iterable1.length * iterable2.length
		)
	}
}
