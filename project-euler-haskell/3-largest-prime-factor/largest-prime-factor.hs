import Data.List (find)
divides a b = b `mod` a == 0

divisorsAboveSqrt num = filter (`divides` num) [floorSqrt num .. num]

floorSqrt num = floor(sqrt(fromIntegral num))

isPrime num = not(any (`divides` num) [2 .. num - 1])

largestPrimeFactor num = find isPrime (reverse(divisorsAboveSqrt num))

main = do
    -- print(divisorsAboveSqrt 123)
    print(largestPrimeFactor 600851475143)
