/**
 * 星风暴人物卡片生成器 · 小程序入口
 * 启动时加载全部 40 个模板渲染器（与 Web 端共用同一份源码，
 * 渲染器内的 window 由 utils/env.js 垫片承接）。
 */
const shim = require('./utils/env.js');
require('./vendor/index.js');

App({
  globalData: {
    env: {
      get: shim.__get,
      helpers: shim.__helpers
    }
  }
});
