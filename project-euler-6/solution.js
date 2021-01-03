let sumOfSquares = 0;
for(let i = 1; i <= 100; i ++) {
	sumOfSquares += (i ** 2);
}

let sumSquared = 0;
for(let i = 1; i <= 100; i ++) {
	sumSquared += i;
}
sumSquared = sumSquared ** 2;

console.log(sumSquared - sumOfSquares);
