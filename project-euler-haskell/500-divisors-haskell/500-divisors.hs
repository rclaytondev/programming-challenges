import Data.List (find)
import Data.Maybe (fromJust)
import qualified Data.Set as Set

-- ----------------- --
-- Utility Functions --
-- ----------------- --

divides a b = b `mod` a == 0

isPrime num = num >= 2 && not(any (`divides` num) [2 .. num - 1])

nextPrime prime = fromJust(find isPrime [prime + 1 ..])

primes = iterate nextPrime (2 :: Integer)

minEntry f [x] = (x, f x)
minEntry f (x:xs) = if value < minOutput then (x, value) else (minValue, minOutput)
    where
        value = f x
        (minValue, minOutput) = minEntry f xs

argmin f arr = fst(minEntry f arr)

replace (x:xs) 0 value = value : xs
replace (x:xs) index value = x : replace xs (index - 1) value

endWith array value = if last array == value then array else array ++ [value]

-- -------------- --
-- Main Algorithm --
-- -------------- --

getLogMultiplier expFactorization index = (2 ^ (expFactorization !! index)) * log(fromInteger(primes !! index))

nextFactorization (expFactorization, possibleIndices) = (newFactorization, newPossibleIndices)
    where
        index = argmin (getLogMultiplier expFactorization) (Set.toAscList possibleIndices)
        newExponent = (expFactorization !! index) + 1
        newFactorization = endWith (replace expFactorization index newExponent) 0
        newPossibleIndices = if index /= 0 && newFactorization !! index == newFactorization !! (index - 1)
            then Set.insert (index + 1) (Set.delete index possibleIndices)
            else Set.insert (index + 1) possibleIndices

solve log2OfDivisors = iterate nextFactorization ([0], Set.fromList [0]) !! log2OfDivisors

-- Note: this can be further optimized by repeated squaring.
modularExponent base 0 modulo = 1
modularExponent base exponent modulo = (base * modularExponent base (exponent - 1) modulo) `mod` modulo

toNumber expFactorization modulo = product(zipWith getTerm expFactorization [0 .. ]) `mod` modulo
    where getTerm exponent index = modularExponent (primes !! index) (2 ^ exponent - 1) modulo

main = do
    print(nextPrime 13 == 17)
    print(take 5 primes == [2, 3, 5, 7, 11])
    print(getLogMultiplier [1, 1] 0 == log 4)
    print(getLogMultiplier [1, 0] 0 == log 4)
    print(replace [5, 4, 3, 2, 1] 2 100 == [5, 4, 100, 2, 1])
    print(nextFactorization ([1, 0], Set.fromList [0, 1]) == ([1, 1, 0], Set.fromList [0, 2]))
    print(nextFactorization ([1, 1, 0], Set.fromList [0, 2]) == ([2, 1, 0], Set.fromList [0, 1, 2]))
    print(fst (solve 4) == [2, 1, 1, 0])
    print(toNumber(fst (solve 4)) 150 == 120)
    print(toNumber(fst (solve 4)) 97 == 23)

    print(solve 1000)
