let operatorOrders = [];
for(let i = 0; i < factorial(8); i ++) {
	operatorOrders.push(nthPermutation(i, [0, 1, 2, 3, 4, 5, 6, 7]));
}


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

const stringifyExpression = (operators, order, numbers) => {
	/*
	returns an expression in a string for JS to evalulate.
	`operators` is an array of operators (+, -, *, /, or "c" for concatenation) as one-character strings.
	`order` is an array of integers from 0 to `operators.length` representing the order in which they should be evaluated.
	`numbers` are the numbers on which the operators are applied. There should be exactly 1 more number than there are operators.
	*/
	if(!numbers) {
		numbers = [...operators, null].map((v, index) => index + 1);
	}
	if(numbers.length <= 1) {
		return `${numbers[0]}`;
	}
	if(numbers.length <= 2) {
		const operator = operators[0];
		if(operator === "c") {
			return `${numbers[0]}${numbers[1]}`;
		}
		else {
			return `${numbers[0]} ${operator} ${numbers[1]}`;
		}
	}
	else {
		const lastOperator = operators[order.lastItem()];
		let expressionBefore = stringifyExpression(
			operators.slice(0, order.lastItem()),
			(() => {
				const newOrder = makeConsecutive(order.filter(n => n < order.lastItem()));
				return newOrder.map(n => n - newOrder.min());
			}) (),
			numbers.filter((n, index) => index <= order.lastItem())
		);
		const ALL_NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
		expressionBefore = ([...expressionBefore].every(char => ALL_NUMBERS.includes(char))) ? expressionBefore : `(${expressionBefore})`;
		let expressionAfter = stringifyExpression(
			operators.slice(order.lastItem() + 1),
			(() => {
				const newOrder = makeConsecutive(order.filter(n => n > order.lastItem()));
				return newOrder.map(n => n - newOrder.min());
			}) (),
			numbers.filter((n, index) => index > order.lastItem())
		);
		expressionAfter = ([...expressionAfter].every(char => ALL_NUMBERS.includes(char))) ? expressionAfter : `(${expressionAfter})`;
		if(lastOperator === "c") {
			testing.assert([...expressionBefore].every(char => ALL_NUMBERS.inclues(char)));
			testing.assert([...expressionAfter].every(char => ALL_NUMBERS.inclues(char)));
			return `${expressionBefore}${expressionAfter}`;
		}
		else {
			return `${expressionBefore} ${lastOperator} ${expressionAfter}`
		}
	}
};
testing.addUnit("stringifyExpression()", {
	"test case 1": () => {
		const result = stringifyExpression(
			["+", "+", "+", "+", "+", "+", "+", "+"],
			[0, 1, 2, 3, 4, 5, 6, 7]
		);
		expect(result).toEqual("(((((((1 + 2) + 3) + 4) + 5) + 6) + 7) + 8) + 9");
	},
	"test case 2": () => {
		const result = stringifyExpression(
			["/", "/", "/", "/"],
			[0, 1, 2, 3]
		);
		expect(result).toEqual("(((1 / 2) / 3) / 4) / 5");
	},
	"test case 3": () => {
		const result = stringifyExpression(
			["/", "/", "/", "/"],
			[3, 2, 1, 0]
		);
		expect(result).toEqual("1 / (2 / (3 / (4 / 5)))");
	},
	"test case 4": () => {
		const result = stringifyExpression(
			["c", "*", "+", "c"],
			[0, 3, 1, 2]
		);
		expect(result).toEqual("(12 * 3) + 45")
	},
	"test case 5": () => {
		const result = stringifyExpression(
			["/", "/", "/", "+", "/", "/", "/"],
			[0, 1, 2, 6, 5, 4, 3]
		);
		expect(result).toEqual("(((1 / 2) / 3) / 4) + (5 / (6 / (7 / 8)))");
	},
	"test case 6": () => {
		const result = stringifyExpression(
			["/", "/", "/"],
			[0, 1, 2]
		);
		expect(result).toEqual("((1 / 2) / 3) / 4");
	}
});
testing.testUnit("stringifyExpression()");
// testing.runTestByName("stringifyExpression() - test case 1");

console.time("calculating sum of reachable numbers");
const reachableNumbers = {};
let sumOfReachables = 0;
OPERATOR_ORDERS.forEach((operatorCombination, i) => {
	if(i > 0) return;
	operatorOrders.forEach(order => {
		if(isValid(operatorCombination, order)) {
			const expression = stringifyExpression(operatorCombination, order);
			const number = eval(expression);
			console.log(`${expression} = ${number}`);
			if(!reachableNumbers[number]) {
				reachableNumbers[number] = true;
				sumOfReachables += number;
			}
		}
	});
});
console.log(sumOfReachables);
console.timeEnd("calculating sum of reachable numbers");
