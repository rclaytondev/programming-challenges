import Data.List (find)
import Data.Maybe (fromJust)

divides a b = b `mod` a == 0

isPrime num = num >= 2 && not(any (`divides` num) [2 .. num - 1])

nextPrime prime = fromJust(find isPrime [prime + 1 ..])

primes = iterate nextPrime (2 :: Integer)

getLogMultiplier expFactorization index = (2 ^ (expFactorization !! index)) * log(fromInteger(primes !! index))

minIndex [x] = 0
minIndex (x:xs) = if x < xs !! min then 0 else min + 1
    where min = minIndex xs

replace (x:xs) 0 value = value : xs
replace (x:xs) index value = x : replace xs (index - 1) value

endWith array value = if last array == value then array else array ++ [value]

nextFactorization expFactorization = endWith (replace expFactorization index newExponent) 0
    where
        index = minIndex (map (getLogMultiplier expFactorization) [0 .. length expFactorization - 1])
        newExponent = (expFactorization !! index) + 1

solve log2OfDivisors = iterate nextFactorization [0] !! log2OfDivisors

entries [] = []
entries (x:xs) = (0, x) : map (\(i, v) -> (i+1, v)) (entries xs)

toNumber expFactorization = product(map (\(i, v) -> (primes !! i) ^ (2 ^ v - 1)) (entries expFactorization))

main = do
    print(nextPrime 13 == 17)
    print(take 5 primes == [2, 3, 5, 7, 11])
    print(getLogMultiplier [1, 1] 0 == log 4)
    print(getLogMultiplier [1, 0] 0 == log 4)
    print(minIndex [10, 3, 1, 5] == 2)
    print(replace [5, 4, 3, 2, 1] 2 100 == [5, 4, 100, 2, 1])
    print(nextFactorization [1, 0] == [1, 1, 0])
    print(nextFactorization [1, 1, 0] == [2, 1, 0])
    print(solve 4 == [2, 1, 1, 0])
    print(toNumber(solve 4) == 120)
