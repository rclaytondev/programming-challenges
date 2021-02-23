const digits = (number) => [...`${number}`].map(digit => Number.parseInt(digit));
const factorial = (number) => {
	if(number <= 1) { return 1; }
	return number * factorial(number - 1);
};
const factorialDigitSum = (number) => {
	return digits(number).map(digit => factorial(digit)).sum();
};

let sum = 0;
for(let i = 0; i < 1e7; i ++) {
	if(factorialDigitSum(i) === i) {
		sum += i;
		console.log(i);
	}
}
console.log("Sum is " + sum);
