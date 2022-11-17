const solve = () => {
	const upperBound = 1389026624n; // approximately sqrt(1929394959697989990)
	const lowerBound = 1010101000n; // approximately sqrt(1020304050607080900)
	for(let i = lowerBound; i < upperBound; i += 10n) {
		const square = i ** 2n;
		const digits = `${square}`;
		if(digits.length === 19 && (
			digits[0] === "1" && digits[2] === "2" && digits[4] === "3" && digits[6] === "4" && digits[8] === "5" &&
			digits[10] === "6" && digits[12] === "7" && digits[14] === "8" && digits[16] === "9" && digits[18] === "0"
		)) {
			console.log(`the answer is ${i}`);
			return i;
		}

		if(i % (100n * BigInt(1e5)) == 0) {
			const progress = Number((i - lowerBound)) / Number((upperBound - lowerBound));
			console.log(`${(Number(progress) * 100).toFixed(3)}% complete`);
		}
	}
};
