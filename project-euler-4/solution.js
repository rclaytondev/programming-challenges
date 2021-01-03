/* for each product of two 3-digit numbers, check if it's a palindrome, then return the biggest one. */
const products = [];
const isPalindrome = (num) => `${num}`.reverse() === `${num}`;
for(let i = 0; i < 999; i ++) {
	for(let j = i; j < 999; j ++) {
		if(isPalindrome(j * i)) {
			products.push(j * i);
		}
	}
}
console.log(products.max());
