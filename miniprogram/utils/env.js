/**
 * 小程序 window 垫片（模块注入模式）
 *
 * 微信 AppService 沙箱中，模块内的自由变量 window 无法通过 globalThis 定义，
 * 因此每个 vendor 渲染器文件头部都注入了一行：
 *   var window = require('<相对路径>/utils/env.js');
 * 渲染器源码（与 Web 端同源、零修改）中的 window.* 全部落到本模块导出的 shim 对象上。
 *
 * 注意：renderers.js 会整体替换 shim.CARD_TEMPLATES，
 * 读取必须通过 __get() / __helpers() 按需获取。
 */
var shim = {};

shim.__get = function () {
  return {
    single: shim.CARD_TEMPLATES || {},
    compare: shim.COMPARE_TEMPLATES || {},
    quote: shim.QUOTE_TEMPLATES || {},
    batch: shim.BATCH_TEMPLATES || {}
  };
};

shim.__helpers = function () { return shim.CARD_HELPERS; };

module.exports = shim;
