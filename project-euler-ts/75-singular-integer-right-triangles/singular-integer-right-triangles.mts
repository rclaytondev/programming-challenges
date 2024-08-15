import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const logger = new CountLogger(n => 10 ** n);

const solve = (upperBound: number) => {
	const numWays = new Map<number, number>();
	loop1: for(let leg1 = 1; true; leg1 ++) {
		logger.count();
		loop2: for(let leg2 = 1; true; leg2 ++) {
			const hypotenuse = Math.sqrt(leg1 ** 2 + leg2 ** 2);
			const perimeter = leg1 + leg2 + hypotenuse;
			if(perimeter > upperBound && leg2 === 1) {
				break loop1;
			}
			else if(perimeter > upperBound || leg2 > leg1) {
				continue loop1;
			}
			if(hypotenuse % 1 === 0) {
				console.log(`${leg1},${leg2},${hypotenuse}`);
				numWays.set(perimeter, (numWays.get(perimeter) ?? 0) + 1);
			}
		}
	}
	return [...numWays].filter(([k, v]) => v === 1).length;
};

// console.time();
// console.log(solve(1000));
// console.timeEnd();
// debugger;
