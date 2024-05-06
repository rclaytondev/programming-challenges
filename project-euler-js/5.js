let product = 1;
for(let i = 2; i < 20; i ++) {
	if(product % i !== 0) {
		console.log(`not divisible by ${i}`);
		for(let j = 1; j <= i; j ++) {
			if((product * j) % i === 0) {
				console.log(`multiplied by ${j} to get ${product * j}, now it's divisible.`);
				product *= j;
				break;
			}
		}
	}
}
console.log(product);
