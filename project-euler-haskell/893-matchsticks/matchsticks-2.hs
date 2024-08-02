digitMatchsticks = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6]

a `divides` b = b `mod` a == 0

divisors n = filter (`divides` n) [1 .. n-1]

digits n
    | n < 10 = [n]
    | otherwise = digits (n `div` 10) ++ [n `mod` 10]

nextProductMatchsticks values = values ++ [nextValue]
    where
        n = length values
        representations = map (\d -> values !! d + values !! (n `div` d) + 2) (divisors n)
        nextValue = minimum(if n < 10 then representations ++ [digitMatchsticks !! n] else representations)

productMatchsticksList = iterate nextProductMatchsticks []

productMatchsticks = map last productMatchsticksList

recursivePartitions num size lowerBound
    | size == 0 = [[]]
    | num > lowerBound = []
    | otherwise = concatMap partitionsStartingWith [lowerBound .. num]
    where partitionsStartingWith n = map (++ [n]) (recursivePartitions (num - n) (size - 1) n)

partitions num size = recursivePartitions num size 1

partitionsWithMaxSize num maxSize = concatMap (partitions num) [1 .. maxSize]

matchsticks n = minimum (map matchsticksFor (partitionsWithMaxSize n maxSize))
    where
        maxSize = n `div` 4
        matchsticksFor partition = 2 * (length partition - 1) + sum(map (productMatchsticks !!) partition)

main = do
    -- print (matchsticks 28)
    print(partitions 5 1)
