const { getLoader, loaderByName } = require("@craco/craco");

const mdxPlugin = {
  overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
    const { isFound, match: babelLoader } = getLoader(webpackConfig, loaderByName("babel-loader"));

    const mdxExtension = /\.mdx?$/;

    webpackConfig.module.rules.map(rule => {
      if (typeof rule.test !== 'undefined' || typeof rule.oneOf === 'undefined') {
        return rule
      }

      rule.oneOf.unshift({
        test: mdxExtension,
        use: [
          {
            loader: babelLoader.loader.loader,
            options: babelLoader.loader.options
          },
          {
            loader: require.resolve('mdx-loader'),
            options: {}
          }
        ]
      })

      return rule
    });

    const { isFound: isFoundF, match: fileLoaderMatch } = getLoader(
      webpackConfig,
      loaderByName("file-loader")
    );
    if (!isFoundF) {
      throwError(
        "Can't find file-loader in the webpack config!",
        "webpack+file-loader"
      );
    }
    fileLoaderMatch.loader.exclude.push(mdxExtension);

    // console.log(JSON.stringify(webpackConfig.module.rules, null, 4));
    // process.exit(0);

    // Always return the config object.
    return webpackConfig;
  }
};

module.exports = {
  plugins: [
    { plugin: mdxPlugin, options: {} }
  ]
}

