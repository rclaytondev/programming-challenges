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
		return new Cuboid(
			left, top, front,
			right - left, bottom - top, back - front
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
const allCuboids = [];
for(const cuboid of cuboidGenerator) {
	if(cuboid instanceof Cuboid) {
		allCuboids.push(cuboid);
	}
	else { break; }
}

const nonemptySubsets = function*(size, cuboids = allCuboids, intersection = Infinity) {
	/* yields all nonempty subsets of `cuboids` (the global variable) with a nonempty intersection. */
	if(size === 1) {
		for(const [index, cuboid] of cuboids.entries()) {
			if(cuboid.intersects(intersection)) {
				yield [cuboid];
			}
		}
	}
	else {
		for(let [index, firstCuboid] of cuboids.entries()) {
			if(firstCuboid.intersects(intersection)) {
				for(const subset of nonemptySubsets(
					size - 1,
					cuboids.slice(index + 1),
					firstCuboid.intersection(intersection)
				)) { yield [firstCuboid, ...subset]; }
			}
		}
	}
};
const combinedVolume = (cuboids = allCuboids) => {
	let volume = 0;
	for(let subsetSize = 1; subsetSize <= allCuboids.length; subsetSize ++) {
		// console.log(subsetSize);
		for(const subset of nonemptySubsets(subsetSize, cuboids)) {
			const intersectionVolume = Cuboid.intersection(subset).volume();
			volume += intersectionVolume * (-1) ** (subsetSize + 1);
		}
	}
	// console.log(volume);
	return volume;
};
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
	}
});
