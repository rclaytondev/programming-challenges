/* represents a multidimensional vector */

class NVector {
	constructor(...args) {
		if(Array.isArray(args[0])) {
			const [numbers] = args;
			this.numbers = numbers;
		}
		else if(args[0] instanceof NVector) {
			const [{ numbers }] = args;
			this.numbers = numbers;
		}
		else if(args[0] instanceof Vector) {
			const [{ x, y }] = args;
			this.numbers = [x, y];
		}
		else if(args.every(arg => typeof arg === "number")) {
			this.numbers = args;
		}
	}
}
