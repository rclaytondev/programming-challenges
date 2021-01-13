const nthTriangleNum = function(index) {
	if(index <= 1) {
		return 1;
	}
	return nthTriangleNum(index - 1) + index;
}.memoize();

const numFactors = (number) => {
	// if(number !== Math.round(number)) {
	// 	return 0;
	// }

	let factors = 0;
	for(let i = 1; i <= number; i ++) {
		if(number % i === 0) {
			factors ++;
		}
	}
	return factors;
};

// the first 17000 triangular numbers have been checked
for(let i = 1; i < Infinity; i ++) {
	const num = nthTriangleNum(i);
	const factors = numFactors(i);
	console.log(`${num} (triangular number ${i}) has ${factors} divisors.`);
	if(factors >= 500) {
		console.log(`the triangular number with ${factors} factors is ${num}`);
		break;
	}
}
