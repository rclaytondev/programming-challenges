class Cuboid {
	constructor(x, y, z, width, height, depth) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = width;
		this.height = height;
		this.depth = depth;
	}

	volume() {
		return this.width * this.height * this.depth;
	}
	intersects(cuboid) {
		if(cuboid == null) { return false; }
		if(cuboid === Infinity) { return true; }
		return (
			this.x + this.width > cuboid.x && cuboid.x + cuboid.width > this.x &&
			this.y + this.height > cuboid.y && cuboid.y + cuboid.height > this.y &&
			this.z + this.depth > cuboid.z && cuboid.z + cuboid.depth > this.z
		);
	}
	intersection(cuboid) {
		if(cuboid == null) { return null; }
		if(cuboid == Infinity) { return this; }
		const left = Math.max(this.x, cuboid.x);
		const right = Math.min(this.x + this.width, cuboid.x + cuboid.width);
		const top = Math.max(this.y, cuboid.y);
		const bottom = Math.min(this.y + this.height, cuboid.y + cuboid.height);
		const front = Math.max(this.z, cuboid.z);
		const back = Math.min(this.z + this.depth, cuboid.z + cuboid.depth);
		if(right - left < 0 || bottom - top < 0 || back - front < 0) { return null; }
		return new Cuboid(
			left, top, front,
			right - left, bottom - top, back - front
		);
	}
	contains(cuboid) {
		if(cuboid == null) { return true; }
		if(cuboid === Infinity) { return false; }
		return (
			cuboid.x >= this.x && cuboid.x + cuboid.width <= this.x + this.width &&
			cuboid.y >= this.y && cuboid.y + cuboid.height <= this.y + this.height &&
			cuboid.z >= this.z && cuboid.z + cuboid.depth <= this.z + this.depth
		);
	}

	static intersection(cuboids) {
		if(arguments[0] instanceof Cuboid) {
			return Cuboid.intersection([...arguments]);
		}
		if(cuboids.length === 0) { return null; }
		if(cuboids.length === 1) { return cuboids[0]; }
		let result = cuboids[0].intersection(cuboids[1]);
		for(let i = 2; i < cuboids.length; i ++) {
			const cuboid = cuboids[i];
			if(cuboid.intersects(result)) {
				result = result.intersection(cuboid);
			}
			else { return null; }
		}
		return result;
	}

	static left(cuboid) {
		if(cuboid === Infinity) { return -Infinity; }
		return cuboid.x;
	}
	static right(cuboid) {
		if(cuboid === Infinity) { return Infinity; }
		return cuboid.x + cuboid.width;
	}
	static top(cuboid) {
		if(cuboid === Infinity) { return -Infinity; }
		return cuboid.y;
	}
	static bottom(cuboid) {
		if(cuboid === Infinity) { return Infinity; }
		return cuboid.y + cuboid.height;
	}
	static front(cuboid) {
		if(cuboid === Infinity) { return -Infinity; }
		return cuboid.z;
	}
	static back(cuboid) {
		if(cuboid === Infinity) { return Infinity; }
		return cuboid.z + cuboid.depth;
	}

	static boundingBox(cuboids) {
		const left = cuboids.min(c => Cuboid.left(c), null, "value");
		const right = cuboids.max(c => Cuboid.right(c), null, "value");
		const top = cuboids.min(c => Cuboid.top(c), null, "value");
		const bottom = cuboids.max(c => Cuboid.bottom(c), null, "value");
		const front = cuboids.min(c => Cuboid.front(c), null, "value");
		const back = cuboids.max(c => Cuboid.back(c), null, "value");
		return new Cuboid(left, top, front, right - left, bottom - top, back - front);
	}
}
testing.addUnit("Cuboid.intersects()", {
	"returns true when the cuboids intersect": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 2);
		const c2 = new Cuboid(1, 1, 1, 2, 2, 2);
		const intersects = c1.intersects(c2);
		expect(intersects).toEqual(true);
	},
	"returns false when the cuboids do not intersect": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 2);
		const c2 = new Cuboid(2, 2, 2, 2, 2, 2);
		const intersects = c1.intersects(c2);
		expect(intersects).toEqual(false);
	}
});
testing.addUnit("Cuboid.intersection()", {
	"correctly returns the intersection of two cuboids (instance method)": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 2);
		const c2 = new Cuboid(1, 1, 1, 2, 2, 2);
		const intersection = c1.intersection(c2);
		expect(intersection).toEqual(new Cuboid(1, 1, 1, 1, 1, 1));
	},
	"correctly returns the intersection of three cuboids (static method)": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 2);
		const c2 = new Cuboid(1, 1, 1, 2, 2, 2);
		const c3 = new Cuboid(-50, -50, -50, 100, 100, 100); // c3 contains c1 and c2
		const intersection = Cuboid.intersection(c1, c2, c3);
		expect(intersection).toEqual(new Cuboid(1, 1, 1, 1, 1, 1));
	}
});

const NUM_CUBOIDS = 50000;
const prng = new Sequence(function*() {
	for(let i = 1; i <= 55; i ++) {
		yield ((100003) - (200003 * i) + (300007 * i ** 3)) % 1000000;
	}
	for(let i = 56; i <= Infinity; i ++) {
		yield (prng.nthTerm(i - 25) + prng.nthTerm(i - 56)) % 1000000;
	}
});
const cuboidGenerator = new Sequence(function*() {
	for(let i = 1; i <= NUM_CUBOIDS; i ++) {
		yield new Cuboid(
			prng.nthTerm(6 * i - 6) % 10000,
			prng.nthTerm(6 * i - 5) % 10000,
			prng.nthTerm(6 * i - 4) % 10000,
			1 + (prng.nthTerm(6 * i - 3) % 399),
			1 + (prng.nthTerm(6 * i - 2) % 399),
			1 + (prng.nthTerm(6 * i - 1) % 399)
		);
	}
});
let allCuboids = [];
for(const cuboid of cuboidGenerator) {
	if(cuboid instanceof Cuboid) {
		allCuboids.push(cuboid);
	}
	else { break; }
}

