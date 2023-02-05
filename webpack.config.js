// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: set ts=2 sw=2 et ai :

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env es2020, node */

const path = require('path');

module.exports = {
  mode: 'production',
  context: __dirname,
  target: ['web', 'es2021'],
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.d.ts', '.js'],
  },

  entry: {
    'background': {
      import: './src/background/index.ts',
      filename: 'background.js',
    },
    'api': {
      import: './src/api/index.ts',
      filename: 'api.js',
    },
    'start-zombie': {
      import: './src/start-zombie/index.ts',
      filename: 'start-zombie.js',
    },
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: 'ts-loader',
      },
    ],
  },
};
