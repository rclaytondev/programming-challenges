const partitions = (number => {
	if(number < 1) { return []; }
	if(number === 1) { return [[1]]; }
	const ways = [];
	for(const array of Tree.iterate([], function*(array) {
		const sum = array.sum();
		for(let i = array[array.length - 1] ?? 1; i + sum <= number && i <= number; i ++) {
			yield [...array, i];
		}
	})) {
		if(array.sum() === number) { ways.push(array); }
	}
	return ways;
}).memoize(true);

const injectiveFunctions = (arr1, arr2) => {
	
};
const transitionProbability = (state1, state2) => {
	if(state2.length > state1.length) { return 0; }
	for(const f of injectiveFunctions(state1, state2)) {

	}
};
const expectedSteps = (tupleSize) => {
	const states = partitions(tupleSize);
	const transitionProbabilities = new Map();
	for(const state of states) {
		transitionProbabilities.set(state, new Map());
	}
	for(const state1 of states) {
		for(const state2 of states) {
			transitionProbabilities.get(state1).set(state2, transitionProbability(state1, state2));
		}
	}
	const equations = [];
	for(const [i, state] of states.entries()) {
		const terms = [];
		for(const [j, nextState] of states.entries()) {
			terms.push(new LinearAlgebraTerm(transitionProbabilities.get(state).get(nextState)), `x${j}`);
		}
		const equation = new LinearEquation(
			new LinearExpression([new LinearAlgebraTerm(1, `x${i}`)]),
			new LinearExpression(terms)
		);
		equations.push(equation);
	}
	const system = new LinearEquationSystem(equations);
	const solution = system.solve();
	return solution[`x${states.length - 1}`];
};

testing.addUnit("transitionProbability()", transitionProbability, [
	[[1, 1], [2], 1/2],
	[[1, 1, 1], [3], 1/9],
	[[1, 1, 1], [1, 2], 2/3],
	[[1, 1, 1], [1, 1, 1], 2/9]
]);
testing.addUnit("expectedSteps()", expectedSteps, [
	[3, 27/7],
	[5, 468125/60701]
]);
