const waysToExpressAsSum = (total, numbers) => {
	let ways = [];
	for(let i = 0; i < numbers.length; i ++) {
		for(let j = i + 1; j < numbers.length; j ++) {
			if(numbers[i] + numbers[j] === total) {
				ways.push([numbers[i], numbers[j]]);
			}
		}
	}
	return ways;
};

const squaresBelow = (number) => {
	let squares = [];
	for(let i = 1; i * i < number; i ++) {
		squares.push(i * i);
	}
	return squares;
};
const numTriangles = (desiredPerimeter) => {
	/* returns the number of right triangles with integer sides that have the given perimeter. */
	let triangles = 0;
	for(let hypotenuse = 5; hypotenuse <= desiredPerimeter - 7; hypotenuse ++) {
		const possibleTriangles = waysToExpressAsSum(hypotenuse ** 2, squaresBelow(hypotenuse ** 2));
		possibleTriangles.forEach((triangle) => {
			const [leg1Sq, leg2Sq] = triangle;
			const [leg1, leg2] = [Math.sqrt(leg1Sq), Math.sqrt(leg2Sq)];
			const perimeter = leg1 + leg2 + hypotenuse;
			if(perimeter === desiredPerimeter) {
				triangles ++;
			}
		});
	}
	return triangles;
};

let mostSolutions = 0;
let perimeterWithMost = 0;
for(let i = 5; i <= 1000; i ++) {
	const triangles = numTriangles(i);
	if(triangles > mostSolutions) {
		console.log(`when p=${i}, there are ${triangles} triangles`);
		mostSolutions = triangles;
		perimeterWithMost = i;
	}
}
console.log(perimeterWithMost);
