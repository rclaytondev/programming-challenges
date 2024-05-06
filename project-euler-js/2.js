const fibonacciMemoized = {};
const fibonacci = (n) => {
	if(fibonacciMemoized[n]) {
		return fibonacciMemoized[n];
	}

	if(n === 0) { return 0; }
	if(n === 1 || n === 2) { return 1; }

	const answer = fibonacci(n - 1) + fibonacci(n - 2);
	fibonacciMemoized[n] = answer;
	return answer;
};


let sum = 0;
let i = 0;
let result = fibonacci(i);
while(result < 4e6) {
	i ++;
	result = fibonacci(i);
	if(result % 2 === 0) {
		console.log(`adding ${result}`);
		sum += result;
	}
}
console.log(sum);
