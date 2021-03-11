const COIN_VALUES = [1, 2, 5, 10, 20, 50, 100, 200];

class CoinSet {
	constructor(coins) {
		this.coins = coins;
		COIN_VALUES.forEach(coinValue => {
			this.coins[coinValue] ??= 0;
		});
	}
	addCoin(coinValue) {
		return new CoinSet({ ...this.coins, [coinValue]: this.coins[coinValue] + 1 });
	}
	totalValue() {
		return COIN_VALUES.sum(coinValue => coinValue * this.coins[coinValue]);
	}
	toString() {
		return (
			COIN_VALUES
			.filter(coinValue => this.coins[coinValue] !== 0)
			.map(coinValue => `${coinValue}: ${this.coins[coinValue]}`)
			.join(", ")
		);
	}
}

const numWaysToMake = (total) => {
	let ways = new Set();
	addWays(new CoinSet({}));
	return ways.size;
};

testing.addUnit("numWaysToMake()", [
	numWaysToMake,
	[1, 1],
	[2, 2], // {2} and {1, 1}
	[3, 2], // {2, 1} and {1, 1, 1}
	[4, 3], // {2, 2}, {2, 1, 1}, and {1, 1, 1, 1}
	[5, 4] // {5}, {2, 2, 1}, {2, 1, 1, 1}, {1, 1, 1, 1, 1}
]);
testing.testAll();
