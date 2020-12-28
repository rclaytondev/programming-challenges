function Rectangle(dimensions) {
	/*
	Rectangles have properties {x, y, width, height}, {x, y, w, h}, and {left, right, top, bottom}. Whenever one property is changed, all the other properties are updated to reflect that change.
	*/


	let x;
	const xGetterSetter = {
		get: function() { return x; },
		set: function(newX) { x = newX; updateBounds(); }
	};
	Object.defineProperty(this, "x", xGetterSetter);
	let y;
	const yGetterSetter = {
		get: function() { return y; },
		set: function(newY) { y = newY; updateBounds(); }
	};
	Object.defineProperty(this, "y", yGetterSetter);
	let width;
	const widthGetterSetter = {
		get: function() { return width; },
		set: function(newWidth) { width = newWidth; updateBounds(); }
	};
	Object.defineProperty(this, "width", widthGetterSetter);
	Object.defineProperty(this, "w", widthGetterSetter);
	let height;
	const heightGetterSetter = {
		get: function() { return height; },
		set: function(newHeight) { height = newHeight; updateBounds(); }
	};
	Object.defineProperty(this, "height", heightGetterSetter);
	Object.defineProperty(this, "h", heightGetterSetter);

	let left;
	const leftGetterSetter = {
		get: function() { return left; },
		set: function(newLeft) { left = newLeft; updateDimensions(); }
	};
	Object.defineProperty(this, "left", leftGetterSetter);
	let right;
	const rightGetterSetter = {
		get: function() { return right; },
		set: function(newRight) { right = newRight; updateDimensions(); }
	};
	Object.defineProperty(this, "right", rightGetterSetter);
	let top;
	const topGetterSetter = {
		get: function() { return top; },
		set: function(newTop) { top = newTop; updateDimensions(); }
	};
	Object.defineProperty(this, "top", topGetterSetter);
	let bottom;
	const bottomGetterSetter = {
		get: function() { return bottom; },
		set: function(newBottom) { bottom = newBottom; updateDimensions(); }
	};
	Object.defineProperty(this, "bottom", bottomGetterSetter);

	function updateDimensions() {
		/* Update x, y, width, and height to be consistent with left, right, top, and bottom. */
		x = left;
		y = top;
		width = right - left;
		height = bottom - top;
	};
	function updateBounds() {
		/* update left, right, top, and bottom to be consistent with x, y, width, and height. */
		left = x;
		right = x + width;
		top = y;
		bottom = y + height;
	};

	for(let i in dimensions) {
		if(dimensions.hasOwnProperty(i)) {
			this[i] = dimensions[i];
		}
	}
};
Rectangle.method("translate", function(x, y) {
	return new Rectangle({ x: this.x + x, y: this.y + y, w: this.w, h: this.h });
});
Rectangle.method("clone", function clone() {
	return new Rectangle({ x: this.x, y: this.y, w: this.w, h: this.h });
});
Rectangle.method("centerAt", function(x, y) {
	const result = this.clone();
	result.x = x - (result.width / 2);
	result.y = y - (result.height / 2);
	return result;
});
Rectangle.method("fitsIn", function(rect) {
	/* returns whether this rectangle can fit inside the given rectangle without moving. (Takes into account both position and size) */
	return this.left >= rect.left && this.right <= rect.right && this.top >= rect.top && this.bottom <= rect.bottom;
});
Rectangle.method("center", function center() {
	return new Vector(this.x + (this.width / 2), this.y + (this.height / 2));
});
