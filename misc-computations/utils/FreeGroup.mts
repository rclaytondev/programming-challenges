import { Utils } from "../../utils-ts/modules/Utils.mjs";

type Letter<GeneratorType> = { generator: GeneratorType, inverted: boolean };
type Word<GeneratorType> = Letter<GeneratorType>[];

export class FreeGroup<GeneratorType> {
	generators: Set<GeneratorType>;

	constructor(generators: Iterable<GeneratorType>) {
		this.generators = new Set(generators);
	}

	multiply(word1: Word<GeneratorType>, word2: Word<GeneratorType>) {
		/* Runtime: O(n^2) in the worst case (can be optimized to O(n)), where n is the length of the words. */
		word1 = [...word1];
		word2 = [...word2];
		while(
			word1.length > 0 && word2.length > 0 &&
			word1[word1.length - 1].generator === word2[0].generator &&
			word1[word1.length - 1].inverted !== word2[0].inverted
		) {
			word1.pop();
			word2.shift();
		}
		return [...word1, ...word2];
	}
	product(...words: Word<GeneratorType>[]) {
		return words.reduce((a, b) => this.multiply(a, b), []);
	}
	inverse(word: Word<GeneratorType>) {
		return word.map(({ generator, inverted}) => ({ generator, inverted: !inverted })).reverse();
	}
	areEqual(word1: Word<GeneratorType>, word2: Word<GeneratorType>) {
		return Utils.arrayEquals(
			word1, word2,
			(a, b) => a.generator === b.generator && a.inverted === b.inverted
		);
	}

	*wordsOfLength(length: number, startsWith: Word<GeneratorType> = []): Generator<Word<GeneratorType>> {
		if(startsWith.length >= length) {
			yield startsWith;
		}
		else {
			const last = startsWith[startsWith.length - 1];
			for(const generator of this.generators) {
				for(const inverted of [true, false]) {
					if(!last || generator !== last.generator || inverted === last.inverted) {
						yield* this.wordsOfLength(length, [...startsWith, { generator, inverted }]);
					}
				}
			}
		}
	}
	*elements() {
		for(let length = 0; true; length ++) {
			yield* this.wordsOfLength(length);
		}
	}
}
