const path = require('path');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

exports.getPWAConfig = (config, env) => {
  const isProd = env === 'prod';

  if (isProd) {
    config.plugins.push(
      new WorkboxWebpackPlugin.InjectManifest({
        swSrc: path.resolve(__dirname, '../src/serviceWorker.js'),
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      })
    );

    config.plugins.push(
      new CopyPlugin({
        patterns: [path.resolve(__dirname, '../public/static')],
      })
    );
  }
};
