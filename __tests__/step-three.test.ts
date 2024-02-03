var { parser } = require('../index');

describe('JSON parser', () => {
	it('Should parse Valid JSON string correctly', () => {
		expect(
			parser(
				`{"key1": true,"key2": false,"key3": null,"key4": "value","key5": 101}`
			)
		).toEqual({
			type: 'JSON',
			properties: [
				{ key: 'key1', value: true },
				{ key: 'key2', value: false },
				{ key: 'key3', value: null },
				{ key: 'key4', value: 'value' },
				{ key: 'key5', value: 101 },
			],
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
	it('Should parse Valid JSON string correctly', () => {
		expect(
			parser(
				`{"key": {"key2": "value2","key2": {"key3": "value3","key4": "value4"}},"key5": "value5"}`
			)
		).toEqual({
			type: 'JSON',
			properties: [
				{
					key: 'key',
					value: {
						type: 'JSON',
						properties: [
							{
								key: 'key2',
								value: 'value2',
							},
							{
								key: 'key2',
								value: {
									type: 'JSON',
									properties: [
										{
											key: 'key3',
											value: 'value3',
										},
										{
											key: 'key4',
											value: 'value4',
										},
									],
								},
							},
						],
					},
				},
				{
					key: 'key5',
					value: 'value5',
				},
			],
		});
	});
	// it('Should throw error for invalid JSON string', () => {
	// 	expect(() => {
	// 		parser(
	// 			'{"key1": true,"key2": False,"key3": null,"key4": "value","key5": 101}}'
	// 		);
	// 	}).toThrow();
	// });
	// it('Should exit for invalid JSON string', () => {
	// 	parser('{"key: "value",key2: "value"}');
	// 	expect(process.exit).toHaveBeenCalledWith(1);
	// });
});
