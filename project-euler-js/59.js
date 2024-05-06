const getKey = () => {
	let bestKey = null;
	let mostWords = 0;
	for(const possibleKey of new Set(ALPHABET).cartesianPower(3)) {
		const keyAscii = possibleKey.map(char => char.charCodeAt());
		const decryptedAscii = DATA.map((d, i) => d ^ keyAscii[i % keyAscii.length]);
		const decryptedString = decryptedAscii.map(num => String.fromCharCode(num)).join("");
		let numWords = 0;
		for(const word of WORDS) {
			numWords += decryptedString.occurences(word);
		}
		if(numWords > mostWords) {
			bestKey = keyAscii;
			mostWords = numWords;
			console.log(`${possibleKey.join("")}: ${numWords} words, decrypted message = ${decryptedString}`);
		}
	}
};

const KEY = "exp"; // found using the algorithm above
const keyAscii = [...KEY].map(char => char.charCodeAt());
const decryptedAscii = DATA.map((d, i) => d ^ keyAscii[i % keyAscii.length]);
console.log(decryptedAscii.sum());
