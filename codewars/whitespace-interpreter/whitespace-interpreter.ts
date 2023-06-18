import { assert } from "chai";
import { describe } from "mocha";
import { Program } from "typescript";

const SPACE = " ";
const TAB = "\t";
const NEWLINE = "\n";

class ProgramState {
	stack: number[] = []; // the end of the list is the top of the stack
	heap: Map<number, number> = new Map();
	output: string = "";
	readonly input: string = "";
	readonly instructions: Instruction[];
	inputIndex: number = 0;
	instructionIndex: number = 0;
	callstack: number[] = [];
	done: boolean = false;

	constructor(instructions: Instruction[], input: string) {
		this.instructions = instructions;
		this.input = input;
	}

	goto(label: string) {
		const index = this.instructions.findIndex(i => (i instanceof LabelInstruction && i.label === label));
		if(index === -1) {
			throw new Error(`Cannot find function label ${fromWhitespace(label)}.`);
		}
		this.instructionIndex = index;
	}
	
	static execute(instructions: Instruction[], input: string = ""): string {
		const state = new ProgramState(instructions, input);
		while(!state.done) {
			const instruction = state.instructions[state.instructionIndex];
			instruction.execute(state);
			state.instructionIndex ++;
		}
		return state.output;
	}
}
abstract class Instruction {
	abstract execute(state: ProgramState): void;
}
class StackPushInstruction extends Instruction {
	value: number;
	constructor(value: number) {
		super();
		this.value = value;
	}
	execute(state: ProgramState) {
		state.stack.push(this.value);
	}
}
class StackDuplicationInstruction extends Instruction {
	value: number;
	constructor(value: number = 0) {
		super();
		this.value = value;
	}
	execute(state: ProgramState) {
		state.stack.push(state.stack[state.stack.length - this.value - 1]);
	}
}
class StackDeletionInstruction extends Instruction {
	numToDelete: number;
	constructor(numToDelete: number = 1) {
		super();
		this.numToDelete = numToDelete;
	}
	execute(state: ProgramState) {
		state.stack = state.stack.slice(0, state.stack.length - this.numToDelete);
	}
}
class StackSwapInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		const stack = state.stack;
		const length = stack.length;
		[stack[length - 1], stack[length - 2]] = [stack[length - 2], stack[length - 1]];
	}
}
abstract class ArithmeticInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		if(state.stack.length < 2) {
			throw new Error(`Stack must contain at least 2 values in order to perform an add operation.`);
		}
		const num1 = state.stack.pop();
		const num2 = state.stack.pop();
		state.stack.push(this.operation(num1!, num2!));
	}
	abstract operation(num1: number, num2: number): number;
};
class AddInstruction extends ArithmeticInstruction {
	constructor() { super(); }
	operation(a: number, b: number) { return a + b; }
}
class SubtractInstruction extends ArithmeticInstruction {
	constructor() { super(); }
	operation(a: number, b: number) { return a - b; }
}
class MultiplyInstruction extends ArithmeticInstruction {
	constructor() { super(); }
	operation(a: number, b: number) { return a * b; }
}
class DivideInstruction extends ArithmeticInstruction {
	constructor() { super(); }
	operation(a: number, b: number) { return a / b; }
}
class ModuloInstruction extends ArithmeticInstruction {
	constructor() { super(); }
	operation(a: number, b: number) { return a % b; }
}
class HeapStoreInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		if(state.stack.length < 2) {
			throw new Error(`Stack must contain at least 2 values in order to perform a heap storage operation.`);
		}
		const num1 = state.stack.pop();
		const num2 = state.stack.pop();
		state.heap.set(num1!, num2!);
	}
}
class HeapAccessInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		if(state.stack.length < 1) {
			throw new Error(`Stack must be nonempty in order to perform a heap access operation.`);
		}
		const num = state.stack.pop();
		const heapValue = state.heap.get(num!);
		if(heapValue === undefined) {
			throw new Error(`Invalid heap address.`);
		}
		state.stack.push(heapValue);
	}
}
class CharOutputInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		if(state.stack.length === 0) {
			throw new Error(`Stack must be nonempty in order to perform an ASCII output command.`);
		}
		const ascii = state.stack.pop();
		state.output += String.fromCharCode(ascii!);
	}
}
class NumericOutputInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		if(state.stack.length === 0) {
			throw new Error(`Stack must be nonempty in order to perform a numeric output command.`);
		}
		const number = state.stack.pop();
		state.output += number!.toString();
	}
}
class CharInputInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		if(state.stack.length === 0) {
			throw new Error(`Stack must be nonempty in order to perform a character input command.`);
		}
		if(state.inputIndex >= state.input.length) {
			throw new Error(`Insufficient program input.`);
		}
		const heapAddress = state.stack.pop();
		state.heap.set(heapAddress!, state.input.charCodeAt(state.inputIndex));
		state.inputIndex ++;
	}
}
class NumericInputInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		if(state.stack.length === 0) {
			throw new Error(`Stack must be nonempty in order to perform a numeric input command.`);
		}
		if(state.inputIndex >= state.input.length) {
			throw new Error(`Insufficient program input.`);
		}
		const inputAfter = state.input.slice(state.inputIndex);
		if(!inputAfter.includes(NEWLINE)) {
			throw new Error(`Expected a numeric termination symbol (NEWLINE).`);
		}
		const endIndex = inputAfter.indexOf(NEWLINE);
		const number = parseNum(inputAfter.slice(0, endIndex + 1));
		const heapAddress = state.stack.pop();
		state.heap.set(heapAddress!, number);
		state.inputIndex = endIndex + 1;
	}
}
class LabelInstruction extends Instruction {
	label: string;
	constructor(label: string) {
		super();
		this.label = label;
	}
	execute(state: ProgramState): void { }
}
class FunctionCallInstruction extends Instruction {
	funcLabel: string;
	constructor(funcLabel: string) {
		super();
		this.funcLabel = funcLabel;
	}
	execute(state: ProgramState): void {
		state.goto(this.funcLabel);
		state.callstack.push(state.instructions.indexOf(this));
	}
}
class GotoInstruction extends Instruction {
	label: string;
	constructor(label: string) {
		super();
		this.label = label;
	}
	execute(state: ProgramState): void {
		state.goto(this.label);
	}
}
class ConditionalEqualityInstruction extends Instruction {
	label: string;
	constructor(label: string) {
		super();
		this.label = label;
	}
	execute(state: ProgramState): void {
		if(state.stack.length === 0) {
			throw new Error(`Stack must have at least 1 item in order to perform a conditional equality instruction.`);
		}
		const num = state.stack.pop();
		if(num! === 0) {
			state.goto(this.label);
		}
	}
}
class ConditionalInequalityInstruction extends Instruction {
	label: string;
	constructor(label: string) {
		super();
		this.label = label;
	}
	execute(state: ProgramState): void {
		if(state.stack.length === 0) {
			throw new Error(`Stack must have at least 1 item in order to perform a conditional equality instruction.`);
		}
		const num = state.stack.pop();
		if(num! < 0) {
			state.goto(this.label);
		}
	}
}
class FunctionReturnInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		if(state.callstack.length === 0) {
			throw new Error(`Unexpected subroutine exit command; not currently in a subroutine.`);
		}
		state.instructionIndex = state.callstack.pop()!;
	}
}
class ProgramExitInstruction extends Instruction {
	constructor() { super(); }
	execute(state: ProgramState): void {
		state.done = true;
	}
}

