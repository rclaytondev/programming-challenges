function Vector(x, y) {
	if(["left", "right", "up", "down"].includes(arguments[0])) {
		const vector = DIRECTION_VECTORS[arguments[0]];
		this.x = vector.x, this.y = vector.y;
	}
	if(typeof x === "number" || x == undefined) {
		this.x = x || 0;
		this.y = y || 0;
	}
	else if(typeof arguments[0] === "object") {
		this.x = arguments[0].x;
		this.y = arguments[0].y;
	}
};
Vector.method("add", function add(vector) {
	if(typeof vector === "object" && vector != null) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	}
	else {
		return new Vector(this.x + (arguments[0] || 0), this.y + (arguments[1] || 0));
	}
});
Vector.method("translate", Vector.prototype.add);
Vector.method("subtract", function subtract(vector) {
	if(typeof vector === "object" && vector != null) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	}
	else {
		return new Vector(this.x - (arguments[0] || 0), this.y - (arguments[1] || 0));
	}
});
Vector.method("multiply", function multiply(multiplier) {
	return new Vector(this.x * multiplier, this.y * multiplier);
});
Vector.method("divide", function divide(divisor) {
	return new Vector(this.x / divisor, this.y / divisor);
});
Vector.method("dotProduct", function dotProduct(vector) {
	return vector.x * this.x + vector.y * this.y;
});
Vector.method("magnitude", function magnitude() {
	return Math.hypot(this.x, this.y);
});
Vector.method("angle", function angle() {
	/*
	Returns the angle of the vector from the origin, clockwise from the positive x-axis. (negative y = up.)
	*/
	let angle = Math.deg(Math.atan2(this.y, this.x));
	angle = Math.modulateIntoRange(angle, 0, 360);
	return angle;
});
Vector.method("distanceFrom", function distanceFrom(vector) {
	if(typeof vector === "object" && vector != null) {
		return this.subtract(vector).magnitude();
	}
	else {
		return this.subtract(arguments[0], arguments[1]).magnitude();
	}
});
Vector.method("normalize", function normalize() {
	const magnitude = this.magnitude();
	return new Vector(this.x / magnitude, this.y / magnitude);
});
Vector.method("invert", function invert() {
	return new Vector(-this.x, -this.y);
});
Vector.method("rotateTo", function rotateTo(angle) {
	/*
	Returns this vector rotated so that it's angle matches the parameter `angle`.
	`angle` is in degrees, counterclockwise from the positive x-axis.
	*/
	const magnitude = this.magnitude();
	return Math.rotate(magnitude, 0, angle);
});
Vector.method("angleTo", function angleTo(vector) {
	/*
	Returns the angle at which one would have to travel to get from this vector to the other vector.
	Result will be in degrees, clockwise from the positive x-axis.
	*/
	if(arguments[0] instanceof Vector) {
		return Math.deg(Math.atan2(vector.y - this.y, vector.x - this.x));
	}
	else if(typeof arguments[0] === "number") {
		return Math.deg(Math.atan2(arguments[1] - this.y, arguments[0] - this.x));
	}
});
Vector.method("map", function map(vec1, vec2, vec3, vec4) {
	return new Vector(
		Math.map(this.x, vec1.x, vec2.x, vec3.x, vec4.x),
		Math.map(this.y, vec1.y, vec2.y, vec3.y, vec4.y)
	);
});
Vector.method("moveToward", function moveToward(destination, rateOfChange, proportional) {
	/*
	Returns a new vector that is like this vector, but `rateOfChange` closer to `destination`.
	If `proportional` is true, then the vector will move along the slope line toward the destination; if not, it will move the same distance in the x and y directions.
	*/
	if(proportional) {
		if(this.distanceFrom(destination) < rateOfChange) {
			return destination.clone();
		}
		return this.add(destination.subtract(this).normalize().multiply(rateOfChange));
	}
	else {
		const result = new Vector(this.x, this.y);
		if(result.x < destination.x) {
			result.x = Math.min(result.x + rateOfChange, destination.x);
		}
		else if(result.x > destination.x) {
			result.x = Math.max(result.x - rateOfChange, destination.x);
		}
		if(result.y < destination.y) {
			result.y = Math.min(result.y + rateOfChange, destination.y);
		}
		else if(result.y > destination.y) {
			result.y = Math.max(result.y - rateOfChange, destination.y);
		}
		return result;
	}
});
Vector.method("scaleAbout", function scaleAbout(vector, scalar) {
	return this.subtract(vector).multiply(scalar).add(vector);
});
Vector.method("round", function round() {
	return new Vector(Math.round(this.x), Math.round(this.y));
});
Vector.method("floor", function floor() {
	return new Vector(Math.floor(this.x), Math.floor(this.y));
});
Vector.method("ceil", function ceil() {
	return new Vector(Math.ceil(this.x), Math.ceil(this.y));
});
Vector.method("toString", function toString() {
	return `(${this.x}, ${this.y})`;
});
Vector.method("isHorizontal", function isHorizontal() {
	return this.y === 0;
});
Vector.method("isVertical", function isVertical() {
	return this.x === 0;
});
Vector.method("isAdjacentTo", function isAdjacentTo(x, y) {
	if(arguments[0].hasOwnProperty("x") && arguments[0].hasOwnProperty("y")) {
		const [vector] = arguments;
		return this.isAdjacentTo(vector.x, vector.y);
	}
	else {
		return (
			(x === this.x && Math.dist(this.y, y) === 1) ||
			(y === this.y && Math.dist(this.x, x) === 1)
		);
	}
});
Vector.method("equals", function equals() {
	if(arguments[0] instanceof Vector) {
		const [vector] = arguments;
		return this.x === vector.x && this.y === vector.y;
	}
	else {
		const [x, y] = arguments;
		return this.x === x && this.y === y;
	}
});


const DIRECTION_VECTORS = {
	"left": new Vector(-1, 0),
	"right": new Vector(1, 0),
	"up": new Vector(0, -1),
	"down": new Vector(0, 1)
};
