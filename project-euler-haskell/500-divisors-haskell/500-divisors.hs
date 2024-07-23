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

data FactorSet = FactorSet { numFactors :: Int, expExponent :: Int }

getMultiplier factorization index = prime ^ changeInExponent
    where
        prime = primes !! sum(map numFactors (take index factorization))
        changeInExponent = 2 ^ expExponent (factorization !! index)



main = do
    print(nextPrime 13 == 17)
    print(take 5 primes == [2, 3, 5, 7, 11])
    print(replace [5, 4, 3, 2, 1] 2 100 == [5, 4, 100, 2, 1])
    print(getMultiplier example 0 == 2 ^ 4)
    print(getMultiplier example 1 == 11 ^ 2)
    print(getMultiplier example 2 == 19)

    where example = [ FactorSet { numFactors = 4, expExponent = 2 },
                      FactorSet { numFactors = 3, expExponent = 1 },
                      FactorSet { numFactors = 1, expExponent = 0 }
                    ]
