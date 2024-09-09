import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const isSquare = (n: number) => Math.floor(Math.sqrt(n)) ** 2 === n;
export const admissiblePaths = (gridSize: number, modulo: number) => {
	const logger = new CountLogger(n => 10000 * n, gridSize ** 2);
	const paths = new Map<string, number>();
	for(let sum = 1; sum <= 2 * gridSize; sum ++) {
		for(let x = 1; x < sum; x ++) {
			const y = sum - x;
			logger.count();
			if(!(isSquare(x) && isSquare(y) && isSquare(sum))) {
				const paths1 = paths.get(`${x-1},${y}`) ?? (x - 1 === 0 || y === 0 ? 1 : 0);
				const paths2 = paths.get(`${x},${y-1}`) ?? (x === 0 || y - 1 === 0 ? 1 : 0);
				const pathsToPoint = paths1 + paths2;
				if(pathsToPoint % modulo !== 0) {
					paths.set(`${x},${y}`, pathsToPoint % modulo);
				}
			}
		}
	}
	return paths.get(`${gridSize},${gridSize}`)!;
};

// console.time();
// console.log(admissiblePaths(10000000, 1000000007));
// console.timeEnd();
// debugger;
