/**
 * 星风暴人物卡片生成器 · 小程序入口
 * 启动时通过环境垫片加载全部 40 个模板渲染器（与 Web 端共用同一份源码）。
 */
const env = require('./utils/env.js');
require('./vendor/index.js');

App({
  globalData: {
    env: env,
    schema: require('./utils/schema.js')
  }
});
