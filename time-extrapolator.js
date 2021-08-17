class PolynomialTerm {
	constructor(coefficient, exponent) {
		this.coefficient = coefficient;
		this.exponent = exponent;
	}

	evaluate(input) {
		return this.coefficient * (input ** this.exponent);
	}
}
class Polynomial {
	constructor(terms) {
		this.terms = terms;
	}

	evaluate(input) {
		let result = 0;
		for(const term of this.terms) {
			result += term.evaluate(input);
		}
		return result;
	}
}

const extrapolateTime = (func, inputs, polynomialDegree, numTrials = 1) => {
	const dataPoints = [];
	for(const input of inputs) {
		const time = timeAlgorithm(func, numTrials);
		dataPoints.push(new Vector(input, time));
	}
	return Polynomial.fitToPoints(polynomialDegree, dataPoints);
};
const timeAlgorithm = (func, numTrials = 1) => {
	/* returns the number of milliseconds the function takes to execute. */
	const start = Date.now();
	for(let i = 0; i < numTrials; i ++) {
		func();
	}
	const end = Date.now();
	return (end - start) / numTrials;
};

const printMessage = (message, numTimes) => {
	for(let i = 0; i < numTimes; i ++) {
		console.log(message);
	}
};

testing.addUnit("PolynomialTerm.evaluate()", {
	"can evaluate the monomial 5x^3 at x=143": () => {
		const term = new PolynomialTerm(5, 3);
		const result = term.evaluate(143);
		expect(result).toEqual(14621035);
	}
});
testing.addUnit("Polynomial.evaluate()", {
	"can evaluate the polynomial x^2 + 5x + 2 at x=10": () => {
		const polynomial = new Polynomial([
			new PolynomialTerm(1, 2),
			new PolynomialTerm(5, 1),
			new PolynomialTerm(2, 0)
		]);
		expect(polynomial.evaluate(10)).toEqual(152);
	}
});
testing.addUnit("extrapolateTime()", {
	"can predict the time for a linear-time algorithm": () => {
		const polynomial = extrapolateTime(
			(num) => printMessage("example message", num),
			[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			1,
			10
		);
		const expectedTime = polynomial.evaluate(100);
		const actualTime = timeAlgorithm(
			() => printMessage("example message", 100),
			10
		);
		expect(expectedTime).toEqual(actualTime);
	}
});
