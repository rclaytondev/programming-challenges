# The New Algorithm - Pseudocode
Keep track of a list of 1-cliques, ... 5-cliques.
Let maxPrime = infinity.
For each prime p less than maxPrime:
	For each n <= 5:
		For each n-clique C found so far:
			If adding p to C forms an (n+1)-clique, add it to the list of (n+1)-cliques.
			Furthermore, if this is true and also n + 1 is 5, set maxPrime to the minimum of p and maxPrime.
Return the (n+1)-clique found with the smallest sum.
