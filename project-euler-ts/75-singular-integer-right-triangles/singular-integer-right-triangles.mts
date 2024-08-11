import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const logger = new CountLogger(n => 10 ** n);

const solve = (upperBound: number) => {
	let numWays = new Map<number, number>();
	for(let leg1 = 1; leg1 + 1 + Math.sqrt(leg1 ** 2 + 1) <= upperBound; leg1 ++) {
		logger.count();
		for(let leg2 = 1; leg2 <= leg1 && leg1 + leg2 + Math.sqrt(leg1 ** 2 + leg2 ** 2) <= upperBound; leg2 ++) {
			const hypotenuse = Math.sqrt(leg1 ** 2 + leg2 ** 2);
			if(hypotenuse % 1 === 0) {
				numWays.set(leg1 + leg2 + hypotenuse, (numWays.get(hypotenuse) ?? 0) + 1);
			}
		}
	}
	return [...numWays].filter(([k, v]) => v === 1).length;
};

console.time();
console.log(solve(100000));
console.timeEnd();
debugger;
