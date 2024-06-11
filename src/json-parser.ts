/**
 * Parses a JSON-formatted string into a JavaScript object, with support for Unicode escapes and a custom reviver function.
 * @param {string} jsonString - The JSON string to parse.
 * @param {Function} [reviver] - An optional function that transforms the results. This function is called for each member of the object.
 * @returns {any} - The parsed JavaScript object.
 * @throws {SyntaxError} - Throws an error if the JSON string is invalid.
 */
function myJSONParse(
  jsonString: string,
  reviver?: (key: any, value: any) => any
): any {
  // Tokenization using regular expressions
  const tokens: string[] = [];
  const regex =
    /"(?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})|[^"\\])*"|true|false|null|-?[0-9]+(?:\.[0-9]+)?|\[|\]|\{|\}|:|,/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(jsonString)) !== null) {
    tokens.push(match[0]);
  }

  // Parsing algorithm to process tokens and construct the JavaScript object
  const parseValue = (): any => {
    const token = tokens.shift();
    if (token === undefined)
      throw new SyntaxError("Unexpected end of JSON input");

    switch (token) {
      case "true":
        return true;
      case "false":
        return false;
      case "null":
        return null;
      case "[": {
        const arr: any[] = [];
        while (tokens[0] !== "]") {
          arr.push(parseValue());
          if (tokens[0] === ",") tokens.shift();
        }
        tokens.shift(); // Remove the closing ']'
        return arr;
      }
      case "{": {
        const obj: Record<string, any> = {};
        while (tokens[0] !== "}") {
          const key = parseValue();
          if (typeof key !== "string")
            throw new SyntaxError("Expected a string key");
          if (tokens.shift() !== ":")
            throw new SyntaxError('Expected ":" after key');
          obj[key] = parseValue();
          if (tokens[0] === ",") tokens.shift();
        }
        tokens.shift(); // Remove the closing '}'
        return obj;
      }
      default: {
        if (/^"(?:\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})|[^"\\])*"$/.test(token)) {
          return JSON.parse(token); // Use native JSON.parse to handle escapes correctly
        }
        if (/^-?[0-9]+(?:\.[0-9]+)?$/.test(token)) return Number(token);
        throw new SyntaxError(`Unexpected token: ${token}`);
      }
    }
  };

  const parsedObject = parseValue();

  // Apply reviver function if provided
  const applyReviver = (holder: any, key: any): any => {
    const value = holder[key];
    if (value && typeof value === "object") {
      for (const k in value) {
        if (Object.prototype.hasOwnProperty.call(value, k)) {
          value[k] = applyReviver(value, k);
        }
      }
    }
    return reviver ? reviver.call(holder, key, value) : value;
  };

  return reviver ? applyReviver({ "": parsedObject }, "") : parsedObject;
}

export default myJSONParse;
