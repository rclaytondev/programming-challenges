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

main = do
    print(nextPrime 13 == 17)
    print(take 5 primes == [2, 3, 5, 7, 11])
    print(getLogMultiplier [1, 1] 0 == log 4)
    print(minIndex [10, 3, 1, 5] == 2)
    print(replace [5, 4, 3, 2, 1] 2 100 == [5, 4, 100, 2, 1])
