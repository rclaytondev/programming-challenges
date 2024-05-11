# The Algorithm
1. Construct the adjacency matrix
2. Diagonalize the adjacency matrix A, viewing the entries (0 and 1) as elements of a finite field
3. Compute 1 + A + A^2 + ... + A^n where n is big enough
4. Look at the correct entry of the matrix to find the answer.

## The Better Algorithm, Using Geometric Series
1. Construct the adjacency matrix A
2. Compute (I - A)^-1
3. Look at the correct entry of (I - A)^-1 to find the answer.

**Proof of Correctness**:
The (i, j) entry in A^n is the number of n-step paths from i to j.
Therefore the number of total paths from i to j is the (i, j) entry of 1 + A + A^2 + ... + A^n for some large n.
For a sufficiently large n, there will be no paths of length n between any two points.
Therefore A is nilpotent.
It follows from a quick computation (which I did) that I - A is invertible and (I - A)^(-1) = 1 + A + A^2 + ....

## Ways of Representing it as a Graph Path-Counting Problem
### Method 1: The Old Way
In this method, each node is a tuple consisting of:
- The position in the grid (an ordered pair of integers)
- Whether or not the incomplete castle has reached the top yet (a boolean)
- The parity of the number of blocks in the incomplete castle (0 or 1)
- The previous direction that was moved in (right, up, or down) to prevent re-traversing the same line segment

This results in 12 nodes for each point in the grid.

### Method 2: The Old Way, Without `hasReachedTop`
This method is the same as the previous method except that we don't keep track of whether or not the incomplete castle has reached the top yet.
This means this method has only 6 nodes for each point in the grid.
In order to still produce the correct answer, we need to subtract the number of castles in a w * (h - 1) castle.

This means we're essentially solving the problem twice, but each subproblem is half as big.
This is almost definitely worth it, because the matrix algorithms run in slower than linear time.

### Method 3: Multiple Vertical Steps
In this method, we allow any number of vertical steps to be taken at the same time. However, after taking a vertical step, the next step must be horizontal.

In this method, each node is a tuple consisting of:
- The position in the grid
- The parity of the number of blocks in the incomplete castle.

This is more efficient than the previous methods, with only 2 nodes for each point in the grid.

But wait! This adds many more nonzero entries to each row and column (10^12 nonzero entries instead of 3 or 4 nonzero entries). This means I - A is much further away from the identity matrix, so row-reducing it to the identity will take much longer. Because of this, the previous method might actually be better.

On the other hand, I think this results in a somewhat regular structure (i.e. there are more patterns). In particular, the adjacency matrix of this graph should be a sequence of identical blocks arranged along the diagonal. Therefore it might be better to use this method and row-reduce each block individually, in order to avoid doing essentially the same calculations 10^12 times.
