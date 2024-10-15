import { HashSet } from "../../utils-ts/modules/HashSet.mjs";

type State = { used: number[], unused: number[] };

const stateToString = (state: State) => `[${state.used.sort((a, b) => a - b)}], [${state.unused.sort((a, b) => a - b)}]`;

const nextStates = (state: State, upperBound: number) => {
	const result = new HashSet<State>([], stateToString);
	for(const value1 of [...state.used, ...state.unused]) {
		for(const value2 of [...state.used, ...state.unused]) {
			if(value1 + value2 > upperBound || [...state.used, ...state.unused].includes(value1 + value2)) {
				continue;
			}
			const newValue = value1 + value2;
			result.add({
				used: [...new Set([...state.used, value1, value2])],
				unused: [newValue, ...state.unused.filter(v => v !== value1 && v !== value2)]
			});
		}
	}
	return result;
};

export const allNumMultiplications = (upperBound: number) => {
	let states: State[] = [{ used: [], unused: [1] }];
	const answers = new Map<number, number>();
	while(answers.size < upperBound) {
		for(const state of states) {
			for(const value of [...state.used, ...state.unused]) {
				if(!answers.has(value)) {
					answers.set(value, state.used.length + state.unused.length - 1);
				}
			}
		}
		states = [...HashSet.union(...states.map(s => nextStates(s, upperBound)))];
	}
	return answers;
};

console.time();
console.log(allNumMultiplications(5));
console.timeEnd();
debugger;
