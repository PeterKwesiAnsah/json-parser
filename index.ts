'use strict';

//valid JSON -{}
//invalid JSON- numbers,boolean,functions etc

// Define a union type for all possible token types
type JsonToken =
	| { type: 'ObjectStart'; value: '{' }
	| { type: 'ObjectEnd'; value: '}' }
	| { type: 'ArrayStart'; value: '[' }
	| { type: 'ArrayEnd'; value: ']' }
	| { type: 'Colon'; value: ':' }
	| { type: 'Comma'; value: ',' }
	| { type: 'String'; value: string }
	| { type: 'Number'; value: number }
	| { type: 'Boolean'; value: boolean }
	| { type: 'Null'; value: null };

type values = {
	type: 'JSONString';
	value: string;
};

type AST = {
	type: 'JSON';
	properties:
		| values
		| {
				key: string;
				value: values;
		  }[];
};

function tokenizer(input: string) {
	//get the total length or size of the JSON string input
	const length = input.length;
	//the current index
	let cursor = 0;
	const tokens: JsonToken[] = [];

	if (input[cursor] === '{' && input[length - 1] === '}') {
		while (cursor < length) {
			//{"key": "value"}
			let getChar = () => input[cursor];
			if (getChar() === '{') {
				tokens.push({
					type: 'ObjectStart',
					value: '{',
				});
				cursor++;
				continue;
			}
			if (getChar() === ',') {
				//const nextCharValidRegix = /[a-zA-Z0-9"]/i;
				if (input[cursor + 1] === '}') {
					process.exit(1);
				}
				tokens.push({
					type: 'Comma',
					value: ',',
				});
				cursor++;
				continue;
			}
			if (getChar() === ':') {
				tokens.push({
					type: 'Colon',
					value: ':',
				});
				cursor++;
				continue;
			}
			if (getChar() === '}') {
				tokens.push({
					type: 'ObjectEnd',
					value: '}',
				});
				cursor++;
				continue;
			}
			let WHITESPACE = /\s/;
			if (WHITESPACE.test(getChar())) {
				cursor++;
				continue;
			}
			if (getChar() === '"') {
				cursor++;
				continue;
			}

			// We'll start by checking for the opening quote:
			// if (char === '"') {
			// 	// Keep a `value` variable for building up our string token.
			// 	let value = '';

			// 	// We'll skip the opening double quote in our token.
			// 	char = input[++cursor];

			// 	// Then we'll iterate through each character until we reach another
			// 	// double quote.
			// 	while (char !== '"') {
			// 		value += char;
			// 		char = input[++cursor];
			// 	}

			// 	// Skip the closing double quote.
			// 	char = input[++cursor];

			// 	// And add our `string` token to the `tokens` array.
			// 	tokens.push({ type: 'String', value });

			// 	continue;
			// }

			// Finally if we have not matched a character by now, we're going to throw
			// an error and completely exit.
			//char=e,cursor=3
			//k e y
			//2 3 4
			const alphanumbericRegex = /[a-zA-Z0-9]/i;
			if (alphanumbericRegex.test(getChar())) {
				let firstCharCursor = cursor;
				let string = '';
				// const openingQuotePresent = input[cursor - 1] === '"';
				// if (!openingQuotePresent) {
				// 	process.exit(1);
				// 	//throw new Error('Unexpected Character: ' + getChar());
				// }
				while (alphanumbericRegex.test(getChar())) {
					string = string + getChar();
					cursor = cursor + 1;
				}
				if (isNaN(string as unknown as any)) {
					//string
					const closingQuotePresent = getChar() === '"';
					const openingQuotePresent = input[firstCharCursor - 1] === '"';
					if (!closingQuotePresent && !openingQuotePresent) {
						process.exit(1);
					}
				}
				// const closingQuotePresent = getChar() === '"';
				// if (!closingQuotePresent) {
				// 	process.exit(1);
				// 	//throw new Error('Unexpected Character: ' + getChar());
				// }
				tokens.push({
					type: 'String',
					value: string,
				});

				continue;
			}

			throw new TypeError('Unexpected Character: ' + getChar());
		}
		return tokens;
	} else {
		//console.error('Invalid JSON:Error Parsing ' + input);
		process.exit(1);
	}
}

function JSONParser(input: string) {
	const ast: any = {
		type: 'JSON',
		properties: [],
	};
	const tokens = tokenizer(input);
	if (!tokens) return;

	let cursor = 0;
	const getToken = () => tokens[cursor];
	function walk(): any {
		/**
		 *
		 * {name:'peter'} ===> [
		 * { type: 'ObjectStart', value: '{' },{ type: 'String', value: 'name' },     ===> {key:'name',value:'peter'}
		 * { type: 'Colon', value: ':' },{ type: 'String', value: 'peter' },
		 * { type: 'Comma', value: ',' },{ type: 'String', value: 'name' }
		 * ]
		 * {age:12,info:{name:'peter'}} ===> {key:'age',value:12,key:'info',value:{key:'name',value:'peter'}}
		 */

		if (
			getToken().type === 'String' &&
			tokens[cursor - 1].type === 'Comma' &&
			tokens[cursor + 1].type === 'Colon'
		) {
			const key = getToken().value;
			//cursor: 1-first walk iteration
			//console.log(key);
			let value = null;
			while (getToken().type !== 'ObjectEnd' && getToken().type !== 'Comma') {
				cursor++;
				//console.log(cursor);
				//cursor: 2 first walk iteration
				if (getToken().type === 'Colon') {
					cursor++;
					//cursor: 3 first walk iteration
					//continue;
				}
				value = walk();
				//properties.push(walk());
				//console.log(getToken());
			}
			return {
				key,
				value,
			};
		}

		// if(getToken().type==='Comma'){
		//     cursor++
		// }
		//cursor: 0
		//'{"nationality":{"kofi":"bad","lastname":"ansah"}}'
		if (getToken().type === 'ObjectStart' && getToken().value == '{') {
			//we move pass the bracket and get the name of a key
			cursor++;
			const key = getToken().value;
			//cursor: 1-first walk iteration
			let value = null;
			while (getToken().type !== 'ObjectEnd' && getToken().type !== 'Comma') {
				cursor++;
				//cursor: 2 first walk iteration
				if (getToken().type === 'Colon') {
					cursor++;
					//cursor: 3 first walk iteration
					//continue;
				}
				value = walk();
			}
			return {
				key,
				value,
			};
		}
		if (getToken().type === 'Colon' && getToken().value === ':') {
			cursor++;
			return {
				type: 'JSONString',
				value: getToken().value,
			};
		}
		if (getToken().type === 'String') {
			const nodeValue = getToken().value;
			cursor++;
			return nodeValue;
		}
		// if (getToken().type === 'ObjectEnd') {
		// 	cursor++;
		// }
		//console.log(getToken());
		//cursor++;
		//throw new TypeError('Cant recognize' + getToken().value);
		//return getToken().value;
		//return numbers/boolean/strings/null as they are
	}
	while (cursor < tokens.length) {
		const property = walk();
		//console.log(property);
		ast.properties.push(property);
		cursor++;
		//cursor should be 5 at the end
		//walk should not produced undefined
	}
	//console.log(ast.properties.length);
	return ast;
}
//console.log(JSON.stringify(JSONParser('{"key": "value"}')));
module.exports = {
	parser: JSONParser,
};
// console.log(
// 	parser(tokenizer('{"kofi":"bad","lastname":"ansah","age":"Twelve"}'))
// );
