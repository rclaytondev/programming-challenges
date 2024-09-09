import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const isSquare = (n: number) => Math.floor(Math.sqrt(n)) ** 2 === n;
export const admissiblePaths = Utils.memoize((width: number, height: number, modulo: number): number => {
	if(width === 0 || height === 0) {
		return 1;
	}
	if(isSquare(width) && isSquare(height) && isSquare(width + height)) {
		return 0;
	}
	return (admissiblePaths(width - 1, height, modulo) + admissiblePaths(width, height - 1, modulo)) % modulo;
});

// console.time();
// console.log(admissiblePaths(10000000, 1000000007));
// console.timeEnd();
// debugger;
