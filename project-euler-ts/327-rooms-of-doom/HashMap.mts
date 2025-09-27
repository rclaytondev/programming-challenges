export class HashMap<K, V> {
	private internalValues: Map<string, [K, V]>;
	hashFunction: (key: K) => string;

	constructor(values: readonly (readonly [K, V])[] = [], hashFunction: (key: K) => string = key => `${key}`) {
		this.hashFunction = hashFunction;
		this.internalValues = new Map();
		for(const [key, value] of values) {
			this.set(key, value);
		}
	}

	set(key: K, value: V) {
		this.internalValues.set(this.hashFunction(key), [key, value]);
		return this;
	}
	get(key: K) {
		return (this.internalValues.get(this.hashFunction(key)) ?? [])[1];
	}
	has(key: K) {
		return this.internalValues.has(this.hashFunction(key));
	}
	delete(key: K) {
		return this.internalValues.delete(this.hashFunction(key));
	}
	clear() {
		this.internalValues.clear();
	}
	get size() {
		return this.internalValues.size;
	}

	*keys() {
		for(const [key, value] of this.internalValues.values()) {
			yield key;
		}
	}
	*values() {
		for(const [key, value] of this.internalValues.values()) {
			yield value;
		}
	}
	*entries() {
		yield* this.internalValues.values();
	}
}
