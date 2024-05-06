const greedyAlgorithm = (numTerms) => {
	/* Generates the terms in S_infinity, as defined in https://www.overleaf.com/project/639f9e53930f3c61e6de6268 */
	const s1 = [1];
	const s2 = [2];
	const s3 = [3];
	for(let i = 0; i < numTerms; i ++) {
		for(let nextTerm = s1[s1.length - 1] + 1; nextTerm < Infinity; nextTerm ++) {
			if(!(s2.includes(nextTerm) || s3.includes(nextTerm) || s3.includes(2 * nextTerm))) {
				s1.push(nextTerm);
				s2.push(2 * nextTerm);
				s3.push(3 * nextTerm);
				break;
			}
			else if(![...s1, ...s2, ...s3].includes(nextTerm)) {
				// console.log(`skipped ${nextTerm} (${nextTerm} / 6 = ${nextTerm / 6})`);
				// console.log(`${nextTerm} is skipped because of ${nextTerm * 2/3} (${s1.includes(nextTerm * 2/3)})`);

				if(s1.includes(nextTerm * 2/3)) {
					console.log(`skipped ${nextTerm} because ${nextTerm} = ${nextTerm * 2/3} * 3/2 and ${nextTerm * 2/3} is in S.`);
				}
				else {
					console.log(`${nextTerm} is a counterexample: it is skipped but is not in 3/2 S.`);
					debugger;
				}
			}
		}
	}
	return s1;
};


const isSemiprime = (factors) => factors.length === 2 && factors[0] !== factors[1];
const testConjecture3 = (numTerms) => {
	const greedySet = greedyAlgorithm(numTerms);
	let foundCounterexample = false;
	for(let i = 4; i < greedySet[greedySet.length - 1]; i ++) {
		const factors = Math.factorize(i);
		const condition1 = (greedySet.includes(i));
		const condition2 = (new Set(factors).size <= 2 && !isSemiprime(factors));
		if(condition1 && !condition2) {
			foundCounterexample = true;
			console.log(`${i} = ${factors.join(" * ")} is a counterexample: it is in S without satisfying the criteria.`);
			debugger;
		}
		else if(!condition1 && condition2) {
			foundCounterexample = true;
			console.log(`${i} = ${factors.join(" * ")} is a counterexample: it satisfies the criteria but is not in S.`);
			debugger;
		}
	}
	if(!foundCounterexample) {
		console.log(`no counterexamples found below ${numTerms}`);
	}
};
// testConjecture3(100);

const N = 25;
const terms = greedyAlgorithm(300);
const divisibleTerms = terms.filter(t => t % N === 0);
const multiples = divisibleTerms.map((n, i) => n / terms[i]);
console.log(multiples);
if(multiples.every(m => m === multiples[0])) {
	console.log(`All multiples are the same.`);
}
