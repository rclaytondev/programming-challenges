const solve = (upperBound: number) => {
	let sum = 0;
	for(let side1 = 1; side1 + 2 * (side1 - 1) <= upperBound; side1 ++) {
		for(const side2 of [side1 - 1, side1 + 1]) {
			const perimeter = side1 + 2 * side2;
			if(side2 === 0 || perimeter > upperBound) { continue; }
			const area = 1/2 * side1 * Math.sqrt(side2 ** 2 - side1 ** 2 / 4);
			if(area % 1 === 0) {
				sum += perimeter;
			}
		}
	}
	return sum;
};
console.log(solve(1000000000));
debugger;
