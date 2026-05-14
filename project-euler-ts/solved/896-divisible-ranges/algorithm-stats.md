# Algorithm Stats (`divisible-ranges-2.mts`)

Values reached after 1 minute of computation: approximately **2 billion** (specifically, `1,901,836,229`, `1,894,482,221`).

Divisible ranges found: only the trivial ranges (`[1 .. 36]`, `[2 .. 37]`, `[3 .. 38]`, `[4 .. 39]`, and `[5 .. 40]`).

Percentage of numbers for which it needs to check if the range is divisible: **approximately 0.02%** (`536922` of `1894482251`).

Percentage of numbers checked by the smaller prime sieve: **approximately 17%** (exactly `1658880` out of every `9699690`)

The function `isDivisible` is periodic with period approximately **150 trillion** (specifically, `lcm(1, 2, 3, 4, ... 36) = 144,403,552,893,600`).

The larger prime sieve is periodic with period approximately **200 billion** (specifically, `2 * 3 * 5 * 7 * ... * 31`).

Storing the offsets of the larger prime sieve would take around **20 thousand** times as much memory (specifically, `23 * 29 * 31`).

# Analysis
Since 17% of the numbers are checked by the smaller prime sieve, this is a good target for optimization, since it checks many more numbers than the other parts of the algorithm.
