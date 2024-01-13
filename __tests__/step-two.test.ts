var { parser } = require('../index');

describe('JSON parser', () => {
	let originalExit = () => {};
	beforeEach(() => {
		// Mock process.exit to prevent actual exit
		originalExit = process.exit;
		//@ts-expect-error
		process.exit = jest.fn();
	});

	afterEach(() => {
		// Restore original process.exit after each test
		//@ts-expect-error
		process.exit = originalExit;
	});
	it('Should parse Valid JSON string correctly', () => {
		expect(JSON.stringify(parser('{"key": "value"}'))).toBe(
			'{"type":"JSON","properties":[{"key":"key","value":"value"}]}'
		);
	});
	it('Should parse Valid JSON string correctly', () => {
		expect(JSON.stringify(parser('{"key": "value","key2": "value2"}'))).toBe(
			'{"type":"JSON","properties":[{"key":"key","value":"value"},{"key":"key2","value":"value2"}]}'
		);
	});
	it('Should exit for invalid JSON string', () => {
		parser('{"key": "value",}');
		expect(process.exit).toHaveBeenCalledWith(1);
	});
	it('Should exit for invalid JSON string', () => {
		parser('{"key: "value",key2: "value"}');
		expect(process.exit).toHaveBeenCalledWith(1);
	});
});