const parser = {
	parse: (code: string): Instruction[] => {
		code = parser.removeNonWhitespace(code);
		const instructions = [];
		while(code !== "") {
			const [instruction, codeAfter] = parser.parseInstruction(code);
			instructions.push(instruction);
			code = codeAfter;
		}
		return instructions;
	},
	removeNonWhitespace: (code: string) => {
		return [...code].filter(v => v === SPACE || v === TAB || v === NEWLINE).join("");
	},

	parseInstruction: (code: string): [Instruction, string] => {
		for(const [instructionCode, instructionClass] of Object.entries(INSTRUCTIONS.NUMERIC_ARGUMENT)) {
			if(code.startsWith(instructionCode)) {
				const [num, codeAfter] = parser.parseNum(code.slice(instructionCode.length));
				return [new instructionClass(num), codeAfter];
			}
		}
		for(const [instructionCode, instructionClass] of Object.entries(INSTRUCTIONS.NO_ARGUMENTS)) {
			if(code.startsWith(instructionCode)) {
				return [new instructionClass(), code.slice(instructionCode.length)];
			}
		}
		for(const [instructionCode, instructionClass] of Object.entries(INSTRUCTIONS.LABEL_ARGUMENT)) {
			if(code.startsWith(instructionCode)) {
				const labelEndIndex = code.slice(instructionCode.length).indexOf(NEWLINE) + instructionCode.length + 1;
				const label = code.slice(instructionCode.length, labelEndIndex);
				const codeAfter = code.slice(labelEndIndex);
				return [new instructionClass(label), codeAfter];
			}
		}
		throw new Error(`Expected a valid Instruction Modification Parameter, but instead the code was "${fromWhitespace(code)}".`);
	},
	parseNum: (code: string): [number, string] => {
		/* Parses and returns the number at the beginning of the code and moves `position` to the end of the number. */
		const endIndex = code.indexOf(NEWLINE) + 1;
		return [parseNum(code.slice(0, endIndex)), code.slice(endIndex)];
	}
};
const INSTRUCTIONS = {
	NUMERIC_ARGUMENT: {
		/* instructions that take a single numeric argument. */
		[SPACE + (SPACE)]: StackPushInstruction,
		[SPACE + (TAB + SPACE)]: StackDuplicationInstruction,
		[SPACE + (TAB + NEWLINE)]: StackDeletionInstruction
	},
	NO_ARGUMENTS: {
		/* instructions that take no arguments. */
		[SPACE + (NEWLINE + NEWLINE)]: StackDeletionInstruction,
		[SPACE + (NEWLINE + SPACE)]: StackDuplicationInstruction,
		[SPACE + (NEWLINE + TAB)]: StackSwapInstruction,

		[(TAB + SPACE) + (SPACE + SPACE)]: AddInstruction,
		[(TAB + SPACE) + (SPACE + TAB)]: SubtractInstruction,
		[(TAB + SPACE) + (SPACE + NEWLINE)]: MultiplyInstruction,
		[(TAB + SPACE) + (TAB + SPACE)]: DivideInstruction,
		[(TAB + SPACE) + (TAB + TAB)]: ModuloInstruction,

		[(TAB + TAB) + SPACE]: HeapStoreInstruction,
		[(TAB + TAB) + TAB]: HeapAccessInstruction,

		[(TAB + NEWLINE) + (SPACE + SPACE)]: CharOutputInstruction,
		[(TAB + NEWLINE) + (SPACE + TAB)]: NumericOutputInstruction,
		[(TAB + NEWLINE) + (TAB + SPACE)]: CharInputInstruction,
		[(TAB + NEWLINE) + (TAB + TAB)]: NumericInputInstruction,

		[NEWLINE + (TAB + NEWLINE)]: FunctionReturnInstruction,
		[NEWLINE + (NEWLINE + NEWLINE)]: ProgramExitInstruction
	},
	LABEL_ARGUMENT: {
		[NEWLINE + (SPACE + SPACE)]: LabelInstruction,
		[NEWLINE + (SPACE + TAB)]: FunctionCallInstruction,
		[NEWLINE + (SPACE + NEWLINE)]: GotoInstruction,
		[NEWLINE + (TAB + SPACE)]: ConditionalEqualityInstruction,
		[NEWLINE + (TAB + TAB)]: ConditionalInequalityInstruction
	}
};

