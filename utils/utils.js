Function.prototype.method = function() {
	if(typeof arguments[0] === "string" && typeof arguments[1] === "function") {
		const [name, func] = arguments;
		this.prototype[name] = func;
	}
	else if(typeof arguments[1] === "function") {
		const [func] = arguments;
		this.prototype[func.name] = func;
	}
	return this;
};
Function.method("memoize", function memoize(stringifyKeys = false, cloneOutput = false) {
	/*
	`stringifyKeys` lets you specify an additional optimization. If set to true, the arguments will be stringified before being set into the map, allowing for constant lookup times.
	However, not all arguments can be stringified without information loss (think of all the "[object Object]"s! Oh no!). If your arguments are like this, then do not use this feature.
	*/
	const map = new Map();
	const func = this;
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

Array.method("min", function(func, thisArg, resultType = "object") {
	if(typeof func === "function") {
		let lowestIndex = 0;
		let lowestValue = Infinity;
		this.forEach((item, index, array) => {
			let value = func.call(thisArg, item, index, array);
			if(value < lowestValue) {
				lowestValue = value;
				lowestIndex = index;
			}
		});

		if(resultType === "object") {
			return this[lowestIndex];
		}
		else if(resultType === "index") {
			return lowestIndex;
		}
		else if(resultType === "value") {
			return lowestValue;
		}
		else if(resultType === "all") {
			return [this[lowestIndex], lowestIndex, lowestValue];
		}
	}
	else {
		return this.min(num => num, thisArg, resultType);
	}
});
Array.method("max", function(func, thisArg, resultType = "object") {
	if(typeof func === "function") {
		let highestIndex = 0;
		let highestValue = -Infinity;
		this.forEach((item, index, array) => {
			let value = func.call(thisArg, item, index, array);
			if(value > highestValue) {
				highestValue = value;
				highestIndex = index;
			}
		});

		if(resultType === "object") {
			return this[highestIndex];
		}
		else if(resultType === "index") {
			return highestIndex;
		}
		else if(resultType === "value") {
			return highestValue;
		}
		else if(resultType === "all") {
			return [this[highestIndex], highestIndex, highestValue];
		}
	}
	else {
		return this.max(num => num, thisArg, resultType);
	}
});
Array.method("sum", function(func, thisArg) {
	if(typeof func === "function") {
		var sum = 0;
		this.forEach((item, index, array) => {
			var result = func.call(thisArg, item, index, array);
			if(typeof result === "number" && !isNaN(result)) {
				sum += result;
			}
		});
		return sum;
	}
	else {
		return this.reduce((sum, item) => sum + item, 0);
	}
});
Array.method("product", function product(func, thisArg) {
	if(typeof func === "function") { return this.map(func).product(); }

	let product = 1;
	for(let number of this) {
		if(typeof number === "bigint") { product = BigInt(product); }
		if(typeof product === "bigint") { number = BigInt(number); }
		product *= number;
	}
	return product;
});
Array.method("mean", function(func, thisArg) {
	return this.sum(func, thisArg) / this.length;
});
Array.method("count", function(func, thisArg) {
	if(typeof func === "function") {
		return this.filter(func, thisArg).length;
	}
	else {
		const [searchTarget] = arguments;
		return this.filter(v => v === searchTarget).length;
	}
});
Array.method("findLastIndex", function(func, thisArg) {
	for(let i = this.length - 1; i >= 0; i --) {
		if(thisArg ? func.call(thisArg, this[i], i, this) : func(this[i], i, this)) {
			return i;
		}
	}
	return -1;
});
Array.method("lastItem", function() {
    return this[this.length - 1];
});
Array.method("allItemsEqual", function() {
	return this.every(item => item === this[0]);
});
Array.method("isConsecutive", function() {
	if(this.some(item => typeof item !== "number")) { return false; }

	for(let i = 0; i < this.length - 1; i ++) {
		const item = this[i], nextItem = this[i + 1];
		if(item + 1 !== nextItem) { return false; }
	}
	return true;
});
Array.method("uniquify", function() {
	return [...new Set(this)];
});
Array.method("containsDuplicates", function() {
	return this.uniquify().length !== this.length;
});
Array.method("nthHighest", function(n) {
	/* returns the nth highest element of the array. (n=1 --> returns highest) */
	let arr = this;
	for(let i = 1; i < n; i ++) {
		const highest = arr.max();
		arr = arr.filter(v => v !== highest);
	}
	return arr.max();
});
Array.method("repeat", function(numTimes) {
	let result = this;
	for(let i = 0; i < numTimes - 1; i ++) {
		result = result.concat(this);
	}
	return result;
});
Array.method("partitionGenerator", function*() {
	if(this.length === 1) {
		yield [[this[0]]];
		return;
	}
	for(const partition of this.slice(1).partitionGenerator()) {
		yield [
			[this[0]],
			...partition
		];
		yield [
			[this[0], ...partition[0]],
			...partition.slice(1)
		];
	}
});
Array.method("subArrays", function subArrays() {
	const result = new Set([
		[]
	]);
	for(let start = 0; start < this.length; start ++) {
		for(let end = start + 1; end <= this.length; end ++) {
			result.add(this.slice(start, end));
		}
	}
	return result;
});
Array.method("permutations", function permutations() {
	if(this.length === 1) {
		return new Set([
			[this[0]]
		]);
	}

	const permutations = new Set();
	new Set(this).forEach(value => {
		const index = this.indexOf(value);
		const others = this.filter((v, i) => i !== index);
		const permutationsOfOthers = others.permutations();
		for(const otherPermutation of permutationsOfOthers) {
			permutations.add([value, ...otherPermutation]);
		}
	});

	return permutations;
});
Array.fromRange = function(min, max, step = 1) {
	const arr = [];
	for(let i = min; i <= max; i += step) {
		arr.push(i);
	}
	return arr;
};

String.method("reverse", function() {
	return [...this].reverse().join("");
});

Math.toRadians = function(deg) {
	return deg / 180 * Math.PI;
};
Math.toDegrees = function(rad) {
	return rad / Math.PI * 180;
};
Math.dist = function(x1, y1, x2, y2) {
	if(arguments.length === 4) {
		return Math.hypot(x1 - x2, y1 - y2); // 2-dimensional distance
	}
	else if(arguments.length === 2) {
		return Math.abs(arguments[0] - arguments[1]); // 1-dimensional distance
	}
};
Math.map = function(value, min1, max1, min2, max2) {
	/*
	Maps 'value' from range ['min1' - 'max1'] to ['min2' - 'max2']
	*/
	return (value - min1) / (max1 - min1) * (max2 - min2) + min2;
};
Math.modulateIntoRange = function(value, min, max) {
	const range = max - min;
	while(value < min) {
		value += range;
	}
	while(value > max) {
		value -= range;
	}
	return value;
};
Math.rotate = function(x, y, deg, centerX, centerY) {
    /*
    Returns new coords of ('x', 'y') after being rotated 'deg' degrees counterclockwise about ('centerX', 'centerY').
    */
    centerX = centerX || 0;
    centerY = centerY || 0;
    x -= centerX;
    y -= centerY;
    deg = Math.toRadians(deg);
    var rotated = {
        x: x * Math.cos(deg) - y * Math.sin(deg),
        y: x * Math.sin(deg) + y * Math.cos(deg)
    };
    return {
        x: rotated.x + centerX,
        y: rotated.y + centerY
    };
};
Math.logBase = function(base, number) {
	return Math.log(number) / Math.log(base);
};
Math.divisors = function(number) {
	/*
	Returns the divisors of the number, in an array in ascending order.
	Runs in O(sqrt(n)) time.
	*/
	const divisorsBelowSqrt = [];
	const divisorsAboveSqrt = [];
	for(let i = 1; i * i <= number; i ++) {
		if(number % i === 0) {
			divisorsBelowSqrt.push(i);
			if(i * i !== number) { divisorsAboveSqrt.push(number / i); }
		}
	}
	return [...divisorsBelowSqrt, ...divisorsAboveSqrt.reverse()];
};
Math.factorize = function(number, mode = "factors-list") {
	let result;
	if(mode === "factors-list") { result = []; }
	else if(mode === "prime-exponents") { result = {}; }

	for(let i = 2; i * i <= number; i ++) {
		while(number % i === 0) {
			number /= i;
			if(mode === "factors-list") { result.push(i); }
			else if(mode === "prime-exponents") {
				result[i] ??= 0;
				result[i] ++;
			}
		}
	}
	if(number !== 1) {
		if(mode === "factors-list") { result.push(number); }
		else if(mode === "prime-exponents") {
			result[number] ??= 0;
			result[number] ++;
		}
	}
	return result;
};
Math.isPrime = function(number) {
	if(number === 1) { return false; }
	if(number % 2 === 0 && number !== 2) { return false; }
	for(let i = 3; i * i <= number; i += 2) {
		if(number % i === 0) { return false; }
	}
	return true;
};

Number.method("isBetween", function isBetween(num1, num2, tolerance = 0) {
	return (
		(this + tolerance >= num1 && this - tolerance <= num2) ||
		(this + tolerance >= num2 && this - tolerance <= num1)
	);
});
Number.method("digits", function digits() {
	return [...`${this}`].map(char => Number.parseInt(char));
});
Number.method("uniqueDigits", function uniqueDigits() {
	return this.digits().uniquify();
});

CanvasRenderingContext2D.prototype.line = function() {
	/*
	Can be used to draw a line or a series of lines.

	Possible parameters:
	- Numbers (alternating x and y values)
	- Objects with x and y properties for each point
	- Array of objects with x and y properties
	*/
	if(Array.isArray(arguments[0])) {
		/* assume the input is an array of objects */
		this.polygon.apply(this, arguments[0]);
	}
	else if(typeof arguments[0] === "object") {
		/* assume each of the arguments is an object */
		this.moveTo(arguments[0].x, arguments[0].y);
		for(var i = 0; i < arguments.length; i ++) {
			this.lineTo(arguments[i].x, arguments[i].y);
		}
	}
	else if(typeof arguments[0] === "number") {
		/* assume all inputs are numbers */
		this.moveTo(arguments[0], arguments[1]);
		for(var i = 2; i < arguments.length; i += 2) {
			this.lineTo(arguments[i], arguments[i + 1]);
		}
	}
};
CanvasRenderingContext2D.prototype.strokeLine = function() {
	/*
	Can be used to stroke a line or a series of lines. Similar to polygon() but it doesn't automatically close the path (and it outlines the path).
	*/
	this.beginPath();
	this.line.apply(this, arguments);
	this.stroke();
};
CanvasRenderingContext2D.prototype.circle = function(x, y, r) {
	this.arc(x, y, r, Math.toRadians(0), Math.toRadians(360));
};
CanvasRenderingContext2D.prototype.fillCircle = function(x, y, r) {
	this.beginPath();
	this.arc(x, y, r, Math.toRadians(0), Math.toRadians(360));
	this.fill();
};
CanvasRenderingContext2D.prototype.strokeCircle = function(x, y, r) {
	this.beginPath();
	this.arc(x, y, r, Math.toRadians(0), Math.toRadians(360));
	this.stroke();
};
CanvasRenderingContext2D.prototype.polygon = function() {
	/* draw lines connecting all vertices + close path to form polygon */
	this.line.apply(this, arguments);
	this.closePath();
};
CanvasRenderingContext2D.prototype.fillPoly = function() {
	/*
	Arguments can be objects with 'x' and 'y' properties or numbers with each argument being either the x or the y, starting with x.
	*/
	this.beginPath();
	this.polygon.apply(this, arguments);
	this.fill();
};
CanvasRenderingContext2D.prototype.strokePoly = function() {
	/*
	Arguments can be objects with 'x' and 'y' properties or numbers with each argument being either the x or the y, starting with x.
	*/
	this.beginPath();
	this.polygon.apply(this, arguments);
	this.stroke();
};
CanvasRenderingContext2D.prototype.fillCanvas = function(color) {
	/*
	Fills the entire canvas with the current fillStyle.
	*/
	this.save(); {
		this.resetTransform();
		if(typeof color === "string") {
			this.fillStyle = color;
		}
		this.fillRect(0, 0, this.canvas.width, this.canvas.height);
	} this.restore();
};
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
	if(radius > width || radius > height) {
		throw new Error("Radius cannot be less than width or height.");
	}

	this.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
	this.lineTo(x + width - radius, y);
	this.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI);
	this.lineTo(x + width, y + height - radius);
	this.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI);
	this.lineTo(x + radius, y + height);
	this.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, Math.PI);
	this.lineTo(x, y + radius);
};
CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, w, h, radius) {
	this.beginPath();
	this.roundRect(x, y, w, h, radius);
	this.fill();
};
CanvasRenderingContext2D.prototype.strokeRoundRect = function(x, y, w, h, radius) {
	this.beginPath();
	this.roundRect(x, y, w, h, radius);
	this.stroke();
};
CanvasRenderingContext2D.prototype.loadStyle = function(style = {}) {
	for(let propName in style) {
		if(style.hasOwnProperty(propName)) {
			this[propName] = style[propName];
		}
	}
};

