function Test(config) {
	this.run = config.run || function() {};
	this.unitTested = config.unitTested || config.unit;
	if(typeof this.unitTested !== "string") {
		if(typeof Test.previousUnitTestAdded === "string") {
			this.unitTested = Test.previousUnitTestAdded;
		}
		else {
			throw new Error("Test must be given a unit or have a previous test to recieve unit name from.");
		}
	}
	else {
		Test.previousUnitTestAdded = this.unitTested;
	}
	this.name = config.name;

	this.result = null; // null, "passed", or "failed"
	this.index = testing.tests.length; // index of test in tests array

	var scripts = document.getElementsByTagName("script");
	this.sourceFilePath = scripts[scripts.length - 1].src;
	this.sourceFile = this.sourceFilePath.substring(this.sourceFilePath.lastIndexOf("/") + 1, this.sourceFilePath.length);
};
Test.prototype.getResultHTML = function getResultHTML() {
	if(this.result !== "passed" && this.result !== "failed") {
		throw new Error("Cannot call getResultHTML() on a test that has not been run yet; must call getResult() first.");
	}
	var element = document.createElement("li").setChildren(
		utils.dom.create("span .test-" + this.result).setText("Test " + (this.index + 1) + " of " + testing.tests.length + " " + this.result),
		utils.dom.create("span").setText(": " + this.unitTested + " - " + this.name)
	);
	if(this.result === "failed") {
		element.addChildren(
			document.createElement("span").setText(". Use "),
			document.createElement("code").setText("testing.runTestByID(" + this.index + ")").set("onclick", "console.log(this.id);"),
			document.createElement("span").setText(" to run this test individually.")
		);
	}
	return element;
};

Function.prototype.method = function method(name, func) {
	this.prototype[name] = func;
	return this;
};
HTMLElement.method("toggleClass", function toggleClass(className) {
	if(this.classList.contains(className)) {
		this.classList.remove(className);
	}
	else {
		this.classList.add(className);
	}
});
HTMLElement.method("setChildren", function setChildren(children) {
	var actualChildren = Array.from(this.childNodes);
	actualChildren.forEach(child => { child.remove(); });
	this.addChildren.apply(this, arguments);
	return this;
});
HTMLElement.method("addChildren", function addChildren(children) {
	if(Array.isArray(children)) {
		children.forEach(child => { this.appendChild(child); } );
	}
	else if(Array.from(arguments).filter(arg => arg != null).length > 0) {
		Array.from(arguments).forEach(child => {
			this.appendChild(child);
		});
	}
	return this;
});
HTMLElement.method("setText", function setText(text) {
	this.innerHTML = text;
	return this;
});
Object.method("set", function set(key, value) {
	this[key] = value;
	return this;
});
Object.method("equals", function equals(obj) {
	if(typeof this !== "object" || (typeof obj !== "object" || obj === null)) {
		return this === obj;
	}
	if(Object.keys(this).length !== Object.keys(obj).length) {
		return false;
	}
    for(var i in this) {
        var prop1 = this[i];
        var prop2 = obj[i];
        var type1 = Object.typeof(prop1);
        var type2 = Object.typeof(prop2);
        if(type1 !== type2) {
            return false;
        }
        else if(type1 === "object" || type1 === "array" || type1 === "instance") {
            if(!prop1.equals(prop2)) {
                return false;
            }
        }
        else if(prop1 !== prop2) {
            return false;
        }
    }
    return true;
});
Object.typeof = function(value) {
	/*
	This function serves to determine the type of a variable better than the default "typeof" operator, which returns strange values for some inputs (see special cases below).
	*/
	if(value !== value) {
		return "NaN"; // fix for (typeof NaN === "number")
	}
	else if(value === null) {
		return "null"; // fix for (typeof null === "object")
	}
	else if(Array.isArray(value)) {
		return "array"; // fix for (typeof [] === "object")
	}
	else if(typeof value === "object" && Object.getPrototypeOf(value) !== Object.prototype) {
		return "instance"; // return "instance" for instances of a custom class
	}
	else {
		return typeof value;
	}
};

