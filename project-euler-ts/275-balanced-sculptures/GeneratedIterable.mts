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
}
