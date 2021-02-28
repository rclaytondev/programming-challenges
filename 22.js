const namesSorted = NAMES.sort();
const ALPHABET_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nameScore = (name) => {
	return [...name.toUpperCase()].sum(char => ALPHABET_STRING.indexOf(char) + 1);
};
let sum = namesSorted.sum((name, index) => {
	return nameScore(name) * (index + 1);
});
