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
				// console.log(input[cursor + 1]);
				if (input[cursor + 1] === '}') {
					process.exit(1);
				}
				// if (input[cursor + 1] === '}') {
				// 	return;
				// }
				//console.log('why');
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
			if (getChar() === '[') {
				tokens.push({
					type: 'ArrayStart',
					value: '[',
				});
				cursor++;
				continue;
			}
			if (getChar() === ']') {
				tokens.push({
					type: 'ArrayEnd',
					value: ']',
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
				const trueBooleanString = 'true';
				const falseBooleanString = 'false';
				const nullString = 'null';
				// const openingQuotePresent = input[cursor - 1] === '"';
				// if (!openingQuotePresent) {
				// 	process.exit(1);
				// 	//throw new Error('Unexpected Character: ' + getChar());
				// }
				while (alphanumbericRegex.test(getChar())) {
					string = string + getChar();
					cursor = cursor + 1;
				}
				const closingQuotePresent = getChar() === '"';
				const openingQuotePresent = input[firstCharCursor - 1] === '"';
				if (isNaN(string as unknown as any)) {
					//string

					if (
						string === trueBooleanString ||
						string === falseBooleanString ||
						string === nullString
					) {
						const typeDic: {
							true: { type: 'Boolean'; value: boolean };
							false: { type: 'Boolean'; value: boolean };
							null: { type: 'Null'; value: null };
						} = {
							[trueBooleanString]: {
								type: 'Boolean',
								value: true,
							},
							[falseBooleanString]: {
								type: 'Boolean',
								value: false,
							},
							[nullString]: {
								type: 'Null',
								value: null,
							},
						};
						if (!closingQuotePresent && !openingQuotePresent) {
							const token = typeDic[string];
							tokens.push(token);
							continue;
						}
					}
				} else if (!isNaN(string as unknown as any)) {
					if (!closingQuotePresent && !openingQuotePresent) {
						//const token = typeDic[string];
						tokens.push({
							type: 'Number',
							value: parseInt(string),
						});
						continue;
					}
				}

				if (!closingQuotePresent && !openingQuotePresent) {
					process.exit(1);
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

			//throw new TypeError('Unexpected Character: ' + getChar());
		}
		return tokens;
	} else {
		//console.error('Invalid JSON:Error Parsing ' + input);
		process.exit(1);
	}
}

function JSONParser(input: string) {
	// const ast: any = {
	// 	type: 'JSON',
	// 	properties: [],
	// };
	const tokens = tokenizer(input);
	if (!tokens) return;
	//console.log(tokens);

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
		//console.log(getToken(), 'token');
		// if (
		// 	tokens &&
		// 	getToken().type === 'String' &&
		// 	tokens[cursor - 1].type === 'Comma' &&
		// 	tokens[cursor + 1].type === 'Colon'
		// ) {
		// 	console.log('here');
		// 	const key = getToken().value;
		// 	//cursor: 1-first walk iteration
		// 	//console.log(key);
		// 	let value = null;
		// 	while (getToken().type !== 'ObjectEnd' && getToken().type !== 'Comma') {
		// 		cursor++;
		// 		//console.log(cursor);
		// 		//cursor: 2 first walk iteration
		// 		if (getToken().type === 'Colon') {
		// 			cursor++;
		// 			//cursor: 3 first walk iteration
		// 			//continue;
		// 		}
		// 		value = walk();
		// 		//properties.push(walk());
		// 		//console.log(getToken());
		// 	}
		// 	return {
		// 		key,
		// 		value,
		// 	};
		// }

		// if (getToken().type === 'Comma') {
		// 	cursor++;
		// }
		//cursor: 0
		//'{"nationality":{"kofi":"bad","lastname":"ansah"}}'
		// if(getToken().type==='Comma'){
		// 	cursor++
		// }
		if (getToken().type === 'ObjectStart' && getToken().value == '{') {
			//we move pass the bracket and get the name of a key
			const ast: any = {
				type: 'JSON',
				properties: [],
			};

			let openingCursor = cursor;
			let cursorChange = 0;
			const metClosingTag = () =>
				getToken().type === 'ObjectEnd' &&
				openingCursor + cursorChange === cursor;

			//{"key": {"key2": "value2"},"key2":false}
			//0       3                78   9   10 11 12
			//cursor: 1-first walk iteration
			//let value = null;
			while (!metClosingTag()) {
				cursor++;
				cursorChange++;
				if (!getToken()) return ast;
				const key = getToken().value;

				//console.log(getToken());
				cursor++;
				cursorChange++;
				//cursor: 2 first walk iteration
				if (getToken() && getToken().type === 'Colon') {
					cursor++;
					cursorChange++;
					//cursor: 3 first walk iteration
					//continue;
				}
				ast.properties.push({
					key,
					value: walk(),
				});
				cursor++;
				cursorChange++;
				//cursor++;
				// while (tokens[cursor + 1]?.type === 'ObjectEnd') {
				// 	cursor++;
				// 	continue;
				// }
				//value = walk();
				//console.log(cursor);
			}
			return ast;
		}
		// if (getToken().type === 'Colon' && getToken().value === ':') {
		// 	cursor++;
		// 	return {
		// 		type: 'JSONString',
		// 		value: getToken().value,
		// 	};
		// }
		if (
			getToken().type === 'String' ||
			getToken().type === 'Boolean' ||
			getToken().type === 'Null' ||
			getToken().type === 'Number'
		) {
			const nodeValue = getToken().value;
			return nodeValue;
		}

		//throw new Error('Unexpected Token');
		//this line should throw an error , because we don't know what it is
		//
		// if (getToken().type === 'ObjectEnd') {
		// 	cursor++;
		// }
		//console.log(getToken());
		//cursor++;
		//throw new TypeError('Cant recognize' + getToken().value);
		//return getToken().value;
		//return numbers/boolean/strings/null as they are
	}

	// let res = null;
	// while (cursor < tokens.length) {
	// 	//this a temporal fix to the undefined
	// 	//walk should not return undefined
	// 	const result = walk();
	// 	//console.log(result);
	// 	res = result;
	// 	console.log(result);
	// 	//console.log(JSON.stringify(res, null, 2));
	// 	//console.log(res);
	// 	cursor++;

	// 	//console.log(property);
	// 	//ast.properties.push(property);

	// 	//cursor should be 5 at the end
	// 	//walk should not produced undefined
	// }
	//console.log(ast.properties.length);
	return walk();
}
//JSONParser('{"key": {"key2": "value2"}}');
console.log(JSON.stringify(JSONParser(`{"key": {"key2": "value2"}}`), null, 2));
//console.log(JSON.stringify(JSONParser('{"key": "value"}')));
module.exports = {
	parser: JSONParser,
};
// console.log(
// 	parser(tokenizer('{"kofi":"bad","lastname":"ansah","age":"Twelve"}'))
// );

//{\"type\":\"JSON\",\"properties\":[{\"key\":\"key1\",\"value\":true},{\"key\":\",\",\"value\":{\"key\":\"key2\",\"value\":false}},{\"key\":\",\",\"value\":{\"key\":\"key3\",\"value\":null}},{\"key\":\",\",\"value\":{\"key\":\"key4\",\"value\":\"value\"}},{\"key\":\",\",\"value\":{\"key\":\"key5\",\"value\":101}}]}
