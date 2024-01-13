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
	it('Should exit for invalid JSON string', () => {
		parser('5');
		expect(process.exit).toHaveBeenCalledWith(1);
	});
});
