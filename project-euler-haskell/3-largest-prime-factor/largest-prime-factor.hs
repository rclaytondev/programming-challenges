import Data.List (find)
divides a b = b `mod` a == 0

divisors num = filter (`divides` num) [1 .. num]

isPrime num = not(any (`divides` num) [2 .. num - 1])

largestPrimeFactor num = find isPrime (reverse(divisors num))

main = do
    print(largestPrimeFactor 600851475143)
