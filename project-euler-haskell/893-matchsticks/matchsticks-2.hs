digitMatchsticks = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6]

a `divides` b = b `mod` a == 0

divisors n = filter (`divides` n) [2 .. n-1]

digits n
    | n < 10 = [n]
    | otherwise = digits (n `div` 10) ++ [n `mod` 10]

matchsticksForDigits n = sum(map (digitMatchsticks !!) (digits n))

nextProductMatchsticks values = values ++ [nextValue]
    where
        n = length values
        representations = map (\d -> values !! d + values !! (n `div` d) + 2) (divisors n)
        nextValue = minimum(matchsticksForDigits n : representations)

productMatchsticksList = iterate nextProductMatchsticks []

productMatchsticks = map last (tail productMatchsticksList)

recursivePartitions num size lowerBound
    | size == 0 = [[] | num == 0]
    | num < lowerBound = []
    | otherwise = concatMap partitionsStartingWith [lowerBound .. num]
    where partitionsStartingWith n = map (n :) (recursivePartitions (num - n) (size - 1) n)

partitions num size = recursivePartitions num size 1

partitionsWithMaxSize num maxSize = concatMap (partitions num) [1 .. maxSize]

matchsticks n = minimum (map matchsticksFor (partitionsWithMaxSize n maxSize))
    where
        maxSize = max 1 (matchsticksForDigits n `div` 4)
        matchsticksFor partition = 2 * (length partition - 1) + sum(map (productMatchsticks !!) partition)

matchsticksSum n = sum (map matchsticks [1 .. n])

main = do
    print(partitions 5 1 == [[5]])
    print(partitions 5 2 == [[1, 4], [2, 3]])
    print(partitions 5 3 == [[1, 1, 3], [1, 2, 2]])
    print(partitions 1 1 == [[1]])

    print (matchsticks 28 == 9)
    print (matchsticksSum 100 == 916)
    print (matchsticksSum 1000000)
