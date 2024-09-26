import { WORDS_DATA } from "./words-data.mjs";

const getAnagramSets = (words: string[]) => {
	const anagramSets = new Map<string, string[]>;
	for(const word of words) {
		const sorted = [...word].sort().join("");
		anagramSets.set(sorted, [
			...(anagramSets.get(sorted) ?? []),
			word
		]);
	}
	return [...anagramSets.values()];
};

const injections = <T, S>(domain: Iterable<T>, range: Iterable<S>): Map<T, S>[] => {
	if([...domain].length === 0) {
		return [new Map()];
	}
	const [first, ...others] = domain;
	const result = [];
	for(const image of range) {
		for(const injection of injections(others, [...range].filter(v => v !== image))) {
			const newInjection = new Map(injection);
			newInjection.set(first, image);
			result.push(newInjection);
		}
	}
	return result;
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const isSquare = (n: number) => (Math.floor(Math.sqrt(n)) ** 2) === n;

const solve = (words: string[]) => {
	let largest = -Infinity;
	const anagramSets = getAnagramSets(words).filter(v => v.length > 1);
	for(const anagrams of anagramSets) {
		for(const word1 of anagrams) {
			const letters = new Set([...word1]);
			for(const word2 of anagrams.filter(w => w < word1)) {
				for(const digitAssignment of injections(letters, DIGITS)) {
					if(digitAssignment.get(word1[0]) === 0 || digitAssignment.get(word2[0]) === 0) {
						continue;
					}
					const num1 = Number.parseInt([...word1].map(l => digitAssignment.get(l)).join(""));
					const num2 = Number.parseInt([...word2].map(l => digitAssignment.get(l)).join(""));
					if(isSquare(num1) && isSquare(num2)) {
						largest = Math.max(largest, num1, num2);
					}
				}
			}
		}
	}
	return largest;
};

// console.log(solve(WORDS_DATA));
// debugger;
