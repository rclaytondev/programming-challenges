Function.method(function memoize(stringifyKeys = false, cloneOutput = false) {
	/*
	`stringifyKeys` lets you specify an additional optimization. If set to true, the arguments will be stringified before being set into the map, allowing for constant lookup times.
	However, not all arguments can be stringified without information loss (think of all the "[object Object]"s! Oh no!). If your arguments are like this, then do not use this feature.
	*/
	const map = new Map();
	const func = this;
	Function.prototype.memoize.maps.push(map);
	if(stringifyKeys) {
		return function() {
			const stringified = [...arguments].toString();
			if(map.has(stringified)) {
				const result = map.get(stringified);
				return cloneOutput ? ((typeof result === "object" && result != null) ? result.clone() : result) : result;
			}

			const result = func.apply(this, arguments);
			map.set(stringified, result);
			return result;
		};
	}
	else {
		return function() {
			for(let [key, value] of map.entries()) {
				if([...key].every((val, i) => val === arguments[i])) {
					return cloneOutput ? ((typeof value === "object" && value != null) ? value.clone() : value) : value;;
				}
			}
			const result = func.apply(this, arguments);
			map.set(arguments, result);
			return result;
		};
	}
});
Function.prototype.memoize.maps = [];
Function.prototype.memoize.clear = function() {
	/* clears the cached results in ALL memoized functions. */
	for(const map of Function.prototype.memoize.maps) {
		map.clear();
	}
};
testing.addUnit("Function.memoize()", {
	"works for arguments that can be stringified": () => {
		let timesRun = 0;
		const increment = (num => {
			timesRun ++;
			return num + 1;
		}).memoize(true);

		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(timesRun).toEqual(1);

		expect(increment(2)).toEqual(3);
		expect(increment(2)).toEqual(3);
		expect(increment(2)).toEqual(3);
		expect(timesRun).toEqual(2);
	},
	"works for arguments that cannot be stringified without information loss": () => {
		let timesRun = 0;
		const myFunction = (argument => {
			timesRun ++;
			return argument.foo;
		}).memoize(false);
		let myObject1 = { foo: "bar" };
		let myObject2 = { foo: "qux" };

		expect(myFunction(myObject1)).toEqual("bar");
		expect(myFunction(myObject1)).toEqual("bar");
		expect(myFunction(myObject1)).toEqual("bar");
		expect(timesRun).toEqual(1);

		expect(myFunction(myObject2)).toEqual("qux");
		expect(myFunction(myObject2)).toEqual("qux");
		expect(myFunction(myObject2)).toEqual("qux");
		expect(timesRun).toEqual(2);
	},
	"can return a clone of the output": () => {
		let timesRun = 0;
		const myFunction = (argument => {
			timesRun ++;
			return [argument, argument + 1];
		}).memoize(true, true);

		const result1 = myFunction(1);
		expect(result1).toEqual([1, 2]);
		const result2 = myFunction(1);
		expect(result2).toEqual([1, 2]);
		const result3 = myFunction(1);
		expect(result2).toEqual([1, 2]);
		expect(timesRun).toEqual(1);
		expect(result1).toNotStrictlyEqual(result2);
		expect(result2).toNotStrictlyEqual(result3);
	},
	"can clear the caches of all memoized functions": () => {
		let timesRun = 0;
		const increment = (num => {
			timesRun ++;
			return num + 1;
		}).memoize(true);

		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(timesRun).toEqual(1);

		Function.prototype.memoize.clear();

		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(increment(1)).toEqual(2);
		expect(timesRun).toEqual(2);

	}
});
