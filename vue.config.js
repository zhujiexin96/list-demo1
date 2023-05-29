const isProduction = process.env.NODE_ENV === 'production';
const argv = require('minimist')(process.argv.slice(2));
const isAlpha = !!argv.v;
const vConsolePlugin = require('vconsole-webpack-plugin')
let force = false;

module.exports = {
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    if (isProduction) {
      // config.optimization.delete('splitChunks')
      config.optimization.minimize(true);
    }
  },
  configureWebpack: (config) => {

    if (force || (isProduction && !isAlpha)) { // 默认打包情况下去除vconsole
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }

    if (force || isAlpha) {
      let pluginsDev = [
        new vConsolePlugin({
          filter: [],
          enable: true
        })
      ]
      config.plugins = [...config.plugins, ...pluginsDev]
    }
  },
  productionSourceMap: false,
  publicPath: './',
  lintOnSave: false,
  // devServer: { // 反向代理实例
  //   hotOnly: true,
  //   proxy: {
  //     "/t": {
  //       target: "",
  //       changeOrigin: true,
  //       ws: true,
  //       pathRewrite: {
  //         '^/t': ''
  //       },
  //       onProxyRes(proxyRes, req, res) {
  //         const cookies = proxyRes.headers['set-cookie']
  //         if (cookies) {
  //           const newCookies = cookies.map(cookie => {
  //             return cookie.replace('.根域名', 'localhost')
  //           })
  //           delete proxyRes.headers['set-cookie']
  //           proxyRes.headers['set-cookie'] = newCookies
  //         }
  //       }
  //     },
  //   }
  // },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/assets/scss/global.scss";`
      },
    }
  },
}