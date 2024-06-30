import { Utils } from "../../utils-ts/modules/Utils.mjs";

const MODULO = 10 ** 6;
let cachedResults: Map<string, number> = new Map();

export const numPartitions = (num: number, upperBound: number = num) => {
	upperBound = Math.min(upperBound, num);
	const cachedResult = cachedResults.get(`${num},${upperBound}`);
	if(cachedResult != null) {
		// console.log(`returning cached result!`);
		return cachedResult;
	}

	if(num === 0) {
		// console.log(`base case!`);
		return 1;
	}
	if(num === 1) {
		// console.log(`base case!`);
		return (upperBound >= 1) ? 1 : 0;
	}
	// console.log(`calculating using recursion!`);
	let result = 0;
	for(let firstNumber = 1; firstNumber <= upperBound; firstNumber ++) {
		result += numPartitions(num - firstNumber, firstNumber);
		result %= MODULO;
	}
	cachedResults.set(`${num},${upperBound}`, result);
	return result;
};
const solve = () => {
	let num = 1;
	while(true) {
		// console.log(num);
		if(num % 50 === 0) {
			console.log(num);
			// debugger;
		}
		const partitions = numPartitions(num);
		if(partitions % (10 ** 6) === 0) {
			return num;
		}
		num ++;
	}
};
console.log(solve());

// console.log(Utils.range(1, 20).map(n => [n, numPartitions(n)]));
// debugger;
// const MAXIMUM = 400;
// const evenProportion = Utils.range(1, MAXIMUM).filter(n => numPartitions(n) % 2 === 0).length / MAXIMUM;
// console.log(`for the numbers between 1 and ${MAXIMUM}, a proportion of ${evenProportion} of them have an even number of partitions.`);
