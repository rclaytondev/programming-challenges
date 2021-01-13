const WORDS_ONES = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const WORDS_TENS = ["ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const WORDS_TEENS = ["eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];

const getDigits = (number) => {
	const hundreds = Math.floor(number / 100);
	const tens = Math.floor(number / 10) % 10;
	const ones = number % 10;
	return [hundreds, tens, ones];
};
const wordOfNumber = number => {
	/* returns the number written in word form (i.e. input of 123 would return "one hundred and twenty three" and so on.)*/
	if(number === 1000) { return "one thousand"; }
	const digits = getDigits(number);
	const [hundreds, tens, ones] = digits;
	const words = [
		hundreds ? `${WORDS_ONES[hundreds - 1]} hundred` : null,
		hundreds && (tens || ones) ? "and" : null,
		(tens !== 1 || ones === 0) ? WORDS_TENS[tens - 1] : null,
		tens === 1 ? WORDS_TEENS[ones - 1] : WORDS_ONES[ones - 1]
	].filter(s => s != null);
	return words.map(s => s.trim()).join(" ");




	return;
	if(number <= 0) { return ""; }
	if(number >= 100) {
		const otherDigits = wordOfNumber(number / 100);
		return WORDS_ONES[number % 100] + (number)
	}
	else if(number >= 10) {

	}
};
const ALPHABET = [..."abcdefghijklmnopqrstuvwxyz"];
const lettersInNumber = number => {
	const wordForm = wordOfNumber(number);
	const letters = [...wordForm].filter(char => ALPHABET.includes(char));
	return letters.length;
};


testing.addUnit("wordOfNumber()", {
	"one-digit numbers": () => {
		expect(wordOfNumber(1)).toEqual("one");
		expect(wordOfNumber(2)).toEqual("two");
		expect(wordOfNumber(9)).toEqual("nine");
	},
	"two-digit numbers": () => {
		expect(wordOfNumber(10)).toEqual("ten");
		expect(wordOfNumber(23)).toEqual("twenty three");
		expect(wordOfNumber(41)).toEqual("forty one");
		expect(wordOfNumber(99)).toEqual("ninety nine");
	},
	"three-digit numbers": () => {
		expect(wordOfNumber(123)).toEqual("one hundred and twenty three");
		expect(wordOfNumber(456)).toEqual("four hundred and fifty six");
		expect(wordOfNumber(321)).toEqual("three hundred and twenty one");
	},
	"teen numbers": () => {
		expect(wordOfNumber(11)).toEqual("eleven");
		expect(wordOfNumber(19)).toEqual("nineteen");
		expect(wordOfNumber(719)).toEqual("seven hundred and nineteen");
	}
});


let totalLetters = 0;
for(let i = 1; i <= 1000; i ++) {
	totalLetters += lettersInNumber(i);
}
console.log(totalLetters);
