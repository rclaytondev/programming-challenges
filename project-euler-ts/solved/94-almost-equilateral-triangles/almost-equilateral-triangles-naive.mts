export class Problem94NaiveSolution {
	static isocelesArea(singleSide: number, doubleSide: number) {
		return 0.5 * singleSide * Math.sqrt(doubleSide ** 2 - (singleSide ** 2) / 4);
	}
	static solve(upperBound: number) {
		let sum = 0;
		for(let side1 = 1; side1 + 2 * (side1 - 1) <= upperBound; side1 ++) {
			for(const side2 of [side1 + 1, side1 - 1]) {
				if(Problem94NaiveSolution.isocelesArea(side1, side2) % 1 === 0) {
					const perimeter = side1 + 2 * (side2);
					const nondegenerate = (2 * side2 > side1);
					if(perimeter <= upperBound && nondegenerate) {
						sum += perimeter;
					}
				}
			}
		}
		return sum;
	}
}
