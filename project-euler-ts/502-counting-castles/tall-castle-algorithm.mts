import { Directions } from "../../utils-ts/modules/geometry/Direction.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { Parities, Parity } from "./wide-castle-algorithm.mjs";

const paritiesWithSum = (parity: Parity) => [["even", parity], ["odd", Parities.opposite[parity]]] as [Parity, Parity][];

let heights = new Set<number>();

const cornerPathsCache = new Map<string, number>();
const middlePathsCache = new Map<string, number>();

export const pathsFromCorner = ((width: number, height: number, endCorner: "up" | "down", stepType: "up" | "down", parity: Parity): number => {
	heights.add(height);
	if(width < 0 || height < 0) { return 0; }
	if(width === 0) {
		const steps = (stepType === "up") ? height : 0;
		return (Parities.parity(steps) === parity) ? 1 : 0;
	}
	if(height === 0) {
		return (parity === "even") ? 1 : 0;
	}

	const argsString = `${width},${height},${endCorner},${stepType},${parity}`;
	const precomputed = cornerPathsCache.get(argsString);
	if(typeof precomputed === "number") { return precomputed; }

	const pivotY = (height % 2 === 0) ? height : (height + 1) / 2;
	const pathsWithoutCrossing = (endCorner === "up") ? 0 : pathsFromCorner(width, pivotY - 1, endCorner, stepType, parity)
	let result = pathsWithoutCrossing;
	for(let firstCrossingX = 0; firstCrossingX <= width; firstCrossingX ++) {
		for(const [parityBefore, parityAfter] of paritiesWithSum((stepType === "up" ? Parities.opposite[parity] : parity))) {
			const pathsBefore = pathsFromCorner(firstCrossingX, pivotY - 1, "up", stepType, parityBefore);
			const pathsAfter = pathsFromMiddle(width - firstCrossingX, height, pivotY, endCorner, stepType, parityAfter, "up");
			result += pathsBefore * pathsAfter;
		}
	}
	cornerPathsCache.set(argsString, result);
	return result;
});

export const pathsFromMiddle = ((width: number, height: number, startY: number, endCorner: "up" | "down", stepType: "up" | "down", parity: Parity, nextMove: "up" | "down"): number => {
	/*
	Returns the number of lattice paths with moves right/up/down satisfying the following:
	- The path starts at (0, `startY`).
	- The path ends at either (`width`, 0) or (`height`, 0) depending on `endCorner`.
	- The path stays within the rectangle of size `width` by `height`.
	- The parity of the number of steps in the direction `stepType` is `parity`.
	- The first move in the path is right or up (if `nextMove` is "up") or down (if `nextMove` is "down").
	*/
	heights.add(height);
	if(width === 0) {
		const steps = (stepType !== endCorner) ? 0 :(stepType === "down" ? startY : height - startY);
		const correctParity = (parity === Parities.parity(steps));
		const correctDirection = (nextMove === endCorner);
		return (correctParity && correctDirection) ? 1 : 0;
	}
	if(height === 0) {
		throw new Error("Unimplemented.");
	}

	const argsString = `${width},${height},${startY},${endCorner},${stepType},${parity},${nextMove}`;
	const precomputed = middlePathsCache.get(argsString);
	if(typeof precomputed === "number") { return precomputed; }

	const pathsWithoutCrossing = ((endCorner !== nextMove) ? 0 : pathsFromCorner(
		width,
		endCorner === "up" ? height - startY : startY - 1,
		"up",
		endCorner === "up" ? stepType : Directions.opposite[stepType],
		(endCorner === "down" && stepType === "down") ? Parities.opposite[parity] : parity
	));
	let result = pathsWithoutCrossing;
	for(let firstCrossingX = 1; firstCrossingX <= width; firstCrossingX ++) {
		for(const [parityBefore, parityAfter] of paritiesWithSum((nextMove === "down" ? Parities.opposite[parity] : parity))) {
			const pathsBefore = pathsFromCorner(firstCrossingX, nextMove === "up" ? height - startY : startY - 1, "down", stepType, parityBefore);
			const pathsAfter = pathsFromMiddle(width - firstCrossingX, height, startY, endCorner, stepType, parityAfter, Directions.opposite[nextMove]);
			result += pathsBefore * pathsAfter;
		}
	}
	middlePathsCache.set(argsString, result);
	return result;
});

export const fullHeightCastles = (width: number, height: number) => {
	const allCastles = pathsFromCorner(width, height - 1, "down", "up", "odd");
	const nonFullHeight = pathsFromCorner(width, height - 2, "down", "up", "odd");
	return allCastles - nonFullHeight;
};

console.time();
console.log(fullHeightCastles(100, 75));
console.timeEnd();
debugger;
