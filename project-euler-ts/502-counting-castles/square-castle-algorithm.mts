/*
This algorithm counts castles using the recurrence relation for the number of paths to a point in terms of the number of paths to its preceding points.
(It is supposed to run in O(w * h) time, so it should be fast for rectangles of small area).
This is a reimplementation of an algorithm I wrote a few years ago.
*/

const initialPaths = (height: number): [number[], number[]] => {
	const evenPaths = [];
	const oddPaths = [];
	for(let y = 0; y <= height; y ++) {
		evenPaths[y] = (y % 2 === 0) ? 1 : 0;
		oddPaths[y] = (y % 2 === 1) ? 1 : 0;
	}
	return [evenPaths, oddPaths];
};

export const nextPaths = (evenPaths: number[], oddPaths: number[]): [number[], number[]] => {
	const nextEvenPaths = [...evenPaths].fill(0);
	const nextOddPaths = [...oddPaths].fill(0);

	let downSumEven = 0;
	let downSumOdd = 0;
	for(let y = evenPaths.length - 1; y >= 0; y --) {
		nextEvenPaths[y] += downSumEven;
		downSumEven += evenPaths[y];
		nextOddPaths[y] += downSumOdd;
		downSumOdd += oddPaths[y];
	}

	let upSumEvenEven = 0;
	let upSumEvenOdd = 0;
	for(let y = 0; y < evenPaths.length; y ++) {
		upSumEvenEven += (y % 2 === 0) ? evenPaths[y] : oddPaths[y];
		upSumEvenOdd += (y % 2 === 0) ? oddPaths[y] : evenPaths[y];
		nextEvenPaths[y] += (y % 2 === 0) ? upSumEvenEven : upSumEvenOdd;
	}
	let upSumOddEven = 0;
	let upSumOddOdd = 0;
	for(let y = 0; y < evenPaths.length; y ++) {
		upSumOddEven += (y % 2 === 1) ? evenPaths[y] : oddPaths[y];
		upSumOddOdd += (y % 2 === 1) ? oddPaths[y] : evenPaths[y];
		nextOddPaths[y] += (y % 2 === 0) ? upSumOddEven : upSumOddOdd;
	}
	return [nextEvenPaths, nextOddPaths];
};

const allCastles = (width: number, height: number): number => {
	let [evenPaths, oddPaths] = initialPaths(height);
	for(let i = 0; i < width; i ++) {
		[evenPaths, oddPaths] = nextPaths(evenPaths, oddPaths);
	}
	return oddPaths[0];
};

export const fullHeightCastles = (width: number, height: number) => {
	const all = allCastles(width, height - 1);
	const nonFullHeight = allCastles(width, height - 2);
	return all - nonFullHeight;
};

console.time();
console.log(fullHeightCastles(1000, 1000));
console.timeEnd();
debugger;
