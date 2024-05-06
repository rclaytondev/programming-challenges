const concatenatedProduct = (base, multipliers) => {
	let resultStr = "";
	multipliers.forEach(multiplier => {
		resultStr += base * multiplier;
	});
	return Number.parseInt(resultStr);
};
const is1To9Pandigital = (number) => {
	/* returns whether the number uses all the digits 1-9 exactly once each. */
	const digits = number.digits();
	if(digits.length !== 9) {
		return false;
	}
	const DIGITS_1_TO_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	return DIGITS_1_TO_9.every(d => digits.includes(d));
};

let highestResult = 0;
for(let base = 1; base < 1e5; base ++) {
	if(`${base}`.includes(0) || `${base}`[`${base}`.length - 1] === "5") {
		continue;
	}
	for(let highestMultiplier = 2; highestMultiplier < 9; highestMultiplier ++) {
		const multipliers = new Array(highestMultiplier).fill().map((v, i) => i + 1);
		const result = concatenatedProduct(base, multipliers);
		if(`${result}`.length > 9 || `${result}`.includes("0")) { break; }
		else if(is1To9Pandigital(result) && result > highestResult) {
			highestResult = result;
		}
	}
}
console.log(highestResult);
