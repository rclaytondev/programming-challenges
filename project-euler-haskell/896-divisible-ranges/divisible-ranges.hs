import Data.List (permutations)
a `divides` b = b `mod` a == 0

isDivisiblePermutation permutation = all (uncurry divides) (zip [1 ..] permutation)

isDivisible size first = any isDivisiblePermutation (permutations [first .. first + size - 1])

divisibleRanges size = filter (isDivisible size) [1 ..]

solve n = divisibleRanges n !! (n - 1)

main = do
    print(isDivisiblePermutation [7, 6, 9, 8])
    print(take 4 (divisibleRanges 4) == [1, 2, 3, 6])
    print(solve 4 == 6)
    print(solve 5)
