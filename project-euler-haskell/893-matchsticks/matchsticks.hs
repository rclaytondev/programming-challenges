matchsticksForOperator = 2

digitMatchsticks = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6]

a `divides` b = b `mod` a == 0

properDivisors n = filter (`divides` n) [2 .. n-1]

nextValues values = values ++ [nextValue]
    where
        n = length values
        sumRepresentations = map (\k -> (values !! k) + (values !! (n-k)) + matchsticksForOperator) [1 .. n-1]
        productRepresentations = map (\k -> (values !! k) + (values !! (n `div` k)) + matchsticksForOperator) (properDivisors n)
        digitsRepresentation = sum (map (digitMatchsticks !!) (digits n))
        nextValue = minimum (sumRepresentations ++ productRepresentations ++ [digitsRepresentation])

digits n
    | n < 10 = [n]
    | otherwise = digits (n `div` 10) ++ [n `mod` 10]

matchstickCounts = iterate nextValues []

matchstickSum n = sum (matchstickCounts !! n)

main = do
    print (digits 123 == [1, 2, 3])
    -- print (matchstickCounts !! 29)
    print (matchstickCounts !! 1)
    -- print (map (map (digitMatchsticks !!) . digits) [10 .. 10])
    -- print(digits 10)
    -- print(sum (map (digitMatchsticks !!) (digits 9)))
    -- print(digitMatchsticks !! 9)
