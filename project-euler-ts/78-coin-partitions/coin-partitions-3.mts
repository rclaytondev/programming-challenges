const MODULO = 10 ** 6;

const solve = () => {
	const partitionsMap = new Map<string, number>();
	partitionsMap.set(`1,1`, 1);
	for(let num = 2; true; num ++) {
		for(let upperBound = 1; upperBound <= num; upperBound ++) {
			let partitions = 0;
			for(let first = 1; first <= upperBound; first ++) {
				partitions += partitionsMap.get(`${num - first},${Math.min(first, num - first)}`) ?? (first === num ? 1 : 0);
				partitions %= MODULO;
			}
			// console.log(`partitions of ${num} into parts that are <=${upperBound}: answer is ${partitions}`);
			partitionsMap.set(`${num},${upperBound}`, partitions % MODULO);
		}
		// console.log(`p(${num}) = ${partitionsMap.get(`${num},${num}`)}`);
		if(partitionsMap.get(`${num},${num}`)! % MODULO === 0) {
			return num;
		}
	}
};

console.log(solve());
