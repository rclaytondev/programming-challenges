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
	assert: function(value) {
		if(!value) {
			throw new Error("Assertion failed. Expected '" + value + "' to be truthy, but it was not.");
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
	assertThrows: function(callback) {
		var threwError = false;
		try {
			callback();
		}
		catch(e) {
			threwError = true;
		}
		if(!threwError) {
			this.error("Assertion failed. Expected " + callback + " to throw an error, but it did not");
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
	addUnit: function(unitName, tests) {
		/*
		Example usage:
		testing.addUnit("ObjectFoo", {
			"verifies that foo() method works correctly": function() {
				// your code here
			}
			"verifies that bar() method works correctly": function() {
				// your code here
			}
		});
		*/
		for(var testName in tests) {
			if(tests.hasOwnProperty(testName)) {
				this.addTest({
					run: tests[testName],
					unit: unitName,
					name: testName
				});
			}
		}
	},

	testAll: function() {
		this.tests.forEach(test => {
			try {
				test.run();

				test.result = "passed";
			}
			catch(e) {
				test.result = "failed";
			}
		});

		if(this.testsFailed().length !== 0) {
			this.resultFormatter.showResults();
		}
		else {
			console.log("%cAll tests passed!", "color: rgb(0, 192, 64)");
		}
	},
	runTestByID: function(id) {
		var test = this.tests[id];
		test.run();

		var text = "%cTest passed: %c" + test.unitTested + " - " + test.name;
		console.log(text, "color: rgb(0, 192, 64)", "color: white;");
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
