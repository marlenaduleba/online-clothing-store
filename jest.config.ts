import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  verbose: true,
  preset: 'ts-jest/presets/js-with-ts-esm', // Use ts-jest presets to handle TypeScript and ES Modules
  transform: {
    '^.+\\.ts?$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
  extensionsToTreatAsEsm: ['.ts'], // Treat .ts files as ESM
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Resolve issues with .js extensions
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'], // Add ts and tsx extensions
  testEnvironment: 'node', // Use Node.js test environment
  transformIgnorePatterns: [
    '/node_modules/', // Ignore transforming files in node_modules
    '\\.pnp\\.[^\\/]+$' // Ignore Yarn PnP (Plug'n'Play) files
  ],
};

export default config;
