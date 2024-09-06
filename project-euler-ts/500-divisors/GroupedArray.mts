type Group<T> = { value: T, length: number };

export class GroupedArray<T> {
	groups: Group<T>[];

	constructor(groups: Group<T>[]) {
		this.groups = groups;
	}
	static fromArray<T>(array: T[]) {
		let groupSize = 0;
		let lastGroupIndex = 0;
		const groups = [];
		for(const [index, value] of array.entries()) {
			if(index > 0 && value !== array[index - 1]) {
				groups.push({ value: array[index - 1], length: groupSize });
				groupSize = 1;
				lastGroupIndex = index;
			}
			else {
				groupSize ++;
			}
		}
		if(array.length !== 0) {
			groups.push({ value: array[array.length - 1], length: array.length - lastGroupIndex });
		}
		return new GroupedArray<T>(groups);
	}
	*[Symbol.iterator]() {
		for(const group of this.groups) {
			for(let i = 0; i < group.length; i ++) {
				yield group.value;
			}
		}
	}

	groupIndex(arrayIndex: number) {
		try {
			const [index] = this.groupIndexAndRange(arrayIndex);
			return index;
		}
		catch(e) { return -1; }
	}
	groupIndexAndRange(arrayIndex: number): [number, { start: number, end: number }] {
		let groupStartIndex = 0;
		for(const [index, group] of this.groups.entries()) {
			if(arrayIndex < groupStartIndex + group.length) {
				return [index, { start: groupStartIndex, end: groupStartIndex + group.length - 1 }];
			}
			groupStartIndex += group.length;
		}
		throw new Error("Invalid array index.");
	}
	*groupStartEntries(): Generator<[number, T]> {
		let groupStartIndex = 0;
		for(const [index, group] of this.groups.entries()) {
			yield [groupStartIndex, group.value];
			groupStartIndex += group.length;
		}
	}
	findGroupIndex(callback: (value: T, arrayIndex: number, groupIndex: number) => boolean) {
		/* Returns the index of the first group satisfying the callback. */
		let groupStartIndex = 0;
		for(const [index, group] of this.groups.entries()) {
			if(callback(group.value, groupStartIndex, index)) {
				return index;
			}
			groupStartIndex += group.length;
		}
		throw new Error("Invalid array index.");
	}

	get length() {
		let length = 0;
		for(const group of this.groups) {
			length += group.length;
		}
		return length;
	}
	get(index: number) {
		return this.groups[this.groupIndex(index)].value;
	}
	update(index: number, callback: (oldValue: T) => T) {
		if(index < 0 || index % 1 !== 0) {
			throw new Error("Invalid array index.");
		}

		const [groupIndex, { start, end }] = this.groupIndexAndRange(index);
		const group = this.groups[groupIndex];
		const previousGroup = this.groups[groupIndex - 1];
		const nextGroup = this.groups[groupIndex + 1];
		let nextGroupIndex = groupIndex + 1;
		const value = callback(group.value);
		if(index === start && index === end) {
			group.value = value;
		}
		else if(index === start) {
			this.groups.splice(
				groupIndex, 1,
				{ value: value, length: 1 },
				{ value: group.value, length: group.length - 1 }
			);
			nextGroupIndex ++;
		}
		else if(index === end) {
			this.groups.splice(
				groupIndex, 1,
				{ value: group.value, length: group.length - 1 },
				{ value: value, length: 1 }
			);
			nextGroupIndex ++;
		}
		else {
			this.groups.splice(
				groupIndex, 1,
				{ value: group.value, length: index - start },
				{ value: value, length: 1 },
				{ value: group.value, length: end - index },
			);
		}

		const mergeBefore = index === start && previousGroup && previousGroup.value === value;
		const mergeAfter = index === end && nextGroup && nextGroup.value === value;
		if(mergeBefore && mergeAfter) {
			this.groups.splice(groupIndex - 1, 3, { value: value, length: previousGroup.length + nextGroup.length + 1 });
		}
		else if(mergeBefore) {
			this.groups.splice(groupIndex - 1, 2, { value: value, length: previousGroup.length + 1 });
		}
		else if(mergeAfter) {
			this.groups.splice(nextGroupIndex - 1, 2, { value: value, length: nextGroup.length + 1 });
		}
	}
	push(value: T) {
		const lastGroup = this.groups[this.groups.length - 1];
		if(lastGroup && value === lastGroup.value) {
			lastGroup.length ++;
		}
		else {
			this.groups.push({ value: value, length: 1 });
		}
	}
	set(index: number, value: T) {
		if(index === this.length) {
			this.push(value);
		}
		else {
			this.update(index, () => value);
		}
	}
	last() {
		const lastGroup = this.groups[this.groups.length - 1];
		if(!lastGroup) {
			throw new Error("Cannot get the last item of an empty GroupdArray.");
		}
		return lastGroup.value;
	}
	*entries() {
		let index = 0;
		for(const group of this.groups) {
			for(let i = 0; i < group.length; i ++) {
				yield [index, group.value];
				index ++;
			}
		}
	}
	toString() {
		return  this.groups.map(g => g.length === 1 ? `${g.value}` : `${g.value} (x${g.length})`).join(", ");
	}

	isValid() {
		for(const [index, group] of this.groups.entries()) {
			if(index !== 0 && group.value === this.groups[index - 1].value) {
				return false;
			}
			if(group.length < 1 || group.length % 1 !== 0) {
				return false;
			}
		}
		return true;
	}
}
