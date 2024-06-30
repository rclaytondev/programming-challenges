# Time complexity of the Current Algorithm
Suppose you wanted to calculate p(1), p(2), ... p(n). Due to memoization:
- There is at most 1 call of the form numPartition(1, k)
- There are at most 2 calls of the form numPartition(2, k)
- There are at most 3 calls of the form numPartition(3, k)
...
- There are at most n calls of the form numPartition(n, k).

numPartitions(m, k) runs in O(m) time.
Therefore the time complexity is at most O(1 * 1 + 2 * 2 + 3 * 3 + ... + n * n) = O(n^3).


# Time Complexity of an Algorithm Based on OGFs
In order to calculate p(1), p(2), ... p(n), you need to calculate the product (1 + x)(1 + x^2)  ... (1 + x^n).

If you've already calculated (1 + x)(1 + x^2) ... (1 + x^m), then in order to calculate (1 + x)(1 + x^2) ... (1 + x^(m+1)), the total time taken is O(deg((1 + x)(1 + x^2) ... (1 + x^m))), which is O(m^2).
Therefore the total time is O(1^2 + 2^2 + 3^2 + ... + n^2), which is O(n^3).
