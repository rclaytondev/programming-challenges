import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

type State = {
	indexPossibilities: Map<number, number[]>,
	valuePossibilities: Map<number, number[]>
};

const mapMap = function<K, V1, V2>(map: Map<K, V1>, callback: (input: V1) => V2) {
	const newMap = new Map();
	for(const [key, value] of map) {
		newMap.set(key, callback(value));
	}
	return newMap;
};
const minEntry = function<K, V>(map: Map<K, V>, callback: (input: V) => number): [K, V] {
	const entries = [...map];
	let minimum: [K, V, number] = [...entries[0], callback(entries[0][1])];
	for(const [key, value] of entries) {
		if(callback(value) < minimum[2]) {
			minimum = [key, value, callback(value)];
		}
	}
	return [minimum[0], minimum[1]];
};

const deleteKey = function<K, V>(map: Map<K, V>, key: K) {
	map.delete(key);
	return map;
};

const setInPermutation = (state: State, index: number, value: number): State => ({
	indexPossibilities: deleteKey(mapMap(state.indexPossibilities, arr => arr.filter(v => v !== value)), index),
	valuePossibilities: deleteKey(mapMap(state.valuePossibilities, arr => arr.filter(i => i !== index)), value)
});

const nextStates = (state: State) => {
	const [nextIndex, nextIndexPossibilities] = minEntry(state.indexPossibilities, arr => arr.length);
	const [nextValue, nextValuePossibilities] = minEntry(state.valuePossibilities, arr => arr.length);
	if(nextIndexPossibilities.length < nextValuePossibilities.length) {
		return nextIndexPossibilities.map(v => setInPermutation(state, nextIndex, v));
	}
	else {
		return nextValuePossibilities.map(i => setInPermutation(state, i, nextValue));
	}
};

const initialState = (size: number, first: number) => {
	const range = Utils.range(first, first + size - 1);
	const indices = Utils.range(1, size);
	return {
		indexPossibilities: new Map(indices.map(i => [i, range.filter(v => v % i === 0)] as const)),
		valuePossibilities: new Map(range.map(v => [v, indices.filter(i => v % i === 0)] as const)),
	};
};

export const isDivisible = (size: number, first: number) => {
	let states = [initialState(size, first)];
	for(let i = 0; i < size; i ++) {
		states = states.flatMap(nextStates);
	}
	return states.length !== 0;
};

export const solve = (size: number) => {
	const primeFactors = [...Sequence.PRIMES.termsBelow(size, "inclusive")];

	let numFound = 0;
	outerLoop: for(let first = 1; first < Infinity; first ++) {
		let foundNondivisible = false;
		for(let i = first + size - 1; i >= first; i --) {
			if(!primeFactors.some(p => i % p === 0)) {
				if(foundNondivisible) {
					// console.log(`skipped ${i - first + 1}`);
					first = i;
					continue outerLoop;
				}
				else { foundNondivisible = true; }
			}
		}

		if(isDivisible(size, first)) {
			// console.log(`[${first} .. ${first + size - 1}] is divisible!`);
			numFound ++;
			if(numFound === size) {
				return first;
			}
		}
	}
	throw new Error("Unreachable.");
};

// console.log(solve(15));
// debugger;
