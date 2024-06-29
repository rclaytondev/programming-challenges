export const numPartitions = (num: number, lowerBound: number = 1) => {
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
};
const solve = () => {
	let num = 1;
	while(true) {
		const partitions = numPartitions(num);
		if(partitions % (10 ** 6) === 0) {
			return num;
		}
		num ++;
	}
};
console.log(solve());
