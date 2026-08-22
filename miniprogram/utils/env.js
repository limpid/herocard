/**
 * 微信小程序环境垫片
 * 渲染器（vendor/ 目录下的 41 个文件）以 IIFE 方式挂载到 window 全局对象，
 * 小程序 AppService 没有浏览器 window，这里通过 globalThis 提供等价垫片，
 * 使渲染器源码可以与 Web 端完全一致、零修改复用。
 *
 * 注意：renderers.js 会整体替换 window.CARD_TEMPLATES，
 * 因此所有引用必须通过 get() 按需获取，不能缓存静态引用。
 */
(function () {
  'use strict';

  var host = typeof globalThis !== 'undefined'
    ? globalThis
    : (typeof global !== 'undefined' ? global : {});

  if (typeof host.window === 'undefined') {
    host.window = host;
  }

  module.exports = {
    host: host,
    get: function () {
      return {
        single: host.window.CARD_TEMPLATES || {},
        compare: host.window.COMPARE_TEMPLATES || {},
        quote: host.window.QUOTE_TEMPLATES || {},
        batch: host.window.BATCH_TEMPLATES || {}
      };
    },
    helpers: function () { return host.window.CARD_HELPERS; },
    palettes: function () { return host.window.CARD_PALETTES; }
  };
})();