const pruneCuboids = (cuboids) => {
	/* returns the list of cuboids after any cuboids that are contained in another cuboid are removed. */
	let numPruned = 0;
	cuboids = [...cuboids];
	for(let i = 0; i < cuboids.length; i ++) {
		const cuboid1 = cuboids[i];
		for(const cuboid2 of cuboids) {
			if(cuboid2 !== cuboid1 && cuboid2.contains(cuboid1)) {
				numPruned ++;
				cuboids.splice(i, 1);
				continue;
			}
		}
	}
	console.log(`pruned ${numPruned} cuboids`);
	return cuboids;
};
// allCuboids = pruneCuboids(allCuboids);

const DIRECTIONS = ["left", "right", "top", "bottom", "front", "back"];
const NEGATIVE_DIRECTIONS = ["left", "top", "front"];
const POSITIVE_DIRECTIONS = ["right", "bottom", "back"];
const combinedVolumeBaseCase = (cuboids = allCuboids) => {
	let volume = 0;
	const intersections = [
		{
			intersection: Infinity,
			numCuboids: 0
		}
	];
	for(const cuboid of cuboids) {
		for(const { intersection, numCuboids } of [...intersections]) {
			if(cuboid.intersects(intersection)) {
				const newIntersection = cuboid.intersection(intersection);
				volume += newIntersection.volume() * (numCuboids % 2 === 0 ? 1 : -1);
				intersections.push({
					intersection: newIntersection,
					numCuboids: numCuboids + 1
				});
			}
		}
	}
	return volume;
};
const combinedVolume = (cuboids = allCuboids) => {
	const BASE_CASE_CUTOFF = 10; // run the old algorithm if there are fewer than this many cuboids
	if(cuboids.length < BASE_CASE_CUTOFF) {
		return combinedVolumeBaseCase(cuboids);
	}
	else {
		const boundingBox = Cuboid.boundingBox(cuboids);
		const largestDimension = ["width", "height", "depth"].max(d => boundingBox[d]);
		const half1Size = Math.floor(boundingBox[largestDimension] / 2);
		const half2Size = boundingBox[largestDimension] - half1Size;
		const half1 = boundingBox.clone();
		const half2 = boundingBox.clone();
		if(largestDimension === "width") {
			half1.width = half1Size;
			half2.width = half2Size;
			half2.x = boundingBox.x + half1Size;
		}
		else if(largestDimension === "height") {
			half1.height = half1Size;
			half2.height = half2Size;
			half2.y = boundingBox.y + half1Size;
		}
		else if(largestDimension === "depth") {
			half1.depth = half1Size;
			half2.depth = half2Size;
			half2.z = boundingBox.z + half1Size;
		}
		const cuboids1 = cuboids.map(c => c.intersection(half1)).filter(c => c != null);
		const cuboids2 = cuboids.map(c => c.intersection(half2)).filter(c => c != null);
		return combinedVolume(cuboids1) + combinedVolume(cuboids2);
	}
};
console.time();
console.log(`volume: ${combinedVolume()}`);
console.timeEnd();
testing.addUnit("combinedVolume()", {
	"correctly returns the combined volume of the cuboids": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 2);
		const c2 = new Cuboid(1, 1, 1, 2, 2, 2);
		const volume = combinedVolume([c1, c2]);
		expect(volume).toEqual(15); // = 8 + 8 - 1
	},
	"works when there are three or more cuboids": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 2);
		const c2 = new Cuboid(1, 1, 1, 2, 2, 2);
		const c3 = new Cuboid(2, 2, 2, 2, 2, 2);
		const volume = combinedVolume([c1, c2, c3]);
		expect(volume).toEqual(22); // = 8 + 8 + 8 - 2
	},
	"works when no pairs of cuboids overlap": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 2);
		const c2 = new Cuboid(100, 100, 100, 2, 2, 2);
		const c3 = new Cuboid(-100, -100, -100, 2, 2, 2);
		const volume = combinedVolume([c1, c2, c3]);
		expect(volume).toEqual(24); // = 8 + 8 + 8
	},
	"works when there are four or more cuboids": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 2);
		const c2 = new Cuboid(1, 1, 1, 2, 2, 2);
		const c3 = new Cuboid(2, 2, 2, 2, 2, 2);
		const c4 = new Cuboid(3, 3, 3, 2, 2, 2);
		const volume = combinedVolume([c1, c2, c3, c4]);
		expect(volume).toEqual(29); // = 8 + 8 + 8 + 8 - 3
	},
	"works when the cuboids are not cubes": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 2, 4);
		const c2 = new Cuboid(1, 1, 2, 2, 2, 4);
		const volume = combinedVolume([c1, c2]);
		expect(volume).toEqual(30); // = (2 * 2 * 4) + (2 * 2 * 4) - (1 * 1 * 2)
	},
	"works when there exists a cuboid with different x and y positions": () => {
		const c1 = new Cuboid(0, 0, 0, 2, 4, 2);
		const c2 = new Cuboid(1, 2, 1, 2, 4, 2);
		const volume = combinedVolume([c1, c2]);
		expect(volume).toEqual(30); // = (2 * 2 * 4) + (2 * 2 * 4) - (1 * 1 * 2)
	},

	"works for the first 100 cuboids provided by Project Euler": () => {
		const volume = combinedVolume(allCuboids.slice(0, 100));
		expect(volume).toEqual(723581599);
	}
});
