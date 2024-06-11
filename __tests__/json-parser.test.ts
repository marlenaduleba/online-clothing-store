import myJSONParse from "../src/json-parser.js";

/**
 * Test suite for the myJSONParse function.
 */
describe("myJSONParse", () => {
  // Test parsing a simple JSON object with various types of values.
  test("should parse a simple JSON object", () => {
    const jsonString = '{"name": "John", "age": 30, "city": "New York"}';
    const expectedObject = { name: "John", age: 30, city: "New York" };
    expect(myJSONParse(jsonString)).toEqual(expectedObject);
  });

  // Test parsing a JSON array of numbers.
  test("should parse a JSON array", () => {
    const jsonString = "[1, 2, 3, 4, 5]";
    const expectedArray = [1, 2, 3, 4, 5];
    expect(myJSONParse(jsonString)).toEqual(expectedArray);
  });

  // Test parsing nested JSON objects and arrays.
  test("should parse nested JSON objects and arrays", () => {
    const jsonString =
      '{"name": "John", "details": {"age": 30, "address": {"city": "New York", "zip": "10001"}}, "hobbies": ["reading", "travelling"]}';
    const expectedObject = {
      name: "John",
      details: {
        age: 30,
        address: {
          city: "New York",
          zip: "10001",
        },
      },
      hobbies: ["reading", "travelling"],
    };
    expect(myJSONParse(jsonString)).toEqual(expectedObject);
  });

  // Test parsing JSON with boolean and null values.
  test("should parse JSON with boolean and null values", () => {
    const jsonString = '{"isActive": true, "isAdmin": false, "profile": null}';
    const expectedObject = { isActive: true, isAdmin: false, profile: null };
    expect(myJSONParse(jsonString)).toEqual(expectedObject);
  });

  // Test parsing JSON with integer, floating-point, and negative numbers.
  test("should parse JSON with numbers", () => {
    const jsonString = '{"int": 10, "float": 10.5, "negative": -10}';
    const expectedObject = { int: 10, float: 10.5, negative: -10 };
    expect(myJSONParse(jsonString)).toEqual(expectedObject);
  });

  // Test that an error is thrown for invalid JSON input.
  test("should throw an error for invalid JSON input", () => {
    const jsonString = '{"name": "John", "age": 30, "city": "New York"';
    expect(() => myJSONParse(jsonString)).toThrow(SyntaxError);
  });

  // Test parsing empty JSON object and array.
  test("should parse empty JSON object and array", () => {
    const emptyObject = "{}";
    const emptyArray = "[]";
    expect(myJSONParse(emptyObject)).toEqual({});
    expect(myJSONParse(emptyArray)).toEqual([]);
  });

  // Test parsing JSON with escaped characters in strings.
  test("should parse JSON with escaped characters in strings", () => {
    const jsonString =
      '{"quote": "He said \\"Hello, world!\\"", "backslash": "This is a backslash: \\\\", "newline": "This is a newline: \\n"}';
    const expectedObject = {
      quote: 'He said "Hello, world!"',
      backslash: "This is a backslash: \\",
      newline: "This is a newline: \n",
    };
    expect(myJSONParse(jsonString)).toEqual(expectedObject);
  });

  // Test parsing JSON with Unicode escapes.
  test("should parse JSON with Unicode escapes", () => {
    const jsonString = '{"unicode": "\\u0048\\u0065\\u006C\\u006C\\u006F"}';
    const expectedObject = { unicode: "Hello" };
    expect(myJSONParse(jsonString)).toEqual(expectedObject);
  });

  // Test parsing JSON with a custom reviver function.
  test("should parse JSON with a custom reviver function", () => {
    const jsonString =
      '{"name": "John", "age": 30, "unicode": "\\u0048\\u0065\\u006C\\u006C\\u006F"}';
    const reviver = (key: any, value: any) => {
      if (key === "age") {
        return value + 1; // Increment age by 1
      }
      if (key === "unicode") {
        return value.toUpperCase(); // Convert unicode to uppercase
      }
      return value;
    };
    const expectedObject = { name: "John", age: 31, unicode: "HELLO" };
    expect(myJSONParse(jsonString, reviver)).toEqual(expectedObject);
  });
});
