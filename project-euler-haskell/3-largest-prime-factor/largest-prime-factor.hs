import Data.List (sort, sortBy)
import Data.Maybe (isNothing)

divides a b = b `mod` a == 0

-- ceilSqrt num = ceiling(sqrt(fromIntegral num))
ceilSqrt = ceiling . sqrt . fromIntegral
-- ceilSqrt num = 123

lowDivisors num = filter (`divides` num) [1 .. ceilSqrt num]

divisorPair num divisor = if divisor ^ 2 == num then [divisor] else [divisor, num `div` divisor]

divisors num = sort(concatMap (divisorPair num) (lowDivisors num))

isPrime num = not(any (`divides` num) [2 .. num - 1])

primeFactors num = filter isPrime (divisors num)

largestPrimeFactor num = last(primeFactors num)

main = do
    -- print 123
    print(largestPrimeFactor 600851475143)
