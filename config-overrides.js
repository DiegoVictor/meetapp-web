const { addBabelPlugin, override } = require('customize-cra');

module.exports = {
  webpack: override(
    addBabelPlugin([
      'babel-plugin-root-import',
      {
        rootPathSuffix: 'src',
      },
    ])
  ),
};
