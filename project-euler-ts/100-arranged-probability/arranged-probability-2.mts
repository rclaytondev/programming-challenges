import { DiophantineEquation } from "./diophantine-solver.mjs";

const solutions = function*() {
	const equation = new DiophantineEquation(
		2,
		(b, s) => 2n * b * (b - 1n),
		(b, s) => s * (s - 1n)
	);
	yield* equation.solutions();
};

for(const solution of solutions()) {
	console.log(solution);
	debugger;
}
