const numSolutions = (n) => {
	/* returns the number of integer solutions to the equation 1/x + 1/y = 1/n. */
	let solutions = 0;
	for(let x = n; x <= 2 * n; x ++) {
		const y = (x * n) / (x - n);
		if(y % 1 === 0) {
			solutions ++;
		}
	}
	return solutions;
};

// values of n have been checked up to n=92,300
// const MILLISECONDS_IN_MINUTE = 60 * 1000;
// let startTime = Date.now();
// for(let n = 1000; n < Infinity; n ++) {
// 	const solutions = numSolutions(n);
// 	if(solutions > 1000) {
// 		console.log(`1/x + 1/y = 1/${n} has >1000 solutions!`);
// 		break;
// 	}
// 	else {
// 		// console.log(`1/x + 1/y = 1/${n} only had ${solutions} solutions.`);
// 	}
//
//
// 	if(n % 100 === 0 && Date.now() - startTime > MILLISECONDS_IN_MINUTE) {
// 		console.log(`timed out after checking up to n=${n}`);
// 		break;
// 	}
// }

const isPrime = (n) => {
	for(let i = 2; i <= n/2; i++){
		if(n % i === 0){
			return false;
		}
	};
	return true;
};
// const numFactors = num => {
// 	const res = num % 2 === 0 ? [2] : [];
// 	let start = 3;
// 	while(start <= num){
// 		if(num % start === 0){
// 			if(isPrime(start)){
// 				res.push(start);
// 			};
// 		};
// 		start++;
// 	};
// 	return res;
// };
// const numFactors = num => {
// 	for(let i = 2; i <= num; i ++) {
// 		if(isPrime(i) && num % i === 0) {
// 			return numFactors(num / i) + 1;
// 		}
// 	}
// 	return 0;
// };
const numFactors = num => {
	let factors = 0;
	for(let i = 2; i <= num; i ++) {
		if(num % i === 0) {
			factors ++;
		}
	}
	return factors;
};

// const LOWER_LIMIT = 160000;
// const LIMIT = 500000;
const LOWER_LIMIT = 0;
const LIMIT = 1000;
let maximum = 0;
let minimum = Infinity;
let maxFactors = 0;
for(let n = LOWER_LIMIT; n < LIMIT; n += 1) {
	const solutions = numSolutions(n);
	maximum = Math.max(solutions, maximum);
	minimum = Math.min(solutions, minimum);
	maxFactors = Math.max(maxFactors, numFactors(n));
}


let highest = 0;
let highestFactors = 0;
for(let n = LOWER_LIMIT; n < LIMIT; n += 1) {
	const solutions = numSolutions(n);
	const x = Math.map(n, 0, LIMIT, 0, canvas.width);
	const y = Math.map(solutions, minimum, maximum, canvas.height, 0);
	const color = (n % 2 === 0) ? "red" : "black";
	if(solutions > highest) {
		c.fillStyle = color;
		c.fillCircle(x, y, 5);
		highest = solutions;
		c.fillText(`(${n}, ${solutions})`, x + 10, y + 10);
	}
	else {
		c.strokeStyle = color;
		c.strokeCircle(x, y, 5);
	}

	const factors = numFactors(n);
	console.log(n, factors);
	const factorY = Math.map(factors, 0, maxFactors, canvas.height, 0);
	c.strokeStyle = (factors >= highestFactors) ? "black" : "rgb(200, 200, 200)";
	c.lineWidth = 1;
	c.strokeLine(x, canvas.height, x, factorY);
	highestFactors = Math.max(highestFactors, factors);
}
