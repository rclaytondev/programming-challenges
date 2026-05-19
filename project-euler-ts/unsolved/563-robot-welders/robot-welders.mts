/*
Theorem: a rectangle can be made by the robot welders if and only if the prime factors of its area are all <25.
*/

import { Factorization } from "../../../utils-ts/modules/math/Factorization.mjs";
import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../../utils-ts/modules/math/Sequence.mjs";
import { PriorityQueue } from "../../../utils-ts/modules/PriorityQueue.mjs";
import { CountLogger } from "../../project-specific-utilities/CountLogger.mjs";

export class Problem563 {
	static PRIMES = [...Sequence.PRIMES.termsBelow(25)];

	static validRectangles(area: Factorization) {
		let rectangles = 0;
		for(const divisorFactorization of area.divisors()) {
			const divisor = divisorFactorization.toNumber();
			const otherDivisor = area.toNumber() / divisor;
			if(divisor >= otherDivisor && divisor <= 1.1 * otherDivisor) {
				rectangles ++;
			}
		}
		return rectangles;
	}
	static *factorizationsWithPrimes(primes: number[]) {
		const queue = new PriorityQueue<Factorization>();
		queue.insert(Factorization.ONE, 1);
		const numbersInQueue = new Set([1]);
		while(true) {
			const [factorization, number] = queue.popWithPriority();
			numbersInQueue.delete(number);
			yield factorization;
			for(const prime of primes) {
				const nextNumber = number * prime;
				if(!numbersInQueue.has(nextNumber)) {
					const nextFactorization = factorization.multiply(Factorization.fromPrime(prime));
					queue.insert(nextFactorization, nextNumber);
					numbersInQueue.add(nextNumber);
				}
			}
		}
	}

	static solve(upperBound: number) {
		const logger = new CountLogger(n => 1000 * n, null, "Numbers checked");
		const progressLogger = new CountLogger(n => n, upperBound, "Numbers found");
		const minAreas = new Map<number, number>();
		const shorterSides: Factorization[] = [];
		const areasChecked = new Set<number>();
		outerLoop: for(const longerSide of Problem563.factorizationsWithPrimes(Problem563.PRIMES)) {
			shorterSides.push(longerSide);
			for(let i = 0; i < shorterSides.length; i ++) {
				const shorterSide = shorterSides[i];
				if(shorterSide.toNumber() * 1.1 < longerSide.toNumber()) {
					shorterSides.splice(i, 1);
					i --;
					continue;
				}
				const areaFactorization = longerSide.multiply(shorterSide);
				const area = areaFactorization.toNumber();
				if(areasChecked.has(area)) { continue; }
				areasChecked.add(area);
				logger.countTo(area);
				const rectangles = Problem563.validRectangles(areaFactorization);
				if(rectangles !== 0 && rectangles <= upperBound && !minAreas.has(rectangles)) {
					minAreas.set(rectangles, area);
					progressLogger.count();
				}
				if(minAreas.size >= upperBound) {
					break outerLoop;
				}
			}
		}
		return MathUtils.sum(minAreas.values());
	}
}

// console.time();
// console.log(Problem563.solve(4));
// console.timeEnd();
// debugger;
