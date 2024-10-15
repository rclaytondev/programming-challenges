import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { CountLogger } from "../project-specific-utilities/CountLogger.mjs";

const allSums = (numbers: number[]) => {
	const sums = new Set<number>();
	for(const num1 of numbers) {
		for(const num2 of numbers) {
			sums.add(num1 + num2);
		}
	}
	return sums;
};

export const allNumMultiplications = (upperBound: number) => {
	const logger = new CountLogger(n => n);
	let powerCombinations = new HashSet([[1]]);
	const answers = new Map<number, number>();
	answers.set(1, 0);
	while(answers.size < upperBound) {
		logger.count();
		console.log(answers);
		const nextPowers = new HashSet<number[]>();
		for(const powers of powerCombinations) {
			for(const newPower of [...allSums(powers)].filter(v => !powers.includes(v)).filter(v => v <= upperBound)) {
				nextPowers.add([...powers, newPower].sort((a, b) => a - b));
				if(!answers.has(newPower) && newPower >= 1 && newPower <= upperBound) {
					answers.set(newPower, powers.length);
				}
			}
		}
		powerCombinations = nextPowers;
	}
	return answers;
};

// console.time();
// console.log(allNumMultiplications(200));
// console.timeEnd();
// debugger;
