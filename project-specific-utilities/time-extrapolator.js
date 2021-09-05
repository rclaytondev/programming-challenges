utils.time = utils.time ?? {};
utils.time.record = (func, numTrials = 1) => {
	/* returns how long (in milliseconds) the function takes to run. */
	const startTime = Date.now();
	for(let i = 0; i < numTrials; i ++) {
		func();
	}
	const endTime = Date.now();
	return (endTime - startTime) / numTrials;
};
utils.time.extrapolate = (algorithm, complexity, variables, inputs, numTrials = 1, dataPointType = "median", timeRecorder = utils.time.record) => {
	/*
	Returns an algebraic expression that predicts how long (in milliseconds) the algorithm will take to run on a given input.
	`algorithm` is the algorithm (function) to be run. The result will be a polynoial predicting how long `algorithm` takes to run.
	`complexity` is the time complexity of the algorithm, WITH COEFFICIENTS (e.g. instead of n^2 it would be "a * n^2 + b * n + c")
	`variables`: which variables in the time complexity are the inputs (as opposed to the parameters -- e.g. if your time complexity was n^2, `complexity` would be "a*n^2 + b*n + c" and `variables` would be ["n"]).
	`inputs`: the inputs (numbers, Vectors or NVectors) on which to run the algorithm.
	`numTrials`: the number of times to run the algorithm for each input.
	`dataPointType`: which data points (i.e. pairs of inputs and runtimes) to store and use for fitting the function.
		- `all`: include all data points from every single time the algorithm is run
		- `average`: for each input, add a data point where the runtime is the average (i.e. mean) of all the runtimes for all the times when the function was run on that input.
		- `median`: for each input, add a data point where the runtime is the median of all the times when the function was run on that input.
	`timeRecorder` is basically just used for testing. It lets you specify an alternate function to use to record runtimes. If you're actually using this function, just use the default value.
	*/
	inputs = inputs.map(value => new NVector(value));
	complexity = (typeof complexity === "string") ? Expression.parse(complexity) : complexity;
	const dataPoints = [];
	for(const input of inputs) {
		if(dataPointType === "all") {
			for(let i = 0; i < numTrials; i ++) {
				const runtime = timeRecorder(() => algorithm(input));
				dataPoints.push(new NVector([...input.numbers, runtime]));
			}
		}
		else if(dataPointType === "average") {
			dataPoints.push(new NVector([
				...input.numbers,
				timeRecorder(() => algorithm(input), numTrials)
			]));
		}
		else if(dataPointType === "median") {
			const runtimes = [];
			for(let i = 0; i < numTrials; i ++) {
				runtimes.push(timeRecorder(() => algorithm(input)));
			}
			const median = runtimes.median();
			dataPoints.push(new Vector([...input.numbers, median]));
		}
	}
	return fitFunction(complexity, dataPoints, variables);
};


testing.addUnit("utils.time.extrapolate()", {
	"can predict the time an O(n) algorithm will take to run": () => {
		let timesCalled = 0;
		const TIMES = [50, 50, 60, 60, 70, 70];
		const timeRecorderFixture = () => {
			timesCalled ++;
			return TIMES[timesCalled - 1];
		}
		const result = utils.time.extrapolate(
			([num]) => num + 1, // function to be run
			"a * n + b", // O(n) time complexity
			["n"], // variables in the time complexity
			[1, 2, 3], // inputs on which to run the function
			2, // number of times to run for each input
			"median", // use the medians as the data points
			timeRecorderFixture // time recorder to remove variability due to hardware variations -- according to this, every algorithm runs in exactly 1 second
		);
		expect(result).toDirectlyInstantiate(Expression);
		/* expected result: 10n + 40 (approximately) */
		const linearExpression = new LinearExpression(result);
		const coefficient = linearExpression.coefficientOf("n");
		const constantTerm = linearExpression.coefficientOf(null);
		testing.assertEqualApprox(coefficient, 10, 1e-3);
		testing.assertEqualApprox(constantTerm, 40, 1e-3);
	}
});
testing.testUnit("utils.time.extrapolate()");
