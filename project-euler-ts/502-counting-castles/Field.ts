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
		return this.add(element1, this.opposite(element2));
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
