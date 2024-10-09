import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const numBlockCombinations = Utils.memoize((minBlockSize: number, length: number) => {
	if(length < minBlockSize) {
		return 1;
	}

	let result = 1;
	for(let firstSize = minBlockSize; firstSize <= length; firstSize ++) {
		for(let start = 0; start <= length - firstSize; start ++) {
			result += numBlockCombinations(minBlockSize, length - (start + firstSize + 1));
		}
	}
	return result;
});

const solve = (minBlockSize: number = 50, target = 1_000_000) => {
	for(let length = 1; true; length ++) {
		if(numBlockCombinations(minBlockSize, length) > target) {
			return length;
		}
	}
};

// console.time();
// console.log(solve());
// console.timeEnd();
// debugger;
