const solve = () => {
	loop1: for(let i = 1; i < Infinity; i ++) {
		for(let multiplier = 2; multiplier < 6; multiplier ++) {
			const result = multiplier * i;
			if(!result.digits().sort().equals(i.digits().sort())) {
				continue loop1;
			}
		}
		console.log(`the answer is ${i}`);
		return i;
	}
};
