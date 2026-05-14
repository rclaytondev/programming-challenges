import { DiophantineEquation } from "./diophantine-solver.mjs";

export const solutions = function*() {
	const equation = new DiophantineEquation(
		2,
		(b) => 2n * b * (b - 1n),
		(b, s) => s * (s - 1n),
	);
	yield* equation.solutions();
};

// for(const solution of solutions()) {
// 	console.log(solution);
// 	debugger;
// }
