export class CrossHatchedGrids {
	static tuplesWithMaxSum(maxX: number, maxY: number, maxSum: number) {
		if(maxX + maxY <= maxSum) {
			return maxX * maxY;
		}
		// This loop can be replaced with a 1-line formula.
		let result = 0;
		for(let x = 1; x <= maxX && x < maxSum; x ++) {
			result += Math.min(maxY, maxSum - x);
		}
		return result;
	}

	static unrotatedRectangles(width: number, height: number) {
		return width * (width + 1) * height * (height + 1) / 4
	}

	static rotatedRectangles(width: number, height: number): number {
		[width, height] = [Math.max(width, height), Math.min(width, height)];
		if(width === 1) {
			return height - 1;
		}
		let result = CrossHatchedGrids.rotatedRectangles(width - 1, height);
		for(let y = 1; y <= height; y ++) {
			const upleftDist = Math.min(2 * y - 1, 2 * width - 2);
			const downleftDist = Math.min(2 * (height - y + 1) - 1, 2 * width - 2);
			result += CrossHatchedGrids.tuplesWithMaxSum(upleftDist, downleftDist, 2 * width - 1);
		}
		for(let y = 1; y <= height - 1; y ++) {
			const upleftDist = Math.min(2 * y, 2 * width - 1);
			const downleftDist = Math.min(2 * (height - y), 2 * width - 1);
			result += CrossHatchedGrids.tuplesWithMaxSum(upleftDist, downleftDist, 2 * width);
		}
		return result;
	}

	static rectangles(width: number, height: number) {
		return (
			CrossHatchedGrids.unrotatedRectangles(width, height)
			+ CrossHatchedGrids.rotatedRectangles(width, height)
		);
	}

	static totalRectangles(maxWidth: number, maxHeight: number) {
		let sum = 0;
		for(let width = 1; width <= maxWidth; width ++) {
			for(let height = 1; height <= maxHeight; height ++) {
				sum += CrossHatchedGrids.rectangles(width, height);
			}
		}
		return sum;
	}
}

// console.time();
// console.log(CrossHatchedGrids.totalRectangles(47, 43));
// console.timeEnd();
// debugger;