var testing = {
	assert: function(value, errorMsg) {
		if(!value) {
			throw new Error(errorMsg || "Assertion failed. Expected '" + value + "' to be truthy, but it was not.");
		}
	},
	refute: function(value) {
		if(value) {
			throw new Error("Assertion failed. Expected '" + value + "' to be falsy, but it was not.");
		}
	},
	assertEqual: function(value1, value2) {
		if(value1 !== value2) {
			throw new Error("Assertion failed. Expected '" + value1 + "' to be equal to '" + value2 + "', but it was not.");
		}
	},
	assertEqualApprox: function(value1, value2) {
		if(Object.typeof(value1) !== "number" || Object.typeof(value2) !== "number") {
			throw new Error("arguments to assertEqualApprox() must be numbers. values of '" + value1 + "' or '" + value2 + "' are invalid.");
		}
		const MAXIMUM_DISTANCE = Math.pow(10, -12);
		if(Math.dist(value1, value2) > MAXIMUM_DISTANCE) {
			throw new Error("assertion failed. expected " + value1 + " to be at least approximately equal to " + value2);
		}
	},
	assertEquivalent: function(value1, value2) {
		if((typeof value1 === "object" && value1 !== null) && (typeof value2 === "object" && value2 !== null) && typeof value1.equals === "function") {
			testing.assert(value1.equals(value2));
		}
		else {
			testing.assert(value1 === value2);
		}
	},
	assertThrows: function(callback, expectedMsg) {
		let error;
		try {
			callback();
		}
		catch(e) {
			error = e;
		}
		if(!error) {
			throw new Error(`Assertion failed. Expected ${callback.name} to throw an error, but it did not`);
		}
		if(typeof expectedMsg === "string" && expectedMsg.length !== 0) {
			if(typeof error.message !== "string") {
				throw new Error(`Expected ${callback.name} to throw an error with a message of '${expectedMsg}', but the resulting error had no message.`);
			}
			else if(expectedMsg !== error.message) {
				throw new Error(`Expected ${callback.name} to throw an error with a message of '${expectedMsg}', but the error message was ${error.message} instead.`);
			}
		}
		else if(expectedMsg instanceof RegExp) {
			if(typeof error.message !== "string") {
				throw new Error(`Expected ${callback.name} to throw an error with a message matching '${expectedMsg}', but the resulting error had no message.`);
			}
			else if(!expectedMsg.test(error.message)) {
				throw new Error(`Expected ${callback.name} to throw an error with a message matching '${expectedMsg}', but the error message was ${error.message} instead.`);
			}
		}
	},

	numTests: 0,
	tests: [],
	addTest: function(test) {
		if(test instanceof Test) {
			this.tests.push(test);
		}
		else if(typeof test === "object") {
			this.tests.push(new Test(test));
		}
	},
	addUnit: function() {
		/* See the markdown file for documentation. */
		if(typeof arguments[0] !== "string") {
			throw new Error("First argument (name of unit being tested) must be of type string.");
		}
		if(arguments[1].constructor === Object) {
			/* use properties as test name, values as the tests themselves */
			const [unitName, testFunctions] = arguments;
			Object.entries(testFunctions).forEach(([testName, test]) => {
				testing.addTest({
					run: test,
					unitTested: unitName,
					name: testName
				});
			});
		}
		else if(Array.isArray(arguments[1]) && arguments[1].every(v => typeof v === "function")) {
			/* use the functions in the array as the tests */
			const [unitName, testFunctions] = arguments;
			testFunctions.forEach((func, index) => {
				testing.addTest({
					run: func,
					unitTested: unitName,
					name: `test case ${index + 1}`
				});
			});
		}
		else if(Array.isArray(arguments[1]) && typeof arguments[1][0] === "function" && arguments[1].slice(1).every(Array.isArray)) {
			const [unitName, [functionToTest, ...testCases]] = arguments;
			testing.addUnit(unitName, functionToTest, testCases);
		}
		else if(typeof arguments[1] === "function" && Array.isArray(arguments[2]) && arguments[2].every(Array.isArray)) {
			const [unitName, functionToTest, testCases] = arguments;
			testCases.forEach((testCase, index) => {
				const expectedResult = testCase.lastItem();
				const args = testCase.slice(0, testCase.length - 1);
				let testFunc;
				if(expectedResult === Error || expectedResult instanceof Error) {
					testFunc = () => {
						testing.assertThrows(functionToTest.bind(this, args), expectedResult.message);
					}
				}
				else {
					testFunc = () => {
						const result = functionToTest.apply(this, args);
						expect(result).toEqual(expectedResult);
					};
				}
				testing.addTest({
					run: testFunc,
					unitTested: unitName,
					name: `test case ${index + 1}`
				});
			});
		}
		else if(Array.isArray(arguments[1]) && arguments[1].every(Array.isArray)) {
			const [unitName, testCases] = arguments;
			const lookup = (string) => string.split(".").reduce((a, c) => a == null ? null : a[c], window);
			let functionToTest;
			if(unitName.endsWith("()")) {
				functionToTest = lookup(unitName.substring(0, unitName.length - 2));
			}
			else {
				functionToTest = lookup(unitName);
			}
			if(typeof functionToTest === "function") {
				testing.addUnit(unitName, functionToTest, testCases);
			}
			else {
				throw new Error(`Could not lookup function from unit name '${unitName}'`);
			}
		}
		else {
			throw new Error("Invalid format.");
		}
	},

	testAll: function(showResults = true) {
		this.tests.forEach(test => {
			try {
				test.run();

				test.result = "passed";
			}
			catch(e) {
				test.result = "failed";
			}
		});

		if(showResults) {
			if(this.testsFailed().length !== 0) {
				this.resultFormatter.showResults();
			}
			else {
				console.log("%cAll tests passed!", "color: rgb(0, 192, 64)");
			}
		}
		else {
			if(this.testsFailed().length !== 0) {
				if(this.testsFailed().length === 1) {
					// e.g. "1 test failed (#123)"
					console.log(`%c1 test failed%c (#${this.testsFailed()[0].index})`, "color: red", "color: white");
				}
				else if(this.testsFailed().length <= 3) {
					// e.g. "3 tests failed (#123, #456, #789)"
					console.log(`%c${this.testsFailed().length} tests failed%c (${this.testsFailed().map(t => `#${t.index}`).join(", ")})`, "color: red", "color: white");
				}
				else {
					// e.g. "5 tests failed (#123, #456, #789, and 2 others)"
					console.log(`%c${this.testsFailed().length} tests failed%c (${this.testsFailed().slice(0, 3).map(t => `#${t.index}`).join(", ")}, and ${this.testsFailed().length - 3} ${this.testsFailed().length === 4 ? "other" : "others"})`, "color: red", "color: white");
				}
			}
			else {
				console.log("%cAll tests passed!", "color: rgb(0, 192, 64)");
			}
		}
	},
	runTestByID: function(id) {
		var test = this.tests[id];
		test.run();

		var text = "%cTest passed: %c" + test.unitTested + " - " + test.name;
		console.log(text, "color: rgb(0, 192, 64)", "color: white;");
	},
	runTestByName: function(name) {
		let test = this.tests.find(t => t.name === name);
		if(test) {
			this.runTestByID(test.index);
		}
		else {
			test = this.tests.find(t => `${t.unitTested} - ${t.name}` === name);
			if(test) {
				this.runTestByID(test.index);
			}
			else {
				throw new Error(`No test found matching name '${name}'.`);
			}
		}
	},
	testUnit: function(unitName) {
		const tests = this.tests.filter(t => t.unitTested === unitName);
		if(tests.length === 0) {
			throw new Error(`No tests with a unit name of ${unitName} were found.`);
		}
		tests.forEach(test => {
			try {
				test.run();

				test.result = "passed";
			}
			catch(e) {
				test.result = "failed";
			}
		});
		const testsFailed = tests.filter(t => t.result === "failed");
		if(testsFailed.length !== 0) {
			if(testsFailed.length === 1) {
				// e.g. "1 test failed (#123)"
				console.log(`%c1 test failed%c (#${testsFailed[0].index}) in unit ${unitName}`, "color: red", "color: white");
			}
			else if(testsFailed.length <= 3) {
				// e.g. "3 tests failed (#123, #456, #789)"
				console.log(`%c${testsFailed.length} tests failed%c (${testsFailed.map(t => `#${t.index}`).join(", ")}) in unit ${unitName}`, "color: red", "color: white");
			}
			else {
				// e.g. "5 tests failed (#123, #456, #789, and 2 others)"
				console.log(`%c${testsFailed.length} tests failed%c (${testsFailed.slice(0, 3).map(t => `#${t.index}`).join(", ")}, and ${this.testsFailed().length - 3} ${this.testsFailed().length === 4 ? "other" : "others"}) in unit ${unitName}`, "color: red", "color: white");
			}
		}
		else {
			console.log(`%cAll tests passed %cin unit ${unitName}`, "color: rgb(0, 192, 64)", "color: white");
		}
	},

	testsFailed: function() {
		return this.tests.filter(function(test) { return test.result === "failed"; });
	},
	testsPassed: function() {
		return this.tests.filter(function(test) { return test.result === "passed"; });
	},

	resultFormatter: {
		htmlOpener: {
			open: function(html) {
				var tab = window.open("");
				tab.document.head = html.head;
				tab.document.body = html.body;
			},

			createDefaultHTML: function() {
				var html = document.createElement("html").setChildren(
					document.createElement("head"),
					document.createElement("body"),
				);
				html.head = html.querySelector("head");
				html.body = html.querySelector("body");
				return html;
			}
		},

		generateTestResultHTML: function() {
			/* generate content */
			var html = this.htmlOpener.createDefaultHTML();
			var head = html.childNodes[0], body = html.childNodes[1];
			body.setChildren(
				document.createElement("h1").setText("Test Results Summary"),

				((testing.testsFailed().length === 0)
					? utils.dom.create("p.test-passed").setText("All Tests Passed!")
					: utils.dom.create("p").setText(testing.testsPassed().length + " out of " + testing.tests.length + " tests passed. [" + (Math.round(testing.testsPassed().length / testing.tests.length * 100)) + "%]. Tests failed: ")
				),

				...testing.testsFailed().map(test => test.getResultHTML()),

				document.createElement("h1").setText("Test Results Details"),

				...(function() {
					var results = [];
					testing.tests.forEach((test, index) => {
						if(index === 0 || testing.tests[index - 1].sourceFile !== test.sourceFile) {
							/* add a heading for this file */
							results.push(document.createElement("h2").setText(test.sourceFile));
						}
						if(index === 0 || testing.tests[index - 1].unitTested !== test.unitTested) {
							/* add a heading for this unit */
							results.push(document.createElement("h3").setText(test.unitTested));
						}
						results.push(test.getResultHTML());
					});
					return results;
				}) ()
			);
			html.appendChild(document.createElement("title").setText("Unit Test Results"));
			return html;
		},
		styleResultHTML: function(html) {
			var body = html.childNodes[1];
			var css = `
				body {
					margin: 25px;
					background-color: rgb(230, 230, 230);
					color: rgb(59, 67, 70);
					font-family: cursive;
					font-weight: 900;
				}
				h1, h2, h3, h4, h5, h6 {
					font-family: monospace;
				}
				h1 {
					padding: 10px 20px;
					border: 3px solid grey;
				}
				li {
					margin-left: 10px;
				}
				code {
					font-family: monospace;
				}
				.test-failed {
					color: red;
				}
				.test-passed {
					color: green;
				}
				code {
					user-select: all;
				}
			`;
			body.appendChild(document.createElement("style").setText(css));
			return html;
		},
		showResults: function() {
			var html = this.generateTestResultHTML();
			html = this.styleResultHTML(html);
			this.htmlOpener.open(html);
		}
	}
};





const expect = function() {
	const expectArgs = [...arguments];
	const [value] = arguments;
	if(!arguments.length) {
		throw new Error("expect() cannot be called without arguments.");
	}
	const equals = (v1, v2) => (
		// used for expect(...).toEqual(...) and expect(...).toNotEqual(...)
		v1 === v2 ||
		(Number.isNaN(v1) && Number.isNaN(v2)) ||
		(typeof v1 === "object" && v1 !== null && typeof v2 === "object" && v1.equals(v2)) ||

		(typeof v1 === "number" && typeof v2 === "bigint" && Number(v2) === v1) ||
		(typeof v2 === "number" && typeof v1 === "bigint" && Number(v1) === v2)
	);
	const strictlyEquals = (v1, v2) => ((v1 === v2) || (Number.isNaN(v1) && Number.isNaN(v2)));
	const isNumeric = (value) => (typeof value === "number" || typeof value === "bigint") && !Number.isNaN(value);
	return {
		/*
		Note to self: if the functions below contain multiple assertions, they should be in this order:
		- Assertions about the number of arguments (which should always be present if the function takes >=1 argument)
		- Assertions about the type of the value passed to `expect`
		- Assertions about the type of the value passed to the `to...` method
		- Assertions about the content
		(The order doesn't really matter, of course, but it's nice to be consistent.)
		*/

		toEqual: function(valueToEqual) {
			if(!arguments.length) {
				throw new Error("expect(value).toEqual(value) should be called with one argument; instead recieved no arguments.");
			}
			testing.assert(
				equals(value, valueToEqual),
				`Expected value of '${valueToEqual}' did not equal actual value of '${value}'`
			);
		},
		toStrictlyEqual: function(valueToEqual) {
			if(!arguments.length) {
				throw new Error("expect(value).toStrictlyEqual(value) should be called with one argument; instead recieved no arguments.");
			}
			testing.assert(
				strictlyEquals(value, valueToEqual),
				`Expected value of '${valueToEqual}' did not strictly equal actual value of '${value}'.`
			);
		},
		toNotEqual: function(valueToNotEqual) {
			if(!arguments.length) {
				throw new Error("expect(value).toNotEqual(value) should be called with one argument; instead recieved no arguments.");
			}
			testing.assert(
				!equals(value, valueToNotEqual),
				`Expected value of '${valueToNotEqual}' did not equal actual value of '${value}'`
			);
		},
		toNotStrictlyEqual: function(valueToNotEqual) {
			if(!arguments.length) {
				throw new Error("expect(value).toStrictlyEqual(value) should be called with one argument; instead recieved no arguments.");
			}
			testing.assert(
				!strictlyEquals(value, valueToEqual),
				`Expected value of '${valueToEqual}' did not strictly equal actual value of '${value}'.`
			);
		},

		toBeTrue: function() {
			testing.assert(
				value === true,
				`Expected the value to be true, but the actual value was '${value}'.`
			);
		},
		toBeFalse: function() {
			testing.assert(
				value === false,
				`Expected the value to be false, but the actual value was '${value}'.`
			);
		},
		toBeTruthy: function() {
			testing.assert(
				value,
				`Expected the value to be truthy, but the actual value was '${value}'.`
			);
		},
		toBeFalsy: function() {
			testing.assert(
				!value,
				`Expected the value to be falsy, but the actual value was '${value}'.`
			);
		},

		toThrow: function() {
			const func = value;
			const args = expectArgs.slice(1);
			if(typeof func !== "function") {
				throw new Error(`Usage: 'expect(func).toThrow();'. The provided value (${value}) was not a function.`);
			}

			let threwError = false;
			try {
				func(...args);
			}
			catch(e) {
				threwError = true;
			}
			testing.assert(threwError, `Expected function '${func.name}' to throw an error.`)
		},

		toBeNumeric: function() {
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be numeric.`
			);
		},
		toBeAnObject: function() {
			testing.assert(
				typeof value === "object" && value !== null,
				`Expected ${value} to be an object.`
			);
		},
		toBeAnArray: function() {
			testing.assert(
				Array.isArray(value),
				`Expected ${value} to be an array.`
			);
		},

		toBePositive: function() {
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a positive number, but it was non-numeric.`
			);
			testing.assert(
				value > 0,
				`Expected ${value} to be a positive number.`
			);
		},
		toBeNegative: function() {
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a negative number, but it was non-numeric.`
			);
			testing.assert(
				value < 0,
				`Expected ${value} to be a negative number.`
			);
		},
		toBeAnInteger: function() {
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be an integer, but it was non-numeric.`
			);
			testing.assert(
				typeof value === "bigint" || Math.round(value) === value,
				`Expected ${value} to be an integer.`
			);
		},
		toBeBetween: function(min, max) {
			testing.assert(
				arguments.length === 2,
				`expect(value).toBeBetween(min, max) should be called with exactly two arguments.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a number.`
			);
			testing.assert(
				isNumeric(min) && isNumeric(max),
				`expect(value).toBeBetween(min, max) should be called with two numeric arguments.`
			);
			testing.assert(
				max > min,
				`expect(value).toBeBetween(min, max) should be called with two arguments such that max > min.`
			);
			testing.assert(
				min <= value && value <= max,
				`Expected ${value} to be between ${min} and ${max}.`
			);
		},
		toBeStrictlyBetween: function(min, max) {
			testing.assert(
				arguments.length === 2,
				`expect(value).toBeStrictlyBetween(min, max) should be called with exactly two arguments.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a number.`
			);
			testing.assert(
				isNumeric(min) && isNumeric(max),
				`expect(value).toBeStrictlyBetween(min, max) should be called with two numeric arguments.`
			);
			testing.assert(
				max > min,
				`expect(value).toBeStrictlyBetween(min, max) should be called with two arguments such that max > min.`
			);
			testing.assert(
				min < value && value < max,
				`Expected ${value} to be strictly between ${min} and ${max}.`
			);
		},
		toApproximatelyEqual: function(num) {
			testing.assert(
				arguments.length === 1,
				`expect(value).toApproximatelyEqual(value) should be called with exactly one argument.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to approximately equal ${num}, but the value was non-numeric.`
			);
			testing.assert(
				isNumeric(num),
				`expect(value).toApproximatelyEqual(value) should be called with a numeric argument.`
			);
			testing.assert(
				Math.abs(value - num) < 1e-15,
				`Expected ${value} to be extremely close to ${num}.`
			);
		},
		toBeGreaterThan: function(num) {
			testing.assert(
				arguments.length === 1,
				`expect(value).toBeGreaterThan(value) should be called with exactly one argument.`
			);
			testing.assert(
				isNumeric(num),
				`expect(value).toBeGreaterThan(value) should be called with a numeric argument.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a number greater than ${num}, but the value was non-numeric.`
			);
			testing.assert(
				value > num,
				`Expected ${value} to be greater than ${num}.`
			);
		},
		toBeLessThan: function(num) {
			testing.assert(
				arguments.length === 1,
				`expect(value).toBeLessThan(value) should be called with exactly one argument.`
			);
			testing.assert(
				isNumeric(num),
				`expect(value).toBeLessThan(value) should be called with a numeric argument.`
			);
			testing.assert(
				isNumeric(value),
				`Expected ${value} to be a number less than ${num}, but the value was non-numeric.`
			);
			testing.assert(
				value < num,
				`Expected ${value} to be greater than ${num}.`
			);
		},

		toHaveProperties: function(...properties) {
			testing.assert(
				properties.every(prop => typeof prop === "string"),
				`expect(value).toHaveProperties() should be called with string arguments.`
			);

			properties.forEach(prop => {
				testing.assert(
					value.hasOwnProperty(prop),
					`Expected ${value} to have the property '${prop}'.`
				);
			});
		},
		toOnlyHaveProperties: function(...properties) {
			testing.assert(
				properties.every(prop => typeof prop === "string"),
				`expect(value).toHaveProperties() should be called with string arguments.`
			);

			properties.forEach(prop => {
				testing.assert(
					value.hasOwnProperty(prop),
					`Expected ${value} to have the property '${prop}'.`
				);
			});
			Object.keys(value).forEach(prop => {
				testing.assert(
					properties.includes(prop),
					`${value} had the extra property ${prop} (with value of ${value[prop]}).`
				);
			});
		},
		toInstantiate: function(constructor) {
			testing.assert(
				value instanceof constructor,
				`Expected ${value} to be an instance of ${constructor}.`
			);
		},
		toDirectlyInstantiate: function(constructor) {
			testing.assert(
				value.constructor === constructor,
				`Expected ${value} to be an instance of ${constructor}.`
			);
		}
	};
};

testing.addUnit("expect()", {
	"toEqual() works for primitives": () => {
		expect(123).toEqual(123);
		expect(123n).toEqual(123n);
		expect(123n).toEqual(123);
		expect(123).toEqual(123n);
		expect("abc").toEqual("abc");
		expect(true).toEqual(true);
		expect(false).toEqual(false);
		expect(null).toEqual(null);
		expect(undefined).toEqual(undefined);
		expect(NaN).toEqual(NaN);
		testing.assertThrows(() => {
			expect(1).toEqual(2);
		});
		testing.assertThrows(() => {
			expect(1).toEqual("abc");
		});
		testing.assertThrows(() => {
			expect(undefined).toEqual();
		});
	},
	"toEqual() works for objects": () => {
		expect({}).toEqual({});
		expect([]).toEqual([]);
		class Foo {
			constructor(prop) {
				this.prop = prop;
			}
		}
		expect(new Foo(123)).toEqual(new Foo(123));

		testing.assertThrows(() => {
			expect(new Foo(123).toEqual(new Foo(124)));
		});
		testing.assertThrows(() => {
			expect(new Foo(123).toEqual({ prop: 123 }));
		});
		testing.assertThrows(() => {
			expect([1]).toEqual([2]);
		});
		testing.assertThrows(() => {
			expect([1, 2, 3]).toEqual(4);
		});
		testing.assertThrows(() => {
			expect(4).toEqual([1, 2, 3]);
		});
	},
	"toStrictlyEqual() works for primitives": () => {
		expect(1).toStrictlyEqual(1);
		expect("abc").toStrictlyEqual("abc");
		expect(true).toStrictlyEqual(true);
		expect(false).toStrictlyEqual(false);
		expect(null).toStrictlyEqual(null);
		expect(undefined).toStrictlyEqual(undefined);
		expect(NaN).toStrictlyEqual(NaN);
		testing.assertThrows(() => {
			expect(1).toStrictlyEqual(2);
		});
		testing.assertThrows(() => {
			expect(1).toStrictlyEqual("abc");
		});
		testing.assertThrows(() => {
			expect(undefined).toStrictlyEqual();
		});
	},
	"toStrictlyEqual() works for objects": () => {
		const obj = {};
		expect(obj).toStrictlyEqual(obj);
		const arr = [];
		expect(arr).toStrictlyEqual(arr);
		class MyClass {
			constructor(prop) {
				this.prop = prop;
			}
		};
		const myInstance = new MyClass("foo");
		expect(myInstance).toStrictlyEqual(myInstance)


		testing.assertThrows(() => {
			expect({}).toStrictlyEqual({});
		});
		testing.assertThrows(() => {
			expect({ prop: 1 }).toStrictlyEqual({ prop: 1 });
		});
		testing.assertThrows(() => {
			expect([]).toStrictlyEqual([]);
		});
		testing.assertThrows(() => {
			expect([1, 2, 3]).toStrictlyEqual([1, 2, 3]);
		});
		testing.assertThrows(() => {
			expect(new MyClass("foo")).toStrictlyEqual(new MyClass("foo"));
		});
	},
	"toNotEqual() works for primitives": () => {
		testing.assertThrows(() => {
			expect(123).toNotEqual(123);
		});
		testing.assertThrows(() => {
			expect(123n).toNotEqual(123n);
		});
		testing.assertThrows(() => {
			expect(123n).toNotEqual(123);
		});
		testing.assertThrows(() => {
			expect(123).toNotEqual(123n);
		});
		testing.assertThrows(() => {
			expect("abc").toNotEqual("abc");
		});
		testing.assertThrows(() => {
			expect(true).toNotEqual(true);
		});
		testing.assertThrows(() => {
			expect(false).toNotEqual(false);
		});
		testing.assertThrows(() => {
			expect(null).toNotEqual(null);
		});
		testing.assertThrows(() => {
			expect(undefined).toNotEqual(undefined);
		});
		testing.assertThrows(() => {
			expect(NaN).toNotEqual(NaN);
		});
		expect(1).toNotEqual(2);
		expect(1).toNotEqual("abc");
		testing.assertThrows(() => {
			expect(undefined).toNotEqual();
		});
	},
	"toBeTrue() works": () => {
		expect(true).toBeTrue();


		testing.assertThrows(() => {
			expect(false).toBeTrue();
		});
		testing.assertThrows(() => {
			expect(123).toBeTrue();
		});
		testing.assertThrows(() => {
			expect({ prop: 123 }).toBeTrue();
		});
	},
	"toBeFalse() works": () => {
		expect(false).toBeFalse();


		testing.assertThrows(() => {
			expect(true).toBeFalse();
		});
		testing.assertThrows(() => {
			expect(0).toBeFalse();
		});
		testing.assertThrows(() => {
			expect({ prop: 123 }).toBeFalse();
		});
	},
	"toBeTruthy() works": () => {
		expect(true).toBeTruthy();
		expect(123).toBeTruthy();
		expect("abc").toBeTruthy();

		testing.assertThrows(() => {
			expect(false).toBeTruthy();
		});
		testing.assertThrows(() => {
			expect(0).toBeTruthy();
		});
		testing.assertThrows(() => {
			expect("").toBeTruthy();
		});
	},
	"toBeFalsy() works": () => {
		expect(false).toBeFalsy();
		expect(0).toBeFalsy();
		expect("").toBeFalsy();

		testing.assertThrows(() => {
			expect(true).toBeFalsy();
		});
		testing.assertThrows(() => {
			expect(123).toBeFalsy();
		});
		testing.assertThrows(() => {
			expect("abc").toBeFalsy();
		});
	},
	"toThrow() works": () => {
		const foo = (arg) => {
			if(arg !== 123) {
				throw new Error("Uh-oh, something went wrong!");
			}
		}

		// foo throws an error when the argument is not 123, as seen above
		expect(foo).toThrow();
		expect(foo, 456).toThrow();
		expect(foo.bind(null, 456)).toThrow();

		testing.assertThrows(() => {
			// here, foo should be called with 123 as a parameter, so no error should be thrown.
			expect(foo, 123).toThrow();
		});
		testing.assertThrows(() => {
			// here also, foo should be called with 123 as a parameter, so no error should be thrown.
			expect(foo.bind(null, 123)).toThrow();
		});
	},
	"toBeNumeric() works": () => {
		expect(1).toBeNumeric();
		expect(-1.23).toBeNumeric();
		expect(123n).toBeNumeric();

		testing.assertThrows(() => {
			expect("abc").toBeNumeric();
		});
		testing.assertThrows(() => {
			expect(NaN).toBeNumeric();
		});
	},
	"toBeAnObject() works": () => {
		expect({}).toBeAnObject();
		expect({ x: 1 }).toBeAnObject();
		expect([]).toBeAnObject();
		class Foo { constructor() {} }
		expect(new Foo()).toBeAnObject();


		testing.assertThrows(() => {
			expect(123).toBeAnObject();
		});
		testing.assertThrows(() => {
			expect("abc").toBeAnObject();
		});
		testing.assertThrows(() => {
			expect(null).toBeAnObject();
		});
	},
	"toBeAnArray() works": () => {
		expect([]).toBeAnArray();
		expect([1, 2, 3]).toBeAnArray();

		testing.assertThrows(() => {
			expect(123).toBeAnArray();
		});
		testing.assertThrows(() => {
			expect({}).toBeAnArray();
		});
	},
	"toBePositive() works": () => {
		expect(123).toBePositive();

		testing.assertThrows(() => {
			expect(-1).toBePositive();
		});
		testing.assertThrows(() => {
			expect(0).toBePositive();
		});
		testing.assertThrows(() => {
			expect("abc").toBePositive();
		});
	},
	"toBeNegative() works": () => {
		expect(-123).toBeNegative();

		testing.assertThrows(() => {
			expect(1).toBeNegative();
		});
		testing.assertThrows(() => {
			expect(0).toBeNegative();
		});
		testing.assertThrows(() => {
			expect("abc").toBeNegative();
		});
	},
	"toBeAnInteger() works": () => {
		expect(123).toBeAnInteger();
		expect(123n).toBeAnInteger();

		testing.assertThrows(() => {
			expect(1.23).toBeAnInteger();
		});
		testing.assertThrows(() => {
			expect("abc").toBeAnInteger();
		});
	},
	"toBeBetween() works": () => {
		expect(123).toBeBetween(100, 200);
		expect(123n).toBeBetween(100, 200);
		expect(123).toBeBetween(100n, 200n);
		expect(123n).toBeBetween(100n, 200n);

		expect(123).toBeBetween(123, 456);
		expect(123).toBeBetween(0, 123);

		testing.assertThrows(() => {
			expect(123).toBeBetween(50, 60);
		});
		testing.assertThrows(() => {
			expect(123n).toBeBetween(50, 60);
		});
	},
	"toBeStrictlyBetween() works": () => {
		expect(123).toBeStrictlyBetween(100, 200);
		expect(123n).toBeStrictlyBetween(100, 200);
		expect(123).toBeStrictlyBetween(100n, 200n);
		expect(123n).toBeStrictlyBetween(100n, 200n);

		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(123, 456);
		});
		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(0, 123);
		});

		testing.assertThrows(() => {
			expect(123).toBeStrictlyBetween(50, 60);
		});
		testing.assertThrows(() => {
			expect(123n).toBeStrictlyBetween(50, 60);
		});
	},
	"toBeGreaterThan() works": () => {
		expect(1).toBeGreaterThan(0);

		testing.assertThrows(() => {
			expect(1).toBeGreaterThan(2);
		});
		testing.assertThrows(() => {
			expect("abc").toBeGreaterThan(2);
		});
		testing.assertThrows(() => {
			expect(1).toBeGreaterThan("abc");
		});
	},
	"toApproximatelyEqual() works": () => {
		expect(0.1 + 0.2).toApproximatelyEqual(0.3);
		expect(0.3 - 0.1).toApproximatelyEqual(0.2);

		testing.assertThrows(() => {
			expect(2).toApproximatelyEqual(3);
		});
		testing.assertThrows(() => {
			expect(0.1 + 0.2 + 4e-14).toApproximatelyEqual(0.3);
		});
	},
	"toHaveProperties() works": () => {
		expect({ x: 1 }).toHaveProperties("x");
		expect({ x: 1, y: 1 }).toHaveProperties("x", "y");
		expect({ x: 1, y: 1, z: 1 }).toHaveProperties("x", "y");

		testing.assertThrows(() => {
			expect({ x: 1 }).toHaveProperties("y");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toHaveProperties("x", "y", "z");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toHaveProperties("x", "y", "z");
		});
	},
	"toOnlyHaveProperties() works": () => {
		expect({ x: 1 }).toOnlyHaveProperties("x");
		expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y");

		testing.assertThrows(() => {
			expect({ x: 1, y: 1, z: 1 }).toOnlyHaveProperties("x", "y");
		});
		testing.assertThrows(() => {
			expect({ x: 1 }).toOnlyHaveProperties("y");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y", "z");
		});
		testing.assertThrows(() => {
			expect({ x: 1, y: 1 }).toOnlyHaveProperties("x", "y", "z");
		});
	},
	"toInstantiate() works": () => {
		expect({}).toInstantiate(Object);
		expect([]).toInstantiate(Array);
		expect([]).toInstantiate(Object);
		class Foo { constructor() {} };
		expect(new Foo()).toInstantiate(Foo);
		expect(new Foo()).toInstantiate(Object);

		testing.assertThrows(() => {
			expect([]).toInstantiate(Foo);
		});
		testing.assertThrows(() => {
			expect({}).toInstantiate(Array);
		});
	},
	"toDirectlyInstantiate": () => {
		expect({}).toDirectlyInstantiate(Object);
		expect([]).toDirectlyInstantiate(Array);
		class Foo { constructor() {} };
		expect(new Foo()).toDirectlyInstantiate(Foo);

		testing.assertThrows(() => {
			expect(new Foo()).toDirectlyInstantiate(Object);
		});
		testing.assertThrows(() => {
			expect([]).toDirectlyInstantiate(Object);
		});

		testing.assertThrows(() => {
			expect([]).toDirectlyInstantiate(Foo);
		});
		testing.assertThrows(() => {
			expect({}).toDirectlyInstantiate(Array);
		});
	}
});

// testing.testUnit("expect()");
// testing.runTestByID(18);
