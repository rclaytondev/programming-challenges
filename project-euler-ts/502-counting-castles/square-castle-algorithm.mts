/*
This algorithm counts castles using the recurrence relation for the number of paths to a point in terms of the number of paths to its preceding points.
(It is supposed to run in O(w * h) time, so it should be fast for rectangles of small area).
This is a reimplementation of an algorithm I wrote a few years ago.
*/

import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";

const initialPaths = (height: bigint): [bigint[], bigint[]] => {
	const evenPaths = [];
	const oddPaths = [];
	for(let y = 0; y <= height; y ++) {
		evenPaths[y] = (y % 2 === 0) ? 1n : 0n;
		oddPaths[y] = (y % 2 === 1) ? 1n : 0n;
	}
	return [evenPaths, oddPaths];
};

export const nextPaths = (evenPaths: bigint[], oddPaths: bigint[], modulo: bigint): [bigint[], bigint[]] => {
	const nextEvenPaths = [...evenPaths].fill(0n);
	const nextOddPaths = [...oddPaths].fill(0n);

	let downSumEven = 0n;
	let downSumOdd = 0n;
	for(let y = evenPaths.length - 1; y >= 0; y --) {
		nextEvenPaths[y] += downSumEven;
		downSumEven += evenPaths[y];
		nextOddPaths[y] += downSumOdd;
		downSumOdd += oddPaths[y];

		nextEvenPaths[y] %= modulo;
		nextOddPaths[y] %= modulo;
	}

	let upSumEvenEven = 0n;
	let upSumEvenOdd = 0n;
	for(let y = 0; y < evenPaths.length; y ++) {
		upSumEvenEven += (y % 2 === 0) ? evenPaths[y] : oddPaths[y];
		upSumEvenOdd += (y % 2 === 0) ? oddPaths[y] : evenPaths[y];
		nextEvenPaths[y] += (y % 2 === 0) ? upSumEvenEven : upSumEvenOdd;
		nextEvenPaths[y] %= modulo;
	}
	let upSumOddEven = 0n;
	let upSumOddOdd = 0n;
	for(let y = 0; y < evenPaths.length; y ++) {
		upSumOddEven += (y % 2 === 1) ? evenPaths[y] : oddPaths[y];
		upSumOddOdd += (y % 2 === 1) ? oddPaths[y] : evenPaths[y];
		nextOddPaths[y] += (y % 2 === 0) ? upSumOddEven : upSumOddOdd;
		nextOddPaths[y] %= modulo;
	}
	return [nextEvenPaths, nextOddPaths];
};

const allCastles = (width: bigint, height: bigint, modulo: bigint) => {
	let [evenPaths, oddPaths] = initialPaths(height);
	for(let i = 0; i < width; i ++) {
		[evenPaths, oddPaths] = nextPaths(evenPaths, oddPaths, modulo);
	}
	return oddPaths[0];
};

export const fullHeightCastles = (width: bigint, height: bigint, modulo: bigint) => {
	const all = allCastles(width, height - 1n, modulo);
	const nonFullHeight = allCastles(width, height - 2n, modulo);
	return BigintMath.generalizedModulo(all - nonFullHeight, modulo);
};

// console.time();
// console.log(fullHeightCastles(1000, 1000));
// console.timeEnd();
// debugger;
