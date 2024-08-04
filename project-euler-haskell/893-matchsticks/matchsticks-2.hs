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

nextMatchsticks values = values ++ [minimum(productMatchsticks !! n : representations)]
    where
        n = length values
        representations = zipWith (\a b -> a + b + 2) (tail values) (reverse (tail values))

matchsticksList = iterate nextMatchsticks [0]

matchsticks n = last (matchsticksList !! n)

matchsticksSum n = sum (matchsticksList !! n)

main = do
    print(productMatchsticks !! 28 == 9)
    print(matchsticks 28 == 9)
    print (matchsticksSum 100 == 916)
    -- print (matchsticksSum 10000)
