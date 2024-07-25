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

minIndex [x] = 0
minIndex (x:xs) = if x < xs !! min then 0 else min + 1
    where min = minIndex xs

replace (x:xs) 0 value = value : xs
replace (x:xs) index value = x : replace xs (index - 1) value

replaceWith 0 f (x:xs) = f x : xs
replaceWith index f (x:xs) = x : replaceWith (index - 1) f xs

endWith array value = if last array == value then array else array ++ [value]

pop [] = []
pop [x] = []
pop (x:xs) = x : pop xs

insertBefore value 0 arr = value : arr
insertBefore value index (x:xs) = x : insertBefore value (index - 1) xs

-- -------------- --
-- Main Algorithm --
-- -------------- --

data Group a = Group { size :: Integer, value :: a }

newtype GroupedList a = GroupedList [Group a]

insert value index GroupedList [] = [ Group { size = 1, value = value }]
-- insert value index GroupedList (x:xs)


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
