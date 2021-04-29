const path = require('path');

module.exports = {
  entry: ['./src/index.tsx'],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  output: {
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname, './'),
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/typescript', '@babel/preset-env'],
            plugins: ['@babel/proposal-class-properties'],
          },
        },
      },
      {
        test: /.tsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/typescript', '@babel/preset-react', '@babel/preset-env'],
            plugins: ['babel-plugin-styled-components'],
          },
        },
      },
    ],
  },
  devServer: {
    port: 8080,
  },
};
