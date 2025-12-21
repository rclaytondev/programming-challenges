/*
This algorithm counts castles using the recurrence relation for the number of paths to a point in terms of the number of paths to its preceding points.
(It is supposed to run in O(w * h) time, so it should be fast for rectangles of small area).
This is a reimplementation of an algorithm I wrote a few years ago.
*/

import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { Parities, Parity } from "./wide-castle-algorithm.mjs";

const paths = Utils.memoize((x: number, y: number, width: number, height: number, parity: Parity, lastMove: "right" | "up" | "down"): number => {
	if(x < 0 || x > width || y < 0 || y > height) { return 0; }
	if(x === 0) {
		const valid = (lastMove === "right" && Parities.parity(y) === parity);
		return valid ? 1 : 0;
	}


	if(lastMove === "up") {
		return (
			paths(x, y - 1, width, height, Parities.opposite[parity], "right") +
			paths(x, y - 1, width, height, Parities.opposite[parity], "up")
		);
	}
	else if(lastMove === "down") {
		return (
			paths(x, y + 1, width, height, parity, "right") +
			paths(x, y + 1, width, height, parity, "down")
		);
	}
	else {
		return (
			paths(x - 1, y, width, height, parity, "right") +
			paths(x - 1, y, width, height, parity, "up") +
			paths(x - 1, y, width, height, parity, "down")
		);
	}
});

const setupMemoization = (width: number, height: number) => {
	for(let x = 0; x < width; x ++) {
		for(let y = 0; y < height; y ++) {
			for(const parity of ["even", "odd"] as const) {
				for(const lastMove of ["up", "down", "right"] as const) {
					paths(x, y, width, height, parity, lastMove);
				}
			}
		}
	}
};

const allCastles = (width: number, height: number): number => {
	setupMemoization(width, height);

	let sum = 0;
	for(let y = 0; y <= height; y ++) {
		sum += paths(width, y, width, height, "odd", "right");
	}
	return sum;
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
