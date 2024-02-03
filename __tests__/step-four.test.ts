var { parser } = require('../index');

describe('JSON parser', () => {
	it('Should parse Valid JSON string correctly', () => {
		expect(
			parser(`{"key": "value","key-n": 101,"key-o": {},"key-l": []}`)
		).toEqual({
			type: 'JSON',
			properties: [
				{ key: 'key', value: 'value' },
				{ key: 'key-n', value: 101 },
				{ key: 'key-o', value: { type: 'JSON', properties: [] } },
				{
					key: 'key-l',
					value: {
						type: 'JSONArray',
						elements: [],
					},
				},
			],
		});
	});
	it('Should parse Valid JSON string correctly', () => {
		expect(
			parser(
				`{"key": "value","key-n": 101,"key-o": {"inner key": "inner value"},"key-l": ["list value"]}`
			)
		).toEqual({
			type: 'JSON',
			properties: [
				{ key: 'key', value: 'value' },
				{ key: 'key-n', value: 101 },
				{
					key: 'key-o',
					value: {
						type: 'JSON',
						properties: [{ key: 'inner key', value: 'inner value' }],
					},
				},
				{
					key: 'key-l',
					value: {
						type: 'JSONArray',
						elements: ['list value'],
					},
				},
			],
		});
	});
	it('Should throw Error for invalid JSON string', () => {
		expect(() =>
			parser(
				`{"key": "value","key-n": 101,"key-o": {"inner key": "inner value"},"key-l": ['list value']}`
			)
		).toThrow();
	});
});
