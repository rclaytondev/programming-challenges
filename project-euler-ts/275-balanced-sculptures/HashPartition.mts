import { Partition } from "./Partition.mjs";

export class HashPartition<T> {
	partition: Partition<string>;
	valuesMap: Map<string, T>;
	hashFunction: (value: T) => string;

	private constructor(partition: Partition<string>, valuesMap: Map<string, T>, hashFunction: (value: T) => string) {
		this.partition = partition;
		this.valuesMap = valuesMap;
		this.hashFunction = hashFunction;
	}
	static empty<T>(hashFunction: (value: T) => string = (x => `${x}`)) {
		return new HashPartition(Partition.empty(), new Map(), hashFunction);
	}

	add(value: T) {
		const hash = this.hashFunction(value);
		this.valuesMap.set(hash, value);
		this.partition.add(this.hashFunction(value));
	}
	merge(value1: T, value2: T) {
		const hash1 = this.hashFunction(value1);
		const hash2 = this.hashFunction(value2);
		this.partition.merge(hash1, hash2);
	}
	representative(value: T) {
		return this.valuesMap.get(this.partition.representative(this.hashFunction(value))) as T;
	}
}
