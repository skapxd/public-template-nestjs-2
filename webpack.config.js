module.exports = function (options) {
  return {
    ...options,
    module: {
      ...options.module,
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };
};
