import { fullHeightCastles as wideCastleAlgorithm } from "./wide-castle-algorithm.mjs";
import { fullHeightCastles as tallCastleAlgorithm } from "./tall-castle-algorithm.mjs";
import { fullHeightCastles as squareCastleAlgorithm } from "./square-castle-algorithm.mjs";

const solve = () => {
	const MODULO = 1_000_000_007n;
	const result1 = squareCastleAlgorithm(10_000n, 10_000n, MODULO);
	const result2 = tallCastleAlgorithm(100n, 10n ** 12n, MODULO);
	const result3 = wideCastleAlgorithm(10n ** 12n, 100n, MODULO);
	return (result1 + result2 + result3) % MODULO;
};

// console.time();
// console.log(solve());
// console.timeEnd();
// debugger;
