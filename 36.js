const isPalindrome = string => string === string.reverse();

let sum = 0;
for(let i = 0; i < 1000000; i ++) {
	const base10String = i.toString(10);
	const base2String = i.toString(2);
	if(isPalindrome(base10String) && isPalindrome(base2String)) {
		console.log(`${i} is a palindrome in both bases.`);
		sum += i;
	}
}
console.log(sum);
