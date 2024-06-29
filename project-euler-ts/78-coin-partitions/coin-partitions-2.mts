let cachedResults: Map<string, number> = new Map();

export const numPartitions = (num: number, upperBound: number = num) => {
	upperBound = Math.min(upperBound, num);
	const cachedResult = cachedResults.get(`${num},${upperBound}`);
	if(cachedResult != null) {
		return cachedResult;
	}

	if(num === 0) {
		return 1;
	}
	if(num === 1) {
		return (upperBound >= 1) ? 1 : 0;
	}
	let result = 0;
	for(let firstNumber = 1; firstNumber <= upperBound; firstNumber ++) {
		result += numPartitions(num - firstNumber, firstNumber);
	}
	cachedResults.set(`${num},${upperBound}`, result);
	return result;
};
const solve = () => {
	let num = 1;
	while(true) {
		if(num % 50 === 0) {
			console.log(num);
		}
		const partitions = numPartitions(num);
		if(partitions % (10 ** 6) === 0) {
			return num;
		}
		num ++;
	}
};
console.log(solve());
