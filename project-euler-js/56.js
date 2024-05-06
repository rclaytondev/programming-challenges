const digitSum = (num) => [...`${num}`].map(d => Number.parseInt(d)).sum();
const solve = () => {
	let maxSum = 0;
	for(let a = 1n; a < 100n; a ++) {
		for(let b = 1n; b < 100n; b ++) {
			const sum = digitSum(a ** b);
			if(sum > maxSum) {
				console.log(`${a ** b} has a digit sum of ${sum}`);
				maxSum = sum;
			}
		}
	}
	return maxSum;
};
