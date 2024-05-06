const getDigit = (index) => {
	/* returns the digit at the specified index (1-based) in Champernowne's constant. */
	let string = "";
	for(let i = 0; string.length < index; i ++, string += i) { }
	return Number.parseInt(string[index - 1]);
};
testing.addUnit("getDigit()", getDigit, [
	[1, 1],
	[2, 2],
	[3, 3],
	[9, 9],
	[10, 1],
	[11, 0],
	[12, 1],
	[13, 1]
]);

let product = 1;
for(let i = 1; i <= 1000000; i *= 10) {
	product *= getDigit(i);
}
console.log(product);
