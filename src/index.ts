import myJSONParse from "./json-parser.js";

/**
 * Demonstrates the usage of the myJSONParse function with a complex JSON string.
 */
function main() {
  const jsonString = `
    {
        "name": "John Doe",
        "age": 30,
        "isAdmin": false,
        "courses": ["Math", "Science", "History"],
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "zipcode": "12345"
        },
        "scores": {
            "math": 95,
            "science": 88.5,
            "history": 92,
            "english": null
        },
        "graduated": null,
        "comments": "He said, \\"Hello, world!\\" with a smile.\\nThis is a multiline comment.",
        "unicode": "\\u0048\\u0065\\u006C\\u006C\\u006F"
    }`;

  const reviver = (key: any, value: any) => {
    if (typeof value === "string" && key === "unicode") {
      return value.toUpperCase(); // Example transformation
    }
    return value;
  };

  try {
    const jsonObject = myJSONParse(jsonString, reviver);
    console.log("Parsed JSON object:", jsonObject);
  } catch (error) {
    console.error("Error parsing JSON string:", error);
  }
}

main();
