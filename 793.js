const prng = function*() {
	let value = 290797;
	yield value;
	while(true) {
		yield value = (value ** 2) % 50515093;
	}
};

const solve = (numTerms = 1000003) => {
	const numbers = [];
	let generator = prng();
	for(let i = 0; i < numTerms; i ++) {
		numbers.push(generator.next().value);
	}

	const products = [];
	for(let i = 0; i < numbers.length; i ++) {
		for(let j = i + 1; j < numbers.length; j ++) {
			products.push(numbers[i] * numbers[j]);
		}
	}
	return products.median();
};
