const prng = function*() {
	let value = 290797;
	yield value;
	while(true) {
		yield value = (value ** 2) % 50515093;
	}
};

const insert = (list, value) => {
	for(let i = 0; i < list.length - 1; i ++) {
		if(list[i] <= value && value <= list[i + 1]) {
			list.splice(i + 1, 0, value);
			return list;
		}
	}
	if(value < list[0]) {
		list.unshift(value);
	}
	else {
		list.push(value);
	}
	return list;
};

const solve = (numTerms = 1000003) => {
	const numbers = [];
	let generator = prng();
	for(let i = 0; i < numTerms; i ++) {
		numbers.push(generator.next().value);
	}


	const MAX_CENTRAL_PRODUCTS = 100; // increase if it throws an error, decrease if it's using too much memory.
	let centralProducts = [];
	let centralIndex = 0;
	const getMedian = () => {
		if(centralIndex < 0 || centralIndex > MAX_CENTRAL_PRODUCTS) {
			throw new Error("Not enough central products stored; try increasing MAX_CENTRAL_PRODUCTS.");
		}
		return (centralProducts[Math.floor(centralIndex)] + centralProducts[Math.ceil(centralIndex)]) / 2;
	};
	for(let i = 0; i < numbers.length; i ++) {
		for(let j = i + 1; j < numbers.length; j ++) {
			const product = numbers[i] * numbers[j];
			if(centralProducts.length < MAX_CENTRAL_PRODUCTS) {
				console.log(`building the array; increased by 1/2`);
				insert(centralProducts, product);
				centralIndex += 1/2;
			}
			else {
				if(product < getMedian()) {
					console.log(`smaller than median; decreased by 1/2`);
					centralIndex -= 1/2;
					if(product > centralProducts[0]) {
						insert(centralProducts, product);
						if(centralProducts.length > MAX_CENTRAL_PRODUCTS) {
							centralProducts.shift();
						}
					}
				}
				else {
					console.log(`larger than median; increased by 1/2`);
					centralIndex += 1/2;
					if(product < centralProducts[centralProducts.length - 1]) {
						insert(centralProducts, product);
						if(centralProducts.length > MAX_CENTRAL_PRODUCTS) {
							centralProducts.pop();
						}
					}
				}
			}
		}
	}
	return getMedian();
};
solve(103);
