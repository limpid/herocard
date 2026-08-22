/**
 * 星风暴人物卡片生成器 · 小程序入口
 * 启动时加载全部 40 个模板渲染器（与 Web 端共用同一份源码，
 * 渲染器内的 window 由 utils/env.js 垫片承接）。
 *
 * 使用计数逻辑内联于此（曾因工具打包剔除独立模块文件导致
 * "module not defined"，入口文件必定打包，可彻底规避）。
 */
const shim = require('./utils/env.js');
require('./vendor/index.js');

/* ---------- 使用计数（原 utils/usage.js，网络失败不影响使用） ---------- */
const API_URL = 'https://www.jxynstar.com/mp-api/usage';
const LOCAL_KEY = 'herocard-usage-local';
const REMOTE_KEY = 'herocard-usage-remote';

function readLocal() {
  try { return wx.getStorageSync(LOCAL_KEY) || {}; } catch (e) { return {}; }
}

function readRemote() {
  try { return wx.getStorageSync(REMOTE_KEY) || {}; } catch (e) { return {}; }
}

function writeRemote(map) {
  try { wx.setStorageSync(REMOTE_KEY, map); } catch (e) { /* 忽略 */ }
}

const usage = {
  /** 显示计数：后端全局数优先，本地数兜底 */
  display: function (group, tpl) {
    const key = group + ':' + tpl;
    const remote = readRemote();
    if (remote[key] !== undefined) return remote[key];
    return readLocal()[key] || 0;
  },

  /** 记录一次使用：本地立即 +1，异步上报后端（失败静默） */
  record: function (group, tpl) {
    const key = group + ':' + tpl;
    const local = readLocal();
    local[key] = (local[key] || 0) + 1;
    try { wx.setStorageSync(LOCAL_KEY, local); } catch (e) { /* 忽略 */ }

    wx.request({
      url: API_URL,
      method: 'POST',
      data: { group: group, tpl: tpl },
      timeout: 4000,
      success: function (res) {
        if (res.statusCode === 200 && res.data && res.data.ok) {
          const remote = readRemote();
          remote[key] = res.data.count;
          writeRemote(remote);
        }
      },
      fail: function () { /* 网络失败不影响使用 */ }
    });
  },

  /** 拉取后端全量计数（成功写缓存，失败返回 null） */
  fetchAll: function () {
    return new Promise(function (resolve) {
      wx.request({
        url: API_URL,
        method: 'GET',
        timeout: 4000,
        success: function (res) {
          if (res.statusCode === 200 && res.data && res.data.ok) {
            const map = res.data.data || {};
            writeRemote(map);
            resolve(map);
          } else {
            resolve(null);
          }
        },
        fail: function () { resolve(null); }
      });
    });
  }
};

App({
  globalData: {
    env: {
      get: shim.__get,
      helpers: shim.__helpers
    },
    usage: usage
  }
});
