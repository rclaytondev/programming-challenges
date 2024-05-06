const isPalindrome = (number) => {
	const digits = [...`${number}`];
	const reversed = [...`${number}`].reverse();
	return digits.equals(reversed);
};
const isLychrel = (number) => {
	number = BigInt(number);
	for(let i = 0; i < 50; i ++) {
		number += BigInt(`${[...number.toString()].reverse().join("")}`);
		if(isPalindrome(number)) { return false; }
	}
	return true;
};
const solve = () => {
	let result = 0;
	for(let i = 1; i < 10000; i ++) {
		if(isLychrel(i)) {
			console.log(i);
			result ++;
		}
	}
	return result;
};
