import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const allSums = (numbers: number[]) => {
	const sums = new Set<number>();
	for(const num1 of numbers) {
		for(const num2 of numbers) {
			sums.add(num1 + num2);
		}
	}
	return sums;
};

export const numMultiplications = (exponent: number) => {
	if(exponent === 1) { return 0; }
	console.log(exponent);
	let powerCombinations = new HashSet([[1]]);
	while(true) {
		const nextPowers = new HashSet<number[]>();
		for(const powers of powerCombinations) {
			for(const newPower of [...allSums(powers)].filter(v => !powers.includes(v))) {
				nextPowers.add([...powers, newPower]);
				if(newPower === exponent) {
					return powers.length;
				}
			}
		}
		powerCombinations = nextPowers;
	}
};

console.time();
console.log(MathUtils.sum(Utils.range(1, 200).map(numMultiplications)));
console.timeEnd();
debugger;
