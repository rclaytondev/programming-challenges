const indexInTriangulars = number => Math.sqrt(1/4 + 2 * number) - 1/2;
const isTriangular = (number) => {
	const index = indexInTriangulars(number);
	return index === Math.round(index);
};

const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const isTriangularWord = (word) => {
	word = word.toUpperCase();
	const numbers = [...word].map(letter => ALPHABET.indexOf(letter) + 1);
	const wordValue = numbers.sum();
	return isTriangular(wordValue);
};


console.time("solving the problem");
let triangularWords = 0;
WORDS.forEach(word => {
	if(isTriangularWord(word)) {
		triangularWords ++;
	}
});
console.log(triangularWords);
console.timeEnd("solving the problem");
