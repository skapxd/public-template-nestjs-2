const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { tsConfigLoader } = require('tsconfig-paths/lib/tsconfig-loader');

module.exports = function (options) {
  return {
    // ...options,
    entry: './src/main.ts', // Adjust the entry file accordingly
    target: 'node',
    // tsConfigLoader: tsConfigLoader({ tsConfigPath: './tsconfig.server.json'}),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      ...options.module,
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    optimization: {
      ...(options.optimization?.module ?? {}),
      usedExports: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              unused: true,
              dead_code: true,
            },
          },
        }),
      ],
      sideEffects: false, // Enable side effects flag
      providedExports: true, // Enable provided exports flag
      usedExports: true, // Enable used exports flag
    },
  };
}
