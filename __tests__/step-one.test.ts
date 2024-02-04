var { parser } = require('../index');

describe('JSON parser', () => {
	//it('', () => {});
	it('Should parse valid JSON string', () => {
		expect(parser('5')).toBe(5);
	});
	it('Should parse valid JSON string', () => {
		expect(parser('"5"')).toBe('5');
	});
	it('Should parse valid JSON string', () => {
		expect(parser('true')).toBe(true);
	});
	it('Should parse valid JSON string', () => {
		expect(parser('false')).toBe(false);
	});
});
