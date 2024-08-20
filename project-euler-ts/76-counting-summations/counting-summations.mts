import { Utils } from "../../utils-ts/modules/Utils.mjs";

export const numPartitions = Utils.memoize((num: number, lowerBound: number = 1) => {
	if(num === 0) {
		return 1;
	}
	if(num === 1) {
		return (lowerBound <= 1) ? 1 : 0;
	}
	let result = 0;
	for(let firstNumber = lowerBound; firstNumber <= num; firstNumber ++) {
		result += numPartitions(num - firstNumber, firstNumber);
	}
	return result;
});

// console.log(numPartitions(100) - 1);
// debugger;
