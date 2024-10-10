import { HashSet } from "../../utils-ts/modules/HashSet.mjs";

export const maxSquareRemainder = (a: number) => {
	let max = -Infinity;
	const pairsChecked = new HashSet<[number, number]>();
	for(let power = 0; true; power ++) {
		if(pairsChecked.has([(a - 1) ** power, (a + 1) ** power])) {
			return max;
		}
		const value = ((a - 1) ** power + (a + 1) ** power) % (a ** 2);
		if(value > max) {
			max = value;
		}
		pairsChecked.add([(a - 1) ** power, (a + 1) ** power]);
	}
};
