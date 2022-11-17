const solve = () => {
	for(let i = 1010101000n; i < Infinity; i += 100n) {
		const square = i ** 2n;
		const digits = `${square}`;
		if(digits.length === 19 && (
			digits[0] === "1" && digits[2] === "2" && digits[4] === "3" && digits[6] === "4" &&
			digits[8] === "5" && digits[10] === "6" && digits[12] === "7" && digits[14] === "9"
		)) {
			console.log(`the answer is ${i}`);
			return i;
		}
	}
};
