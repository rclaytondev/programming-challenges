import Data.List (find)
import Data.Maybe (fromJust)

divides a b = b `mod` a == 0

isPrime num = num >= 2 && not(any (`divides` num) [2 .. num - 1])

nextPrime prime = fromJust(find isPrime [prime + 1 ..])

primes = iterate nextPrime (2 :: Integer)

getLogMultiplier expFactorization index = (2 ^ (expFactorization !! index)) * log(fromInteger(primes !! index))

main = do
    print(nextPrime 13 == 17)
    print(take 5 primes == [2, 3, 5, 7, 11])
    print(getLogMultiplier [1, 1] 0 == log 4)
