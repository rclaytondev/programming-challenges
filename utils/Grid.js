class Grid {
	constructor() {
		this.rows = [];
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [width, height, defaultValue] = arguments;
			this.rows = new Array(height).fill().map(row => new Array(width).fill(defaultValue));
		}
		else if(Array.isArray(arguments[0]) && arguments[0].every(row => row.length === arguments[0][0].length)) {
			const [rows] = arguments;
			this.rows = rows;
		}
		else if(typeof arguments[0] === "string") {
			const [multilineString] = arguments;
			const lines = multilineString.split("\n");
			this.rows = lines.map(row => [...row]);
		}
		else {
			throw new Error("Invalid usage.");
		}
	}

	get() {
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [x, y] = arguments;
			return this.rows[y][x];
		}
		else if((typeof arguments[0] === "object" && arguments[0] != null) && typeof arguments[0].x === "number" && typeof arguments[0].y === "number") {
			const [position] = arguments;
			return this.rows[position.y][position.x];
		}
		else {
			throw new Error("Invalid usage.");
		}
	}
	set() {
		if(typeof arguments[0] === "number" && typeof arguments[1] === "number") {
			const [x, y, value] = arguments;
			this.rows[y][x] = value;
		}
		else if((typeof arguments[0] === "object" && arguments[0] != null) && typeof arguments[0].x === "number" && typeof arguments[0].y === "number") {
			const [position, value] = arguments;
			this.rows[position.y][position.x] = value;
		}
		else {
			throw new Error("Invalid usage.");
		}
	}

	width() {
		return Math.max(...this.rows.map(r => r.length));
	}
	height() {
		return this.rows.length;
	}

	rotate(angle = 90) {
		while(angle < 0) { angle += 360; }
		while(angle >= 360) { angle -= 360; }
		if(angle === 0) {
			return this;
		}
		else if(angle === 90) {
			const result = new Grid(this.height(), this.width());
			this.forEach((value, x, y) => {
				const rotatedX = result.width() - y - 1;
				const rotatedY = x;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else if(angle === 180) {
			const result = new Grid(this.width(), this.height());
			this.forEach((value, x, y) => {
				const rotatedX = result.width() - x - 1;
				const rotatedY = result.height() - y - 1;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else if(angle === 270) {
			const result = new Grid(this.height(), this.width());
			this.forEach((value, x, y) => {
				const rotatedX = y;
				const rotatedY = result.height() - x - 1;
				result.rows[rotatedY][rotatedX] = value;
			});
			return result;
		}
		else {
			throw new Error("When rotating grids, angle must be a multiple of 90 degrees.");
		}
	}

	forEach(callback) {
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				callback(value, x, y, this);
			}
		}
	}
	some(callback) {
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) { return true; }
			}
		}
		return false;
	}
	every(callback) {
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(!callback(value, x, y, this)) { return false; }
			}
		}
		return true;
	}
	find(callback) {
		/* returns the first (when searching left-to-right, then top-down) object that meets the criteria. */
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					return value;
				}
			}
		}
		return undefined;
	}
	findPosition(callback) {
		/* returns the position of the first (when searching left-to-right, then top-down) object that meets the criteria. */
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					return window.Vector ? new Vector(x, y) : { x: x, y: y };
				}
			}
		}
		return undefined;
	}
	findPositions(callback) {
		/* returns the positions of all elements that satisfy the provided criteria. */
		const positions = [];
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(callback(value, x, y, this)) {
					positions.push(window.Vector ? new Vector(x, y) : { x: x, y: y });
				}
			}
		}
		return positions;
	}
	includes(object) {
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				const value = this.rows[y][x];
				if(value === object) { return true; }
			}
		}
		return false;
	}
	map(callback) {
		let result = new Grid(this.width(), this.height());
		for(let x = 0; x < this.width(); x ++) {
			for(let y = 0; y < this.height(); y ++) {
				result.rows[y][x] = callback(this.rows[y][x], x, y, this);
			}
		}
		return result;
	}
}
