import Data.List (find)
import Data.Maybe (isNothing)

divides a b = b `mod` a == 0

divisors num = filter isPrime [1 .. ceilSqrt num]

ceilSqrt num = floor(sqrt(fromIntegral num))

isPrime num = not(any (`divides` num) [2 .. num - 1])

primeDivisors num = filter isPrime divisorsOfNum
    where divisorsOfNum = divisors num

firstInList [] = Nothing
firstInList [first:others] = Just first

smallestPrimeFactor num = head(primeDivisors num)

factorization :: (Integral (Maybe a), Ord a, Fractional (Maybe a)) => Maybe a -> [Maybe a]
factorization num
    | isNothing firstPrimeFactor = previousFactorization
    | otherwise = firstPrimeFactor : previousFactorization
    where 
        firstPrimeFactor = smallestPrimeFactor num
        previousFactorization = factorization(num / firstPrimeFactor)

main = do
    print 123
    print(factorization 24)
