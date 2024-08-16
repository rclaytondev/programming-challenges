import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const getCounts = <T,>(array: T[]) => {
	const counts = new Map<T, number>();
	for(const value of array) {
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	return counts;
};

const mapEquals = <K, V>(map1: Map<K, V>, map2: Map<K, V>) => {
	if(map1.size !== map2.size) { return false; }
	for(const [key, value] of map1) {
		if(value !== map2.get(key)) {
			return false;
		}
	}
	return true;
};

const arePermutations = <T,>(array1: T[], array2: T[]) => {
	return mapEquals(getCounts(array1), getCounts(array2));
};

const solve = (upperBound: number) => Utils.minValue(
	Utils.range(1, upperBound, "exclusive", "exclusive")
		.filter(n => arePermutations(MathUtils.digits(n), MathUtils.digits(MathUtils.totient(n)))),
	n => n / MathUtils.totient(n)
);

// console.time();
// console.log(solve(10 ** 7));
// console.timeEnd();
// debugger;
