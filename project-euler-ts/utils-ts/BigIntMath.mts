/* Reimplements various Math methods to support bigints. */
export const max = (...values: bigint[]) => {
	let max = values[0];
	for(const value of values) {
		if(value > max) {
			max = value;
		}
	}
	return max;
};
export const min = (...values: bigint[]) => {
	let min = values[0];
	for(const value of values) {
		if(value < min) {
			min = value;
		}
	}
	return min;
};
export const abs = (value: bigint) => {
	return (value < 0n) ? -value : value;
};
export const gcd = (num1: bigint, num2: bigint): bigint => {
	if(num1 === 0n || num2 === 0n) { throw new Error("Cannot calculate GCD when either of the inputs are zero."); }
	[num1, num2] = [max(abs(num1), abs(num2)), min(abs(num1), abs(num2))];
	if(num1 % num2 === 0n) { return num2; }
	return gcd(num1 % num2, num2);
};
