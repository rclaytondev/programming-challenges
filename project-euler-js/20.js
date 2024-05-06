const factorial = (num) => {
	if(num <= 1) { return 1n; }
	return factorial(num - 1n) * num;
};

const result = `${factorial(100n)}`;
const digitSum = [...result].sum(char => Number.parseInt(char));
console.log(digitSum);
