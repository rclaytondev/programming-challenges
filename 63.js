/*
x = k^n.
10^(n-1) <= x < 10^n.
Therefore k^n < 10^n, and so k < 10.

Additionally, 10^(n-1) <= k^n.
Since k < 10 and k is an integer, we must have that k <= 9.
Therefore 10^(n-1) <= 9^n.
After doing some algebra, n <= (ln 10) / (ln 10 - ln 9).
*/

const UPPER_BOUND = Math.log(10) / (Math.log(10) - Math.log(9));
const solve = () => {
	let result = 0;
	for(let k = 1; k < 10; k ++) {
		for(let n = 1; n <= UPPER_BOUND; n ++) {
			const x = k ** n;
			const numDigits = `${x}`.length;
			if(numDigits === n) {
				console.log(`${k} ^ ${n} = ${k ** n} has ${numDigits} digits`);
				result ++;
			}
		}
	}
	return result;
};
