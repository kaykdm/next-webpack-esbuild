const { ESBuildPlugin } = require('esbuild-loader')
module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(new ESBuildPlugin())
    const convertToESBuild = (obj) => {
      if (obj.loader === "next-babel-loader") {
        return {
          loader: 'esbuild-loader',
          options: {
            loader: 'jsx',
            target: 'es2015',
          }
        }
      }
      return obj;
    }
    const rule = config.module.rules[0];
    if (rule) {
      if (Array.isArray(rule.use)) {
        rule.use = rule.use.map(e => {
          if (typeof e === "object") {
            return convertToESBuild(e);
          }
          return e;
        })
      } else {
        rule.use = convertToESBuild(rule.use);
      }
    }
    return config
  },
}