export function whitespace(code: string, input?: string):string {
	return ProgramState.execute(parser.parse(code), input);
};
export function fromWhitespace (n: string):string {
	return n.replace(/ /g, 's').replace(/\t/g, 't').replace(/\n/g, 'n');
}
export function toWhitespace (str: string):string {
	return str.replace(/s/g, ' ').replace(/t/g, "\t").replace(/n/g, '\n');
};
export function parseNum(str: string) {
	let num = 0;
	for(let i = 1; i < str.length - 1; i ++) {
		if(str[i] === TAB) {
			num += 2 ** (str.length - i - 2);
		}
	}
	if(str[0] === TAB) {
		num *= -1;
	}
	return num;
}

describe("whitespace()", () => {
	it("correctly runs a program that only outputs numbers", () =>{
		var output1 = "   \t\n\t\n \t\n\n\n";
		var output2 = "   \t \n\t\n \t\n\n\n";
		var output3 = "   \t\t\n\t\n \t\n\n\n";
		var output0 = "    \n\t\n \t\n\n\n";
	
		assert.equal(whitespace(output1), "1");
		assert.equal(whitespace(output2), "2");
		assert.equal(whitespace(output3), "3");
		assert.equal(whitespace(output0), "0");
	});
	
	it("correctly runs a program that outputs negative numbers", () =>{
		var outputNegative1 = "  \t\t\n\t\n \t\n\n\n";
		var outputNegative2 = "  \t\t \n\t\n \t\n\n\n";
		var outputNegative3 = "  \t\t\t\n\t\n \t\n\n\n";
	
		assert.equal(whitespace(outputNegative1), "-1");
		assert.equal(whitespace(outputNegative2), "-2");
		assert.equal(whitespace(outputNegative3), "-3");
	});
		
	it("throws an error on unclean termination", () => {    
		assert.throws(() => {
			whitespace("");
		});
	});
	
	it("correctly runs a program that parses and outputs letters", () => {
		var outputA = "   \t     \t\n\t\n  \n\n\n";
		var outputB = "   \t    \t \n\t\n  \n\n\n";
		var outputC = "   \t    \t\t\n\t\n  \n\n\n";
	
		assert.equal(whitespace(outputA), "A");
		assert.equal(whitespace(outputB), "B");
		assert.equal(whitespace(outputC), "C");
	});

	it("correctly runs a program with comments (non-whitespace characters)", () => {
		var outputA = "blahhhh   \targgggghhh     \t\n\t\n  \n\n\n";
		var outputB = " I heart \t  cats  \t \n\t\n  \n\n\n";
		var outputC = "   \t  welcome  \t\t\n\t\n to the\nnew\nworld\n";

		assert.equal(whitespace(outputA), "A");
		assert.equal(whitespace(outputB), "B");
		assert.equal(whitespace(outputC), "C");
	});

	it("correctly runs a program that pushes to and outputs from the stack", () => {
		const pushTwice = toWhitespace(
			"sssttn" // push the number `sttn` = 3 onto the stack
			+ "sssttn" // push the number `sttn` = 3 onto the stack
			+ "tnst" // pop the value and output as a number
			+ "tnst" // pop the value and output as a number
			+ "nnn" // end the program
		);
		assert.equal(whitespace(pushTwice), "33");
	});
	it("correctly runs a program that swaps items on the stack", () => {
		const swap = toWhitespace(
			"sssttn" // push the number `sttn` = 3 onto the stack
			+ "ssstsn" // push the number `stsn` = 2 onto the stack
			+ "snt" // swap the top two values on the stack
			+ "tnst" // pop the value and output as a number
			+ "tnst" // pop the value and output as a number
			+ "nnn" // end the program
		);
		assert.equal(whitespace(swap), "32");
	});
	it("correctly runs a program that discards items from the top of the stack", () => {
		const discard = toWhitespace(
			"sssttn" // push the number `sttn` = 3 onto the stack
			+ "ssstsn" // push the number `stsn` = 2 onto the stack
			+ "snt" // swap the top two values on the stack
			+ "snn" // discard the top value from the stack
			+ "tnst" // pop the value and output as a number
			+ "nnn" // exit the program
		);
		debugger;
		assert.equal(whitespace(discard), "2");
	});
	it("correctly runs a program that duplicates the top item using a no-argument duplication instruction", () => {
		const duplicate = toWhitespace(
			"sssttn" // push the number `sttn` = 3 onto the stack
			+ "sns" // duplicate the top value on the stack
			+ "tnst" // pop the value and output as a number
			+ "tnst" // pop the value and output as a number
			+ "nnn" // exit the program
		);
		assert.equal(whitespace(duplicate), "33");
	});
	it("correctly runs programs that duplicate items other than the top item", () => {
		const duplicate = (position: string) => toWhitespace(
			"ssstn" // push the number `stn` = 1 onto the stack
			+ "ssstsn" // push the number `stsn` = 2 onto the stack
			+ "sssttn" // push the number `sttn` = 3 onto the stack
			+ "sts" + (position) // duplicate the `position`th number on the stack
			+ "tnst" // pop the value and output as a number
			+ "nnn" // end the program
		);
		const duplicateN1 = duplicate("stsn"); // duplicate item at index 2
		const duplicateN2 = duplicate("stn"); // duplicate item at index 1
		const duplicateN3 = duplicate("ssn"); // duplicate item at index 0
		assert.equal(whitespace(duplicateN1), "1");
		assert.equal(whitespace(duplicateN2), "2");
		assert.equal(whitespace(duplicateN3), "3");
	});

	it("correctly runs a long program that pushes, swaps, deletes, and outputs", () => {
		const slide = toWhitespace(
			"sssttn" // push the number `sttn` = 3 onto the stack
			+ "ssstsn" // push the number `stsn` = 2 onto the stack
			+ "ssstn" // push the number `stn` = 1 onto the stack
			+ "ssstssn" // push the number `stssn` = 4 onto the stack
			+ "sssttsn" // push the number `sttsn` = 6 onto the stack
			+ "ssststn" // push the number `ststn` = 5 onto the stack
			+ "ssstttn" // push the number `stttn` = 7 onto the stack

			+ "snt" // swap the top two values on the stack (now contains 3214675)
			+ "stnsttn" // delete the top `sttn` = 3 values on the stack (now contains 3214)

			+ "tnst" // pop the value and output as a number
			+ "tnst" // pop the value and output as a number
			+ "tnst" // pop the value and output as a number
			+ "tnst" // pop the value and output as a number
			+ "nnn" // end the program
		);
		assert.equal(whitespace(slide), "5123");
	});
});
describe("parseNum()", () => {
	it("correctly parses positive numbers", () => {
		assert.equal(parseNum(` \t\t\t\n`), 7);
		assert.equal(parseNum(` \t\t\t\t\t\t\n`), 63);
		assert.equal(parseNum(` \t     \n`), 32);
	});
	it("correctly parses negative numbers", () => {
		assert.equal(parseNum(`\t\t     \n`), -32);
	});
});
describe("parser.parseNum()", () => {
	it("correctly parses a number and returns the string after it", () => {
		assert.deepEqual(parser.parseNum(` \t\t\t\n foo`), [7, ` foo`]);
	});
});
describe("parser.parseInstruction()", () => {
	it("correctly parses a stack push instruction", () => {
		const STACK_PUSH = SPACE + SPACE;
		const NUMBER = `\t\t     \n`; // -32
		const CODE_AFTER = `\t \t`;
		const [instruction, codeAfter] = parser.parseInstruction(STACK_PUSH + NUMBER + CODE_AFTER);
		assert.deepEqual(instruction, new StackPushInstruction(-32));
		assert.equal(codeAfter, CODE_AFTER);
	});
	it("correctly parses an arbitrary-depth stack duplication instruction", () => {
		const STACK_DUPLICATION = (SPACE) + (TAB + SPACE);
		const NUMBER = ` \t\t\t\n`; // 7
		const CODE_AFTER = `\t \t`;
		const [instruction, codeAfter] = parser.parseInstruction(STACK_DUPLICATION + NUMBER + CODE_AFTER);
		assert.deepEqual(instruction, new StackDuplicationInstruction(7));
		assert.equal(codeAfter, CODE_AFTER);
	});
	it("correctly parses a stack deletion instruction", () => {
		const STACK_DELETION = SPACE + (TAB + NEWLINE);
		const NUMBER = ` \t\t\t\n`; // 7
		const CODE_AFTER = `\t \t`;
		const [instruction, codeAfter] = parser.parseInstruction(STACK_DELETION + NUMBER + CODE_AFTER);
		assert.deepEqual(instruction, new StackDeletionInstruction(7));
		assert.equal(codeAfter, CODE_AFTER);
	});
	it("correctly parses a no-argument, depth-1 duplication instruction", () => {
		const STACK_TOP_DUPLICATION = SPACE + (NEWLINE + SPACE);
		const CODE_AFTER = `\t \t`;
		const [instruction, codeAfter] = parser.parseInstruction(STACK_TOP_DUPLICATION + CODE_AFTER);
		assert.deepEqual(instruction, new StackDuplicationInstruction(0));
		assert.equal(codeAfter, CODE_AFTER);
	});
	it("correctly parses a stack swap instruction", () => {
		const STACK_SWAP = SPACE + (NEWLINE + TAB);
		const CODE_AFTER = `\t \t`;
		const [instruction, codeAfter] = parser.parseInstruction(STACK_SWAP + CODE_AFTER);
		assert.deepEqual(instruction, new StackSwapInstruction());
		assert.equal(codeAfter, CODE_AFTER);
	});
	it("correctly parses a label instruction", () => {
		const LABEL_INSTRUCTION = NEWLINE + (SPACE + SPACE);
		const LABEL = `  \t\t \t  \t \t \n`;
		const CODE_AFTER = `\t \t`;
		const [instruction, codeAfter] = parser.parseInstruction(LABEL_INSTRUCTION + LABEL + CODE_AFTER);
		assert.deepEqual(instruction, new LabelInstruction(LABEL));
		assert.equal(codeAfter, CODE_AFTER);
	});
});
describe("StackDeletionInstruction.execute()", () => {
	it("deletes the correct number of items from the top of the stack", () => {
		const instruction = new StackDeletionInstruction(2);
		const state = new ProgramState([instruction], "");
		state.stack = [1, 2, 3, 4];
		instruction.execute(state);
		assert.deepEqual(state.stack, [1, 2]);
	});
});
