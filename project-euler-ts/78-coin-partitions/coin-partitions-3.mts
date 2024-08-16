const MODULO = 10 ** 6;

const solve = () => {
	const partitionsMap = new Map<string, number>();
	partitionsMap.set(`1,1`, 1);
	for(let num = 2; true; num ++) {
		// if(num % 50 === 0) {
		// 	console.log(num);
		// }
		partitionsMap.set(`${num},1`, 1);
		for(let upperBound = 2; upperBound <= num; upperBound ++) {
			const partitions = partitionsMap.get(`${num},${upperBound - 1}`)! + (partitionsMap.get(`${num - upperBound},${Math.min(upperBound, num - upperBound)}`) ?? (upperBound === num ? 1 : 0));
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
