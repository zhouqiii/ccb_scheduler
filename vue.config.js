const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  publicPath: './',
  // 后续开发直接改为生产包名
  outputDir: 'dist',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 直接覆盖变量
          'text-color': '#333333',
          'border-color': '#eee',
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: 'true; @import "/src/assets/css/theme.less";',
        },
      },
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/assets/css/mixin.less')], // 引入全局样式变量
    },
  },
  configureWebpack: (config) => {
    const con = config;
    con.name = 'scheduler';
  },
  chainWebpack(config) {
    // 1、webpack中本来有处理svg的rule，需要过滤掉icons/svg
    config.module.rule('svg')
      .exclude.add(resolve('src/assets/icons'));
    // 2、svg-loader配置
    config.module.rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons')).end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      });
  },
  devServer: {
    before(app) {
      console.log(app);
    },
  },
};
