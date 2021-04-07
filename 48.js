let result = 0n;
for(let i = 1n; i <= 1000n; i ++) {
	result += i ** i;
}
const stringified = `${result}`;
console.log(stringified.substring(stringified.length - 10));