Set.method("equals", function(set) {
	if(this.size !== set.size) {
		return false;
	}
	for(const item of this.values()) {
		if(![...set].some(value => value === item || (typeof value === "object" && value.equals(item)))) {
			return false;
		}
	}
	return true;
});
Set.method("intersection", function(set) {
	/* returns the set of items that are in both sets. */
	const result = new Set();
	this.forEach(value => {
		if(set.has(value)) {
			result.add(value);
		}
	});
	return result;
});
Set.method("union", function(set) {
	const result = new Set();
	this.forEach(value => {
		result.add(value);
	});
	set.forEach(value => {
		result.add(value);
	});
	return result;
});
Set.method("difference", function(set) {
	/* returns the set of items that are in this set but not in the other set. */
	const result = new Set();
	this.forEach(value => {
		if(!set.has(value)) {
			result.add(value);
		}
	});
	return result;
});
Set.method("map", function map(callback) {
	return new Set([...this].map(callback));
});
Set.method("every", function every(callback) {
	return [...this].every(callback);
});
Set.method("some", function some(callback) {
	return [...this].some(callback);
});
Set.method("filter", function filter(callback) {
	return new Set([...this].filter(callback));
});
Set.method("subsets", function subsets() {
	/* returns the set of every subset of this set (including the empty set and this set). */
	if(this.size === 0) {
		return new Set([
			new Set([])
		]);
	}
	if(this.size === 1) {
		return new Set([
			new Set([]),
			new Set(this)
		]);
	}
	const elementsArray = [...this];
	const arbitraryElement = [...this][0];
	const otherElements = elementsArray.slice(1);
	const subsetsOfOthers = new Set(otherElements).subsets();
	return new Set([
		...subsetsOfOthers,
		...subsetsOfOthers.map(subset => new Set([arbitraryElement, ...subset]))
	]);
});
Set.method("cartesianPower", function cartesianPower(power) {
	return Set.cartesianProduct(...[this].repeat(power));
});
Set.cartesianProduct = function(...sets) {
	const firstSet = sets[0];
	if(sets.length === 1) {
		return new Set(firstSet.map(value => [value]));
	}
	const laterSets = sets.slice(1);
	const productOfOthers = Set.cartesianProduct(...laterSets);
	let result = new Set();
	firstSet.forEach(item => {
		productOfOthers.forEach(subproduct => {
			result.add([item, ...subproduct]);
		});
	});
	return result;
};
Set.cartesianProductGenerator = function*(...sets) {
	sets = sets.map(arg => new Set(arg));
	if(sets.length === 1) {
		for(const element of sets[0]) {
			yield [element];
		}
		return;
	}
	else {
		const firstSet = sets[0];
		const otherSets = sets.slice(1);
		for(const element of firstSet) {
			for(const product of Set.cartesianProductGenerator(...otherSets)) {
				yield [element, ...product];
			}
		}
	}
};

