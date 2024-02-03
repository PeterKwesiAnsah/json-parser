var { parser } = require('../index');
describe('JSON Parser', () => {
	it('Should parse Valid JSON string correctly', () => {
		expect(parser('{"name": "John", "age": 30, "city": "New York"}')).toEqual({
			type: 'JSON',
			properties: [
				{ key: 'name', value: 'John' },
				{ key: 'age', value: 30 },
				{ key: 'city', value: 'New York' },
			],
		});
	});
	it('Should parse Valid JSON string correctly', () => {
		expect(parser('[1, 2, 3, 4, 5]')).toEqual({
			type: 'JSONArray',
			elements: [1, 2, 3, 4, 5],
		});
	});
	it('Should parse Valid JSON string correctly', () => {
		expect(
			parser('{"person": {"name": "Alice", "age": 25}, "scores": [90, 85, 92]}')
		).toEqual({
			type: 'JSON',
			properties: [
				{
					key: 'person',
					value: {
						type: 'JSON',
						properties: [
							{
								key: 'name',
								value: 'Alice',
							},
							{
								key: 'age',
								value: 25,
							},
						],
					},
				},
				{
					key: 'scores',
					value: {
						type: 'JSONArray',
						elements: [90, 85, 92],
					},
				},
			],
		});
	});
	it('Should parse Valid JSON string correctly', () => {
		expect(parser('{"enabled":true,"flag":false,"status":null}')).toEqual({
			type: 'JSON',
			properties: [
				{
					key: 'enabled',
					value: true,
				},
				{
					key: 'flag',
					value: false,
				},
				{
					key: 'status',
					value: null,
				},
			],
		});
	});
});
