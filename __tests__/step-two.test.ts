var { parser } = require('../index');

describe('JSON parser', () => {
	it('Should parse Valid JSON string correctly', () => {
		expect(parser('{"key": "value"}')).toEqual({
			type: 'JSON',
			properties: [{ key: 'key', value: 'value' }],
		});
	});
	it('Should parse Valid JSON string correctly', () => {
		expect(parser('{"key": "value","key2": "value2"}')).toEqual({
			type: 'JSON',
			properties: [
				{ key: 'key', value: 'value' },
				{ key: 'key2', value: 'value2' },
			],
		});
	});
	// it('Should throw error for invalid JSON string', () => {
	// 	expect(() => {
	// 		parser('{"key": "value",}');
	// 	}).toThrow();
	// });
	// it('Should throw error for invalid JSON string', () => {
	// 	expect(() => {
	// 		parser('{"key: "value",key2: "value"}');
	// 	}).toThrow('Invalid JSON');
	// });
});
