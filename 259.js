const operatorCombinations = (operators = [], numOperators) => {
	if(operators.length >= numOperators) {
		return [operators];
	}
	else {
		return [
			...operatorCombinations([...operators, "+"], numOperators),
			...operatorCombinations([...operators, "-"], numOperators),
			...operatorCombinations([...operators, "*"], numOperators),
			...operatorCombinations([...operators, "/"], numOperators),
			...operatorCombinations([...operators, "c"], numOperators),
		];
	}
};

testing.addUnit("operatorCombinations()", {
	"works correctly with 1 operator": () => {
		const result = operatorCombinations([], 1);
		expect(result).toEqual([["+"], ["-"], ["*"], ["/"], ["c"]]);
	},
	"works correctly with 2 operators": () => {
		const result = operatorCombinations([], 2);
		expect(result).toEqual([
			["+","+"],
			["+","-"],
			["+","*"],
			["+","/"],
			["+","c"],
			["-","+"],
			["-","-"],
			["-","*"],
			["-","/"],
			["-","c"],
			["*","+"],
			["*","-"],
			["*","*"],
			["*","/"],
			["*","c"],
			["/","+"],
			["/","-"],
			["/","*"],
			["/","/"],
			["/","c"],
			["c","+"],
			["c","-"],
			["c","*"],
			["c","/"],
			["c","c"]
		]);
	}
});
// testing.testUnit("operatorCombinations()");

const isValid = (operators, order) => {
	let foundNotConcatenation = false;
	let valid = true;
	order.forEach(operatorIndex => {
		const operator = operators[operatorIndex];
		if(operator !== "c") { foundNotConcatenation = true; }
		else if(foundNotConcatenation) {
			valid = false;
			return;
		}
	});
	return valid;
};

const makeConsecutive = (numbers) => {
	/*
	makes the array of unique numbers consecutive.
	The smallest number remains unchanged, while the other numbers are replaced with
	e.g. makeConsecutive([5, 10, 20, 2]) would result in [3, 4, 5, 2].
	*/
	const numBelow = num => numbers.count(n => n < num);
	const lowest = numbers.min();
	return numbers.map(num => {
		const numbersBelow = numBelow(num);
		return (numbersBelow === 0) ? num : numbersBelow + lowest;
	});
};

const possibleValues = (operators, numbers) => {
	/* returns every possible value that this expression could evaluate to depending on how parentheses are added. */
	if(operators.length === 0 && numbers.length === 1) {
		return [numbers[0]];
	}
	else if(operators.length === 1 && numbers.length === 2) {
		const [operator] = operators;
		const [num1, num2] = numbers;
		return (
			operator === "+" ? [num1 + num2] :
			operator === "*" ? [num1 * num2] :
			operator === "-" ? [num1 - num2] :
			operator === "/" ? (num2 === 0 ? [] : [num1 / num2]) :
			operator === "c" ? [Number.parseInt(`${num1}${num2}`)] :
			(() => { throw new Error("Unexpected input. Operator must be +, -, *, /, or 'c' for concatenation.") }) ()
		);
	}

	if(operators.every(op => op === "+")) {
		return [numbers.sum()];
	}
	else if(operators.every(op => op === "*")) {
		return [numbers.reduce((a, c) => a * c)];
	}
	else if(operators.every(op => op === "c")) {
		return [Number.parseInt(numbers.reduce((a, c) => `${a}${c}`))];
	}

	const result = new Set();
	operators.forEach((operator, operatorIndex) => {
		const possibleValuesBefore = possibleValues(
			operators.slice(0, operatorIndex),
			numbers.slice(0, operatorIndex + 1)
		);
		const possibleValuesAfter = possibleValues(
			operators.slice(operatorIndex + 1),
			numbers.slice(operatorIndex + 1)
		);
		possibleValuesBefore.forEach(v1 => {
			possibleValuesAfter.forEach(v2 => {
				if(operator === "+") {
					result.add(v1 + v2);
				}
				else if(operator === "-") {
					result.add(v1 - v2);
				}
				else if(operator === "*") {
					result.add(v1 * v2);
				}
				else if(operator === "/" && v2 !== 0) {
					result.add(v1 / v2);
				}
			});
		});
	});
	return [...result];
};
const possibleValidValues = (operators, numbers) => {
	const values = possibleValues(operators, numbers);
	return values.filter(v => v === Math.round(v) && v > 0);
};
testing.addUnit("possibleValues()", {
	"works when all the operators are addition": () => {
		const result = possibleValues(
			["+", "+", "+", "+"],
			[1, 2, 3, 4, 5]
		);
		expect(result).toEqual([15]);
	},
	"works with a combination of addition and subtraction": () => {
		const result = possibleValues(
			["+", "+", "+", "-"],
			[1, 2, 3, 4, 5]
		);
		expect(result).toEqual([5]);
	},
	"works with a combination of addition and division": () => {
		const result = possibleValues(
			["+", "+", "+", "/"],
			[1, 2, 3, 4, 5]
		);
		expect(result).toEqual([
			1 + 2 + 3 + (4/5),
			1 + 2 + ((3 + 4) / 5),
			1 + ((2 + 3 + 4) / 5),
			(1 + 2 + 3 + 4) / 5
		]);
	},
	"works for 'cc/'": () => {
		const result = possibleValues(
			["c", "c", "/"],
			[1, 2, 3, 4]
		);
		expect(result).toEqual([123 / 4]);
	},
	"works for '/cc'": () => {
		const result = possibleValues(
			["/", "c", "c"],
			[1, 2, 3, 4]
		);
		expect(result).toEqual([1 / 234]);
	},
	"works when all the operators are multiplication": () => {
		const result = possibleValues(
			["*", "*", "*", "*"],
			[1, 2, 3, 4, 5]
		);
		expect(result).toEqual([1 * 2 * 3 * 4 * 5]);
	}
});

