import { Parities, Parity } from "./wide-castle-algorithm.mjs";

const paths = (startY: number, endY: number, width: number, height: number, parity: Parity, nextMove: "up" | "down"): number => {
	/* 
	Returns the number of lattice paths from (0, startY) to (width, endY) satisfying the following criteria:
	- The path only moves right, up, and down, and stays within the given rectangle,
	- The last move in the path (if there is one) is a move to the right,
	- The number of "up" moves in the path has the given parity,
	- The path first moves either right or in the direction of `nextMove`.
	*/

	if(width === 1) {
		const correctParity = (startY >= endY && parity === "even") || (startY < endY && Parities.parity(endY - startY) === parity);
		const correctDirection = (nextMove === "up" && endY >= startY) || (nextMove === "down" && endY <= startY);
		return (correctParity && correctDirection) ? 1 : 0;
	}
	
	const pivotY = (height % 2 === 0) ? height / 2 : height - 1;
	const parities = [["even", parity], ["odd", Parities.opposite[parity]]] as [Parity, Parity][];
	let result;
	if(startY === 0) {
		result = paths(0, endY, width, height - 1, parity, "up");
	}
	else if(nextMove === "up") {
		result = (endY <= startY) ? 0 : paths(0, endY - startY, )
	}
	for(let nextCrossingX = 1; nextCrossingX <= width; nextCrossingX ++) {
		for(const [parityBefore, parityAfter] of parities) {
			let pathsBefore: number, pathsAfter: number;
			if(startY === 0) {
				pathsBefore = paths(0, pivotY, nextCrossingX, pivotY, parityBefore, "up");
				pathsAfter = paths(pivotY, endY, width - nextCrossingX, height, parityAfter, "up");
			}
			else if(nextMove === "up") {
				pathsBefore = paths(0, 0, nextCrossingX, height - startY, parityBefore, "up");
				pathsAfter = paths(startY, endY, width - nextCrossingX, height, parityAfter, "down");
			}
			else {
				pathsBefore = paths(0, 0, nextCrossingX, startY, parityBefore, "up");
				pathsAfter = paths(startY, endY, width - nextCrossingX, height, parityAfter, "up");
			}
			result += pathsBefore * pathsAfter;
		}
	}
	return result;

	// let result = 0;
	// if(startY === 0) {
	// 	const pivotY = (height % 2 === 0) ? height / 2 : height - 1;
	// 	for(let nextCrossingX = 1; nextCrossingX <= width; nextCrossingX ++) {
	// 		const parities = [["even", parity], ["odd", Parities.opposite[parity]]] as [Parity, Parity][];
	// 		for(const [parityBefore, parityAfter] of parities) {
	// 			const pathsBefore1 = paths(0, pivotY, nextCrossingX, pivotY, "even", "up");
	// 			const pathsAfter1 = paths(pivotY, endY, width - nextCrossingX, height, parity, "up");
	// 			result += pathsBefore1 * pathsAfter1;
	// 		}
	// 	}
	// }
	// else if(nextMove === "up") {
	// 	for(let nextCrossingX = 1; nextCrossingX <= width; nextCrossingX ++) {
	// 		const pathsBefore1 = paths(startY, startY, nextCrossingX, startY, "even", "up");
	// 		const pathsAfter1 = paths(startY, endY, width - nextCrossingX, height, parity, "up");
	// 		result += pathsBefore1 * pathsAfter1;
			
	// 		const pathsBefore2 = paths(startY, startY, nextCrossingX, startY, "odd", "up");
	// 		const pathsAfter2 = paths(startY, endY, width - nextCrossingX, height, Parities.opposite[parity], "up");
	// 		result += pathsBefore2 * pathsAfter2;
	// 	}
	// }
	// else {
		
	// }
	// return result;
};
