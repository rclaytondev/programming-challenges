import { Directions } from "../../utils-ts/modules/geometry/Direction.mjs";
import { BigintMath } from "../../utils-ts/modules/math/BigintMath.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { Parities, Parity } from "./wide-castle-algorithm.mjs";

const paritiesWithSum = (parity: Parity) => [["even", parity], ["odd", Parities.opposite[parity]]] as [Parity, Parity][];

let heights = new Set<bigint>();

const cornerPathsCache = new Map<string, bigint>();
const middlePathsCache = new Map<string, bigint>();

export const pathsFromCorner = ((width: bigint, height: bigint, endCorner: "up" | "down", stepType: "up" | "down", parity: Parity, modulo: bigint): bigint => {
	heights.add(height);
	if(width < 0 || height < 0) { return 0n; }
	if(width === 0n) {
		const steps = (stepType === "up") ? height : 0n;
		return (Parities.parity(steps) === parity) ? 1n : 0n;
	}
	if(height === 0n) {
		return (parity === "even") ? 1n : 0n;
	}

	if(endCorner === "down") { stepType = "up"; }
	if(parity === "odd") {
		const allPaths = (height + 1n) ** width;
		return BigintMath.generalizedModulo(
			allPaths - pathsFromCorner(width, height, endCorner, stepType, "even", modulo),
			modulo
		);
	}

	const argsString = `${width},${height},${endCorner},${stepType},${parity},${modulo}`;
	const precomputed = cornerPathsCache.get(argsString);
	if(typeof precomputed === "bigint") { return precomputed; }

	const pivotY = (height % 2n === 0n) ? height : (height + 1n) / 2n;
	const pathsWithoutCrossing = (endCorner === "up") ? 0n : pathsFromCorner(width, pivotY - 1n, endCorner, stepType, parity, modulo)
	let result = pathsWithoutCrossing;
	for(let firstCrossingX = 0n; firstCrossingX <= width; firstCrossingX ++) {
		for(const [parityBefore, parityAfter] of paritiesWithSum((stepType === "up" ? Parities.opposite[parity] : parity))) {
			const pathsBefore = pathsFromCorner(firstCrossingX, pivotY - 1n, "up", stepType, parityBefore, modulo);
			const pathsAfter = pathsFromMiddle(width - firstCrossingX, height, pivotY, endCorner, stepType, parityAfter, "up", modulo);
			result += pathsBefore * pathsAfter;
			result %= modulo;
		}
	}
	cornerPathsCache.set(argsString, result);
	return result;
});

export const pathsFromMiddle = ((width: bigint, height: bigint, startY: bigint, endCorner: "up" | "down", stepType: "up" | "down", parity: Parity, nextMove: "up" | "down", modulo: bigint): bigint => {
	/*
	Returns the number of lattice paths with moves right/up/down satisfying the following:
	- The path starts at (0, `startY`).
	- The path ends at either (`width`, 0) or (`height`, 0) depending on `endCorner`.
	- The path stays within the rectangle of size `width` by `height`.
	- The parity of the number of steps in the direction `stepType` is `parity`.
	- The first move in the path is right or up (if `nextMove` is "up") or down (if `nextMove` is "down").
	*/
	heights.add(height);
	if(width === 0n) {
		const steps = (stepType !== endCorner) ? 0n :(stepType === "down" ? startY : height - startY);
		const correctParity = (parity === Parities.parity(steps));
		const correctDirection = (nextMove === endCorner);
		return (correctParity && correctDirection) ? 1n : 0n;
	}
	if(height === 0n) {
		throw new Error("Unimplemented.");
	}

	if(parity === "odd") {
		const firstChoices = (nextMove === "up") ? height - startY + 1n : startY;
		const allPaths = firstChoices * (height + 1n) ** (width - 1n);
		return BigintMath.generalizedModulo(
			allPaths - pathsFromMiddle(width, height, startY, endCorner, stepType, "even", nextMove, modulo),
			modulo
		);
	}

	const argsString = `${width},${height},${startY},${endCorner},${stepType},${parity},${nextMove},${modulo}`;
	const precomputed = middlePathsCache.get(argsString);
	if(typeof precomputed === "bigint") { return precomputed; }

	const pathsWithoutCrossing = ((endCorner !== nextMove) ? 0n : pathsFromCorner(
		width,
		endCorner === "up" ? height - startY : startY - 1n,
		"up",
		endCorner === "up" ? stepType : Directions.opposite[stepType],
		(endCorner === "down" && stepType === "down") ? Parities.opposite[parity] : parity,
		modulo
	));
	let result = pathsWithoutCrossing;
	for(let firstCrossingX = 1n; firstCrossingX <= width; firstCrossingX ++) {
		for(const [parityBefore, parityAfter] of paritiesWithSum((nextMove === "down" ? Parities.opposite[parity] : parity))) {
			const pathsBefore = pathsFromCorner(firstCrossingX, nextMove === "up" ? height - startY : startY - 1n, "down", stepType, parityBefore, modulo);
			const pathsAfter = pathsFromMiddle(width - firstCrossingX, height, startY, endCorner, stepType, parityAfter, Directions.opposite[nextMove], modulo);
			result += pathsBefore * pathsAfter;
			result %= modulo;
		}
	}
	middlePathsCache.set(argsString, result);
	return result;
});

export const fullHeightCastles = (width: bigint, height: bigint, modulo: bigint) => {
	const allCastles = pathsFromCorner(width, height - 1n, "down", "up", "odd", modulo);
	const nonFullHeight = pathsFromCorner(width, height - 2n, "down", "up", "odd", modulo);
	return BigintMath.generalizedModulo(allCastles - nonFullHeight, modulo);
};

console.time();
console.log(fullHeightCastles(6n, 7n, 10n ** 12n));
console.timeEnd();
debugger;
