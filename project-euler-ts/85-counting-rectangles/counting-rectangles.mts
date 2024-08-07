import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const bestApproximants = (height: number, rectangles: number) => {
	const c = height * (height + 1) / 4;
	const width = (-c + Math.sqrt(c * (c + 4 * rectangles))) / (2 * c);
	return [Math.floor(width), Math.floor(width) + 1];
};
const countRectangles = (width: number, height: number) => width * (width + 1) * height * (height + 1) / 4;
const solve = (targetRectangles: number) => {
	let closestArea = 0;
	let closestRectangles = Infinity;
	for(let height = 1; height < Infinity; height ++) {
		const widths = bestApproximants(height, targetRectangles);
		if(widths[0] < height) { break; }
		for(const width of widths) {
			const rectangles = countRectangles(width, height);
			if(MathUtils.dist(rectangles, targetRectangles) < MathUtils.dist(closestRectangles, targetRectangles)) {
				closestArea = width * height;
				closestRectangles = rectangles;
			}
		}
	}
	return closestArea;
};
// console.log(solve(2000000));
// debugger;
