//valid JSON -{}
//invalid JSON- numbers,boolean,functions etc
function parser(input: string) {
	//get the total length or size of the JSON string input
	const length = input.length;
	//the current index
	let cursor = 0;

	if (input[cursor] === '{' && input[length - 1] === '}') {
		while (cursor < length) {
			console.log('Valid JSON');
		}
	}

	console.error('Invalid JSON:Error Parsing ' + input);
	process.exit(1);
}
parser('2');
