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
		expect(
			JSON.stringify(
				parser(
					`{"key1": true,"key2": false,"key3": null,"key4": "value","key5": 101}`
				)
			)
		).toBe(
			`{"type":"JSON","properties":[{"key":"key1","value":true},{"key":"key2","value":false},{"key":"key3","value":null},{"key":"key4","value":"value"},{"key":"key5","value":101}]}`
		);
	});
	// it('Should parse Valid JSON string correctly', () => {
	// 	expect(JSON.stringify(parser('{"key": "value","key2": "value2"}'))).toBe(
	// 		'{"type":"JSON","properties":[{"key":"key","value":"value"},{"key":"key2","value":"value2"}]}'
	// 	);
	// });
	it('Should exit for invalid JSON string', () => {
		parser(
			'{"key1": true,"key2": False,"key3": null,"key4": "value","key5": 101}}'
		);
		expect(process.exit).toHaveBeenCalledWith(1);
	});
	// it('Should exit for invalid JSON string', () => {
	// 	parser('{"key: "value",key2: "value"}');
	// 	expect(process.exit).toHaveBeenCalledWith(1);
	// });
});
