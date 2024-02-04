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
	properties: (
		| {
				key: string;
				value: string | number | boolean | null | undefined | AST;
		  }
		| {
				type: 'JSONArray';
				elements: (string | number | boolean | null | undefined | AST)[];
		  }
	)[];
};

function tokenizer(input: string) {
	//get the total length or size of the JSON string input
	const length = input.length;
	//the current index
	let cursor = 0;
	const tokens: JsonToken[] = [];
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
			// if (input[cursor + 1] === '}') {
			// 	process.exit(1);
			// }
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
		// if (getChar() === '"') {
		// 	cursor++;
		// 	continue;
		// }
		// if (getChar() === "'") {
		// 	cursor++;
		// 	continue;
		// }

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
		const alphanumbericRegex = /[a-zA-Z0-9-\s]/i;
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
			while (cursor < length && alphanumbericRegex.test(getChar())) {
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
				//process.exit(1);
				throw new Error('Invalid JSON');
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
		cursor++;
		continue;

		//throw new TypeError('Unexpected Character: ' + getChar());
	}
	return tokens;
}

function JSONParser(input: string) {
	// const ast: any = {
	// 	type: 'JSON',
	// 	properties: [],
	// };
	const tokens = tokenizer(input);
	const stack: Array<
		{ type: 'ObjectStart'; value: '{' } | { type: 'ArrayStart'; value: '[' }
	> = [];
	//{[

	if (!tokens) return;
	//console.log(tokens);
	//console.log(tokens);
	let cursor = 0;
	const getToken = () => tokens[cursor];
	function stepper() {
		if (tokens[cursor + 1] !== undefined) {
			cursor++;
		}
	}
	function metClosingToken(type: 'ObjectEnd' | 'ArrayEnd') {
		const closingOpeningTokenMap = {
			ObjectEnd: 'ObjectStart',
			ArrayEnd: 'ArrayStart',
		};
		if (getToken().type === type) {
			const lastOpeningToken = stack.pop();
			if (lastOpeningToken === undefined) {
				//you can true an error
				throw new Error('Invalid JSON');
			}
			const { type: tokenType } = lastOpeningToken;
			return closingOpeningTokenMap[type] === tokenType;
		}
		return false;
	}

	function walk() {
		if (getToken().type === 'ArrayStart' && getToken().value === '[') {
			stack.push(getToken() as { type: 'ArrayStart'; value: '[' });
			const ast: any = {
				type: 'JSONArray',
				elements: [],
			};
			//stepper();
			if (tokens[cursor + 1].type === 'ArrayEnd') {
				stepper();
				stack.pop();
				return ast;
			}
			while (!metClosingToken('ArrayEnd')) {
				stepper();
				ast.elements.push(walk());
				stepper();
			}
			return ast;
		}
		if (getToken().type === 'ObjectStart' && getToken().value === '{') {
			//console.log(cursor, tokens.length);
			//we move pass the bracket and get the name of a key
			stack.push(getToken() as { type: 'ObjectStart'; value: '{' });
			const ast: AST = {
				type: 'JSON',
				properties: [],
			};
			//empty object
			if (tokens[cursor + 1].type === 'ObjectEnd') {
				stepper();
				stack.pop();
				return ast;
			}
			//the 3

			//let openingCursor = cursor;
			//0 , 3
			//map[openingCursor] = 77;
			//let cursorChange = 0;
			//4 ,4
			//console.log(cursor);
			//console.log(openingCursor);
			//console.log(cursor, tokens.length, getToken() === undefined);

			while (!metClosingToken('ObjectEnd')) {
				stepper();
				///checks here
				const { value } = getToken();
				if (typeof value !== 'string') {
					throw new TypeError('Unexpected Character:' + value?.toString());
				}
				const key = value;
				//console.log(key);
				stepper();
				//getToken();

				if (getToken().type !== 'Colon') {
					throw new TypeError(
						'Unexpected Character:' + getToken().value?.toString()
					);
				}
				stepper();
				ast.properties.push({
					key,
					value: walk(),
				});
				stepper();
			}
			return ast;
		}
		// if (getToken().type === 'String') {
		// 	const nodeValue = getToken().value as string;
		// 	const openingQuotePresent = nodeValue[0] === '"';
		// 	const closingQuotePresent = input[nodeValue.length - 1] === '"';
		// 	if (openingQuotePresent && closingQuotePresent) {
		// 		return nodeValue;
		// 	}
		// 	throw new Error('Invalid JSON');
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
		throw new TypeError('Unexpected Character:' + getToken()?.toString());
	}
	const res = walk();
	return res;
}

module.exports = {
	parser: JSONParser,
};
