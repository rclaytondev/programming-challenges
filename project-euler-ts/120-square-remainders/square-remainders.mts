import { HashSet } from "../../utils-ts/modules/HashSet.mjs";

export const maxSquareRemainder = (a: number) => {
	let max = 1;
	const pairsChecked = new HashSet<[number, number]>();
	let power1 = 1;
	let power2 = 1;
	for(let power = 1; true; power ++) {
		power1 = (power1 * (a - 1)) % (a ** 2);
		power2 = (power2 * (a + 1)) % (a ** 2);
		if(pairsChecked.has([power1, power2])) {
			return max;
		}
		const value = (power1 + power2) % (a ** 2);
		if(value > max) {
			max = value;
		}
		pairsChecked.add([power1, power2]);
	}
};

const maxSquareRemainderSum = (upperBound: number) => {
	let sum = 0;
	for(let a = 3; a <= upperBound; a ++) {
		console.log(a);
		sum += maxSquareRemainder(a);
	}
	return sum;
};


// console.time();
// console.log(maxSquareRemainderSum(1000));
// console.timeEnd();
// debugger;
