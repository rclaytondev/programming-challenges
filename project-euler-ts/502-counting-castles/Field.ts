import { bezoutCoefficients, generalizedModulo, isPrime } from "../utils-ts/Math";

export class Field<ElementType> {
	zero: ElementType;
	one: ElementType;
	add: (element1: ElementType, element2: ElementType) => ElementType;
	multiply: (element1: ElementType, element2: ElementType) => ElementType;
	opposite: (element: ElementType) => ElementType;
	inverse: (element: ElementType) => ElementType;

	constructor(
		zero: ElementType,
		one: ElementType,
		add: (element1: ElementType, element2: ElementType) => ElementType,
		multiply: (element1: ElementType, element2: ElementType) => ElementType,
		opposite: (element: ElementType) => ElementType,
		inverse: (element: ElementType) => ElementType,
	) {
		this.zero = zero;
		this.one = one;
		this.add = add;
		this.multiply = multiply;
		this.opposite = opposite;
		this.inverse = inverse;
	}

	subtract(element1: ElementType, element2: ElementType) {
		return this.add(element1, this.opposite(element2));
	}
	divide(element1: ElementType, element2: ElementType) {
		return this.multiply(element1, this.inverse(element2));
	}
	exponentiate(element: ElementType, exponent: number) {
		let result = this.one;
		for(let i = 0; i < Math.abs(exponent); i ++) {
			result = this.multiply(result, exponent > 0 ? element : this.inverse(element));
		}
		return result;
	}
	sum(...elements: ElementType[]) {
		let result = this.zero;
		for(const element of elements) {
			result = this.add(result, element);
		}
		return result;
	}
}
export const integersModulo = function(modulo: number) {
	if(!isPrime(modulo)) {
		throw new Error(`Cannot construct the field of integers modulo ${modulo}: the result will not be a field since ${modulo} is not prime.`);
	}
	return new Field<number>(
		0, 1,
		(a, b) => (a + b) % modulo,
		(a, b) => (a * b) % modulo,
		num => (num === 0) ? num : modulo - num,
		num => {
			const [coef1] = bezoutCoefficients(num, modulo);
			return generalizedModulo(coef1, modulo);
		},
	);
};
export const reals = new Field<number>(
	0, 1,
	(a, b) => a + b,
	(a, b) => a * b,
	x => -x,
	x => 1/x,
);
