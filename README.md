# JSON Validator and AST Parser

A powerful TypeScript-based JSON parser that not only validates JSON strings according to the JSON specification but also transforms them into a structured Abstract Syntax Tree (AST) format.
Handles edge cases like nested objects and arrays.

## USAGE
```javascript
JSONParser(`{"key": "value", "array": [1, 2, 3]}`)

//Output
{
  "type": "JSON",
  "properties": [
    {
      "key": "key",
      "value": "value"
    },
    {
      "key": "array",
      "value": {
        "type": "JSONArray",
        "elements": [
          1,
          2,
          3
        ]
      }
    }
  ]
}
```