Object.method("clone", function() {
    if(Array.isArray(this)) {
        var clone = [];
    }
    else {
        var clone = Object.create(this.__proto__);
    }
    for(var i in this) {
        if(this.hasOwnProperty(i)) {
            if(typeof this[i] === "object" && this[i] !== null) {
                clone[i] = this[i].clone();
            }
            else {
                clone[i] = this[i];
            }
        }
    }
    return clone;
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
Object.method("set", function set(key, value) {
	this[key] = value;
	return this;
});
Object.method("mapKeys", function mapKeys(callback) {
	const result = Object.create(this.__proto__);
	Object.keys(this).forEach(key => {
		result[key] = callback(key, this[key]);
	});
	return result;
});
Object.method("watch", function watch(key, callback) {
	const getter = this.__lookupGetter__(key);
	const setter = this.__lookupSetter__(key);
	let value = this[key];
	Object.defineProperty(this, key, {
		get: () => {
			if(typeof getter === "function") { getter(); }
			return value;
		},
		set: (newValue) => {
			callback(this, key, newValue);
			if(typeof setter === "function") {
				setter();
			}
			else { value = newValue; }
		}
	});
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

var utils = {
	dom: {
		create: function(elementString) {
			/* split at every hashtag and period, including those characters in the resulting strings */
			var components = (function() {
				var result = [], lastIndex = 0;
				for(var i = 0; i < elementString.length; i ++) {
					if(elementString[i] === "#" || elementString[i] === ".") {
						result.push(elementString.substring(lastIndex, i));
						lastIndex = i;
					}
				}
				result.push(elementString.substring(lastIndex));
				result = result.map(str => str.trim());
				return result;
			}) ();
			/* create element with ID and/or class from parsed input */
			var tagName = components[0];
			var tag = document.createElement(tagName);
			if(components.length > 1) {
				components.forEach(component => {
					if(component.startsWith(".")) {
						tag.classList.add(component.substring(1));
					}
					if(component.startsWith("#")) {
						tag.id = component.substring(1);
					}
				});
			}
			return tag;
		}
	},

	pastInputs: {
		keys: [],
		mouse: {},
		update: function() {
			this.keys = { ...io.keys };
			this.mouse.x = io.mouse.x;
			this.mouse.y = io.mouse.y;
			this.mouse.pressed = io.mouse.pressed;
		}
	},

	largestSimilarRect: function(rect1, rect2) {
		/*
		Returns the largest location and size 'rect1' can be scaled to while still being able to fit inside 'rect2'. All rectangles take the form of objects w/ properties 'x', 'y', 'w', and 'h'.
		*/
		let rectangle = rect1.clone();
		const rectangleFits = () => {
			const BUFFER = 1;
			return (rectangle.w <= rect2.w + BUFFER && rectangle.h <= rect2.h + BUFFER);
		};
		/* scale it so that it fits vertically */
		rectangle.w *= (rect2.h / rect1.h);
		rectangle.h *= (rect2.h / rect1.h);
		if(!rectangleFits()) {
			rectangle = rect1.clone();
			rectangle.w *= (rect2.w / rect1.w);
			rectangle.h *= (rect2.w / rect1.w);
		}
		/* center it within the larger rectangle */
		rectangle.x = (rect2.x + (rect2.w / 2)) - (rectangle.w / 2);
		rectangle.y = (rect2.y + (rect2.h / 2)) - (rectangle.h / 2);
		return rectangle;
	},

	color: {
		lerp: function(color1, color2, ratio) {
			/* linearly interpolates between the colors. (ratio = 0 --> returns color1, ratio = 1 --> returns color2) */
			let [[r1], [g1], [b1]] = color1.matchAll(/\d+/g);
			let [[r2], [g2], [b2]] = color2.matchAll(/\d+/g);
			[r1, g1, b1, r2, b2, g2] = [r1, g1, b1, r2, b2, g2].map(str => Number.parseInt(str));
			const red = Math.map(ratio, 0, 1, r1, r2);
			const green = Math.map(ratio, 0, 1, g1, g2);
			const blue = Math.map(ratio, 0, 1, b1, b2);
			return `rgb(${red}, ${green}, ${blue})`;
		},
		lerpColors: function(colors, ratio, numbers) {
			numbers = numbers ?? colors.map((c, index) => index / (colors.length - 1));
			for(let i = 0; i < colors.length - 1; i ++) {
				const number = numbers[i], nextNumber = numbers[i + 1];
				if(ratio >= number && ratio <= nextNumber) {
					return utils.color.lerp(colors[i], colors[i + 1], Math.map(ratio, number, nextNumber, 0, 1));
				}
			}
		}
	},

	timeFunction: (func, numTrials = 1) => {
		const start = Date.now();
		for(let i = 0; i < numTrials; i ++) {
			func();
		}
		const end = Date.now();
		return (end - start) / numTrials;
	},
	compareTime: (func1, func2, numTrials = 1) => {
		const time1 = utils.timeFunction(func1, numTrials);
		const time2 = utils.timeFunction(func2, numTrials);
		if(time1 === time2) {
			console.log(`Both functions took the same amount of time.`);
		}
		else if(time1 > time2) {
			const timeFaster = (time1 / time2);
			console.log(`Function 2 is ${timeFaster} times faster.`);
		}
		else {
			const timeFaster = (time2 / time1);
			console.log(`Function 1 is ${timeFaster} times faster.`);
		}
	}
};
