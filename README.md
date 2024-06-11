# JSON Parser

This repository contains an implementation of a custom JSON parser in TypeScript. The project demonstrates how to parse JSON strings using regular expressions and build a corresponding JavaScript object.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installing

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies

```sh
npm install
```

### Building the Project

```sh
npm run build
```

### Running the Project

```sh
npm start
```

### Running the Tests

```sh
npm test
```

## Features

- Parses JSON strings into JavaScript objects.
- Supports nested objects and arrays.
- Handles boolean values, null, and numbers (including negative and floating-point numbers).
- Processes Unicode escape sequences.
- Allows custom transformations using a reviver function.

## Reflection

Implementing the `myJSONParse` function was a challenging yet rewarding experience. One of the primary challenges was handling various JSON features such as nested structures, different data types, and escape sequences using regular expressions. To address these challenges, I incrementally built and tested the function, ensuring that each component (tokenization and parsing) worked correctly before moving on to the next.

Extending the function to support a custom reviver function and handling Unicode escapes added complexity but also made the parser more versatile and closer in functionality to the native `JSON.parse`. This project has deepened my understanding of both regular expressions and the intricacies of JSON parsing.

## Authors

- Marlena Dulęba

## License

- This project is licensed under the ISC License.
