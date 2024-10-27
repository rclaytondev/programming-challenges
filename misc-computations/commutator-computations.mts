import { FreeGroup } from "./utils/FreeGroup.mjs";

const solve = () => {
	const GROUP = new FreeGroup(["x", "y", "g"]);
	const TARGET = [
		{ generator: "g", inverted: false },
		{ generator: "x", inverted: true },
		{ generator: "y", inverted: true },
		{ generator: "x", inverted: false },
		{ generator: "y", inverted: false },
		{ generator: "g", inverted: true }
	];

	for(let length = 0; true; length ++) {
		// console.log(length);
		const words = [...GROUP.wordsOfLength(length)];
		for(const word1 of words) {
			for(const word2 of words) {
				if(GROUP.areEqual(TARGET, GROUP.product(
					GROUP.inverse(word1),
					GROUP.inverse(word2),
					word1,
					word2
				))) { return [word1, word2]; }
			}
		}
	}
};
// console.log(solve());
// debugger;
