const isPandigitalProduct = (num1, num2) => {
	const allDigits = [...num1.digits(), ...num2.digits(), ...(num1 * num2).digits()];
	return (
		Array.fromRange(1, 9).every(digit => allDigits.includes(digit)) &&
		allDigits.length === 9 &&
		!allDigits.containsDuplicates()
	);
};

const multiplicands = Array.fromRange(1, 1e4).filter(num => {
	const digits = num.digits();
	return !digits.includes(0) && !digits.containsDuplicates();
});
let productSum = 0;
let productsFound = {};


outerLoop: for(let i = 0; i < multiplicands.length; i ++) {
	const num1 = multiplicands[i];
	innerLoop: for(let j = i; j < multiplicands.length; j ++) {
		const num2 = multiplicands[j];
		if(`${num1}${num2}${num1 * num2}`.length > 9) { break innerLoop; }
		if(isPandigitalProduct(num1, num2) && !productsFound[num1 * num2]) {
			console.log(`${num1} * ${num2} = ${num1 * num2}`);
			productsFound[num1 * num2] = true;
			productSum += (num1 * num2);
		}
	}
}
console.log(productSum);
