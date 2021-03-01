const nthTriangleNum = n => n * (n + 1) / 2;
const indexInTriangulars = number => -1/2 + Math.sqrt(1/4 + 2 * number);
const numDivisors = (number) => {
	let divisors = 0;
	for(let i = 1; i * i <= number; i ++) {
		if(number % i === 0) {
			divisors += (number === i * i) ? 1 : 2;
		}
	}
	return divisors;
};
testing.addUnit("nthTriangleNum()", nthTriangleNum, [
	[1, 1],
	[2, 3],
	[3, 6],
	[4, 10],
	[5, 15],
	[6, 21]
]);
testing.addUnit("indexInTriangulars()", indexInTriangulars, [
	[1, 1],
	[3, 2],
	[6, 3],
	[10, 4],
	[15, 5],
	[21, 6]
]);
testing.addUnit("numDivisors()", numDivisors, [
	[1, 1],
	[2, 2],
	[3, 2],
	[4, 3],
	[6, 4],
	[10, 4],
	[25, 3]
]);

const lowestTriangularWithNDivisors = (n) => {
	for(let i = 1; i < Infinity; i ++) {
		const triangular = nthTriangleNum(i);
		const divisors = numDivisors(triangular);
		if(numDivisors(triangular) >= n) {
			return triangular;
		}
	}
};

console.time("solving the problem");
console.log(lowestTriangularWithNDivisors(500));
console.timeEnd("solving the problem");


testing.testAll();
