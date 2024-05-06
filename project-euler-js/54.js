class Card {
	static SPECIAL_CARDS = ["T", "J", "Q", "K", "A"];
	static SPECIAL_CARD_NAMES = ["10", "Jack", "Queen", "King", "Ace"];
	static SUITS = ["H", "D", "C", "S"];
	static SUIT_NAMES = ["Hearts", "Diamonds", "Clubs", "Spades"];

	constructor(string) {
		/* string: a string consisting of:
		- either a number 2-10 or one of the characters "J", "Q", "K", or "A"
		- one of the characters "H", "S", "C", or "D"
		*/
		testing.assert(typeof string === "string");
		testing.assert(string.length === 2);
		const [value, suit] = string;
		if(Number.isNaN(Number.parseInt(value))) {
			testing.assert(Card.SPECIAL_CARDS.includes(value));
			this.value = Card.SPECIAL_CARDS.indexOf(value) + 10;
		}
		else {
			this.value = Number.parseInt(value);
			expect(this.value).toBeBetween(2, 10);
		}
		testing.assert(Card.SUITS.includes(suit));
		this.suit = suit;
	}

	toString() {
		const valueString = (this.value < 10) ? this.value : Card.SPECIAL_CARD_NAMES[this.value - 10].toLowerCase();
		const suitString = Card.SUIT_NAMES[Card.SUITS.indexOf(this.suit)].toLowerCase();
		return `${valueString} of ${suitString}`;
	}
}
testing.addUnit("Card constructor", {
	"correctly identifies suit and value": () => {
		const card = new Card("5H");
		expect(card.suit).toEqual("H");
		expect(card.value).toEqual(5);
	},
	"correctly identifies value for face cards - test case 1": () => {
		const card = new Card("JS");
		expect(card.suit).toEqual("S");
		expect(card.value).toEqual(11);
	},
	"correctly identifies value for face cards - test case 2": () => {
		const card = new Card("TS");
		expect(card.suit).toEqual("S");
		expect(card.value).toEqual(10);
	},
	"throws an error when a non-string value is provided": () => {
		expect(() => new Card()).toThrow();
		expect(() => new Card(123)).toThrow();
	},
	"throws an error when the input string is the wrong size": () => {
		expect(() => new Card("A")).toThrow();
		expect(() => new Card("KH1")).toThrow();
	},
	"throws an error when a non-numeric, non-face-card value is provided": () => {
		expect(() => new Card("FC")).toThrow(); // "F" is not a number or a face card
		expect(() => new Card("ABC")).toThrow(); // "AB" is not a number or a face card
	},
	"throws an error when a out-of-range numeric card value is provided": () => {
		expect(() => new Card("14C")).toThrow(); // there is no 14 of clubs
		expect(() => new Card("1D")).toThrow(); // there is no 1 of diamonds ("A" is for ace instead; also aces are high in poker)
	},
	"throws an error when an invalid suit is provided": () => {
		expect(() => new Card("3Q")).toThrow(); // "Q" is not one of the four suits of cards
		expect(() => new Card("10I")).toThrow(); // "I" is not one of the four suits of cards
	}
});
testing.addUnit("Card.toString()", [
	(arg) => new Card(arg).toString(),
	["5H", "5 of hearts"],
	["KD", "king of diamonds"],
	["QS", "queen of spades"]
]);


class HandOfCards {
	constructor(inputString) {
		/* input string: a string of space-separated cards */
		const cards = inputString.split(" ").map(str => new Card(str));
		this.cards = cards;
		testing.assert(cards.length === 5);
	}

	classification() {
		/* returns which type of poker hand this is, as well as the corresponding card. */
		const suits = this.cards.map(c => c.suit);
		const values = this.cards.map(c => c.value);
		const highestCard = values.max();

		const isFlush = suits.every(suit => suit === suits[0]);
		const isStraight = values.sort((a, b) => a - b).isConsecutive();
		if(isFlush && isStraight) { return {type: "straight-flush", card: highestCard}; }
		else if(isFlush) { return  {type: "flush", card: highestCard}; }
		else if(isStraight) { return {type: "straight", card: highestCard}; }

		const getGroups = (array) => {
			const uniqueElements = array.uniquify();
			return uniqueElements.map(el => array.count(el));
		};
		const groups = getGroups(values);
		if(groups.includes(4)) {
			const groupOfFour = values.find(v => values.count(v) === 4);
			return { type: "four-of-a-kind", card: groupOfFour };
		}
		else if(groups.includes(3)) {
			const groupOfThree = values.find(v => values.count(v) === 3);
			return { type: groups.includes(2) ? "full-house" : "three-of-a-kind", card: groupOfThree };
		}
		else if(groups.includes(2)) {
			const numPairs = groups.count(2);
			const highestPair = values.filter(v => values.count(v) === 2).max();
			return { type: numPairs === 2 ? "two-pair" : "one-pair", card: highestPair };
		}
		else {
			return { type: "high-card", card: highestCard };
		}
	}

