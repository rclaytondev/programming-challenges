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
		return this.reduce((sum, item) => sum + item);
	}
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

String.method("reverse", function() {
	return [...this].reverse().join("");
});

Function.method("memoize", function(stringifyKeys = false) {
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
				return map.get(stringified);
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
					return value;
				}
			}
			const result = func.apply(this, arguments);
			map.set(arguments, result);
			return result;
		};
	}
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
	}
};