const formatExpression = (operators, numbers) => {
	let result = `${numbers[0]}`;
	operators.forEach((operator, operatorIndex) => {
		if(operator !== "c") {
			result += ` ${operator} `;
		}
		result += numbers[operatorIndex + 1];
	});
	return result;
};
testing.addUnit("formatExpression()", {
	"works with the four basic operations": () => {
		const result = formatExpression(
			["+", "-", "*", "/"],
			[1, 2, 3, 4, 5]
		);
		expect(result).toEqual("1 + 2 - 3 * 4 / 5");
	},
	"works with concatenation": () => {
		const result = formatExpression(
			["c", "+", "c", "c"],
			[1, 2, 3, 4, 5]
		);
		expect(result).toEqual("12 + 345");
	}
});

const numbersBelow = (numDigits) => (
	new Array(numDigits)
	.fill()
	.map((v, index) => index + 1)
);
testing.addUnit("numbersBelow()", {
	"works for the input 3": () => {
		const result = numbersBelow(3);
		expect(result).toEqual([1, 2, 3]);
	},
	"works for the input 9": () => {
		const result = numbersBelow(9);
		expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	}
});

const sumOfReachables = (numDigits) => {
	console.log(`calculating sum of reachables for ${numDigits} digits`);
	const combinations = operatorCombinations([], numDigits - 1);

	let sum = 0n;
	let reachables = {};
	const allDigits = numbersBelow(numDigits);
	combinations.forEach((operators, i) => {
		const newReachables = possibleValues(operators, allDigits).filter(v => v === Math.round(v) && v > 0);
		newReachables.forEach(number => {
			if(!reachables[number]) {
				console.log(number);
				reachables[number] = true;
				sum += BigInt(number);
			}
		});


		if(i % 100 === 0) {
			console.log(`calculated ${i} combinations out of ${combinations.length}`);
		}
	});
	return sum;
};

testing.addUnit("sumOfReachables()", {
	"gives correct answer for 1 digit": () => {
		const result = sumOfReachables(1);
		expect(result).toEqual(1);
	},
	"gives correct answer for 2 digits": () => {
		const result = sumOfReachables(2);
		const expected = [
			1 + 2,
			1 * 2,
			1 / 2,
			1 - 2,
			12
		].filter(n => n === Math.round(n) && n > 0).uniquify().sum();
		expect(result).toEqual(expected);
	},
	"gives the correct answer for 3 digits": () => {
		const result = sumOfReachables(3);
		const expected = [
			1 + (2 + 3),
			(1 + 2) + 3,
			1 - (2 + 3),
			(1 - 2) + 3,
			1 * (2 + 3),
			(1 * 2) + 3,
			1 / (2 + 3),
			(1 / 2) + 3,
			(12) + 3,
			1 + (2 - 3),
			(1 + 2) - 3,
			1 - (2 - 3),
			(1 - 2) - 3,
			1 * (2 - 3),
			(1 * 2) - 3,
			1 / (2 - 3),
			(1 / 2) - 3,
			(12) - 3,
			1 + (2 * 3),
			(1 + 2) * 3,
			1 - (2 * 3),
			(1 - 2) * 3,
			1 * (2 * 3),
			(1 * 2) * 3,
			1 / (2 * 3),
			(1 / 2) * 3,
			(12) * 3,
			1 + (2 / 3),
			(1 + 2) / 3,
			1 - (2 / 3),
			(1 - 2) / 3,
			1 * (2 / 3),
			(1 * 2) / 3,
			1 / (2 / 3),
			(1 / 2) / 3,
			(12) / 3,
			1 + (23),
			1 - (23),
			1 * (23),
			1 / (23),
			123,
		].filter(n => n === Math.round(n) && n > 0).uniquify().sum();
		expect(result).toEqual(expected);
	}
});
testing.testUnit("sumOfReachables()");


const findAnswer = () => {
	console.time("finding sum of reachables");
	console.log(sumOfReachables(9));
	console.timeEnd("finding sum of reachables");
};
