/*
First, I will test whether the following two functions produce the same probability distribution.
*/

const func1 = () => {
	const num = Math.random();
	return num * num;
};
const func2 = () => {
	const num1 = Math.random();
	const num2 = Math.random();
	const num3 = Math.random();
	const num4 = Math.random();
	return num1 * num2 * num3 * num4;
};


const test = (func) => {
	const results = [];
	const NUM_TRIALS = 100000;
	for(let i = 0; i < NUM_TRIALS; i ++) {
		results.push(func());
	}
	const average = results.mean();
	console.log(average);
};
test(func1);
test(func2);