	static HANDS = [
		"high-card",
		"one-pair",
		"two-pair",
		"three-of-a-kind",
		"straight",
		"flush",
		"full-house",
		"four-of-a-kind",
		"straight-flush"
	];
	compare(otherHand) {
		/* returns 1 if the other hand wins, -1 if this hand wins, and 0 if the hands tie. */
		const { card: card1, type: type1 } = this.classification();
		const { card: card2, type: type2 } = otherHand.classification();
		if(type1 === type2) {
			/* hands are of the same type */
			if(card1 < card2) { return 1; }
			else if(card1 > card2) { return -1; }
			else {
				/* hands are of the same and rank --> compare highest, 2nd highest, etc... until we find a winner */
				for(let n = 1; n < 5; n ++) {
					const nthHighest1 = this.cards.map(c => c.value).nthHighest(n);
					const nthHighest2 = otherHand.cards.map(c => c.value).nthHighest(n);
					if(nthHighest1 < nthHighest2) { return 1; }
					else if(nthHighest1 > nthHighest2) { return -1; }
				}
				return 0;
			}
		}
		else if(HandOfCards.HANDS.indexOf(type1) < HandOfCards.HANDS.indexOf(type2)) {
			return 1;
		} else {
			return -1;
		}
	}

	toString() {
		const stringifyList = (list) => (
			list.length === 1 ? `${list[0]}` :
			list.length === 2 ? `${list[0]} and ${list[1]}` :
			`${list.slice(0, list.length - 1).join(", ")}, and ${list.lastItem()}`
		);
		const getValueString = (card) => (card.value < 10) ? `${card.value}` : Card.SPECIAL_CARD_NAMES[card.value - 10].toLowerCase();

		const hearts = this.cards.filter(c => c.suit === "H").sort((a, b) => a.value - b.value);
		const diamonds = this.cards.filter(c => c.suit === "D").sort((a, b) => a.value - b.value);
		const clubs = this.cards.filter(c => c.suit === "C").sort((a, b) => a.value - b.value);
		const spades = this.cards.filter(c => c.suit === "S").sort((a, b) => a.value - b.value);
		const suitStrings = [
			hearts.length ? `${stringifyList(hearts.map(getValueString))} of hearts` : null,
			diamonds.length ? `${stringifyList(diamonds.map(getValueString))} of diamonds` : null,
			clubs.length ? `${stringifyList(clubs.map(getValueString))} of clubs` : null,
			spades.length ? `${stringifyList(spades.map(getValueString))} of spades` : null,
		].filter(v => v != null);
		return stringifyList(suitStrings);
	}
}
testing.addUnit("HandOfCards.classification()", [
	(str) => new HandOfCards(str).classification(),
	["2C 3C 4C 5C 6C", { type: "straight-flush", card: 6} ], // 2 through 6 of clubs
	["JH 8H TH 9H 7H", { type: "straight-flush", card: 11 }], // 7 through jack of hearts
	["9H TS JH QS KC", { type: "straight", card: 13 }], // 9 through king (mixed suits)
	["7C 4D 5S 6H 3D", { type: "straight", card: 7 }], // 3 through 7 (mixed suits)
	["4C 7C AC KC 2C", { type: "flush", card: 14 }], // flush in clubs
	["3D 9D KD 2D AD", { type: "flush", card: 14 }], // flush in diamonds
]);
testing.addUnit("HandOfCards.compare()", [
	(hand1, hand2) => new HandOfCards(hand1).compare(new HandOfCards(hand2)),
	[
		"TC JC QC KC AC", // royal flush in clubs
		"9D 9H 9C 9S 8H", // four 9's
		-1
	],
	[
		"7H 7C TD 9S AS", // pair of 7's with high card ace
		"7D 7S 8C 2D 4H", // pair of 7's with high card 8
		-1
	],
	[
		"7H 7C TD 9S AS", // pair of 7's with high card ace and second-highest 10
		"7D 7S 8C 2D AH", // pair of 7's with high card ace and second-highest 8
		-1
	],

	/* examples from Project Euler */
	[
		"5H 5C 6S 7S KD", // pair of 5's
		"2C 3S 8S 8D JD", // pair of 8's
		1
	],
	[
		"5D 8C 9S JS AC", // high card: ace
		"2C 5C 7D 8S QH", // high card: queen
		-1
	],
	[
		"2D 9C AS AH AC", // three aces
		"3D 6D 7D TD QD", // flush in diamonds
		1
	],
	[
		"4D 6S 9H QH QC", // pair of queens with highest card 9
		"3D 6D 7H QD QS", // pair of queens with highest card 7
		-1
	],
	[
		"2H 2D 4C 4D 4S", // full house with three 4's
		"3C 3D 3S 9S 9D", // full house with three 3's
		-1
	]
]);
testing.addUnit("HandOfCards.toString()", [
	(str) => new HandOfCards(str).toString(),
	["4H 3D 5H 9C TS", "4 and 5 of hearts, 3 of diamonds, 9 of clubs, and 10 of spades"],
	["9S TS 3S QS JS", "3, 9, 10, jack, and queen of spades"],
	["2D 3D 7H 7C TC", "7 of hearts, 2 and 3 of diamonds, and 7 and 10 of clubs"]
]);

let numWon = 0;
DATA.forEach(cardGame => {
	const p1Cards = cardGame.split(" ").slice(0, 5).join(" ");
	const p2Cards = cardGame.split(" ").slice(5).join(" ");
	const hand1 = new HandOfCards(p1Cards);
	const hand2 = new HandOfCards(p2Cards);
	if(hand1.compare(hand2) < 0) {
		numWon ++;
	}
});
