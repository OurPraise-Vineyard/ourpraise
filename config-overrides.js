/* eslint-disable-next-line */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  webpack: function (config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        plugins: [new TsconfigPathsPlugin()]
      }
    }
  }
}
