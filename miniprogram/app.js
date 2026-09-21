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

/* ---------- 使用计数（服务器为唯一事实源：失败必补发，本地仅缓存快照） ---------- */
const API_URL = 'https://www.jxynstar.com/mp-api/usage';
const REMOTE_KEY = 'herocard-usage-remote';   // 服务器数据快照（显示用）
const OUTBOX_KEY = 'herocard-usage-outbox';   // 待上报队列（网络失败必补发）

function readRemote() {
  try { return wx.getStorageSync(REMOTE_KEY) || {}; } catch (e) { return {}; }
}

function writeRemote(map) {
  try { wx.setStorageSync(REMOTE_KEY, map); } catch (e) { /* 忽略 */ }
}

function readOutbox() {
  try { return wx.getStorageSync(OUTBOX_KEY) || []; } catch (e) { return []; }
}

function writeOutbox(list) {
  try { wx.setStorageSync(OUTBOX_KEY, list.slice(-500)); } catch (e) { /* 忽略 */ }
}

const usage = {
  flushing: false,

  /** 显示计数：只以服务器数据快照为准（快照来自上报响应/全量拉取） */
  display: function (group, tpl) {
    const remote = readRemote();
    return remote[group + ':' + tpl] || 0;
  },

  /** 记录一次使用：入待上报队列并立即尝试上报（失败留队列，之后必补发到服务器） */
  record: function (group, tpl) {
    const outbox = readOutbox();
    outbox.push({ group: group, tpl: tpl });
    writeOutbox(outbox);
    this.flushOutbox();
  },

  /** 串行上报队列：逐条发送，成功一条出队一条；失败停止等下次触发（record/fetchAll） */
  flushOutbox: function () {
    if (this.flushing) return;
    const self = this;
    const send = function () {
      const outbox = readOutbox();
      if (!outbox.length) { self.flushing = false; return; }
      const item = outbox[0];
      wx.request({
        url: API_URL,
        method: 'POST',
        data: { group: item.group, tpl: item.tpl },
        timeout: 4000,
        success: function (res) {
          if (res.statusCode === 200 && res.data && res.data.ok) {
            const queue = readOutbox();
            queue.shift(); // 上报成功才出队
            writeOutbox(queue);
            const remote = readRemote();
            remote[item.group + ':' + item.tpl] = res.data.count;
            writeRemote(remote);
            send(); // 继续下一条
          } else {
            self.flushing = false;
          }
        },
        fail: function () { self.flushing = false; }
      });
    };
    this.flushing = true;
    send();
  },

  /** 拉取服务器全量计数（成功更新快照并补发积压队列，失败返回 null） */
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
            usage.flushOutbox(); // 网络已通，补发积压
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
  onLaunch(options) {
    this.collectDroppedImages(options);
  },

  onShow(options) {
    this.collectDroppedImages(options);
  },

  /** 收集拖入/聊天打开的图片（PC 拖拽场景 1173，forwardMaterials 携带文件路径） */
  collectDroppedImages(options) {
    if (options && options.forwardMaterials && options.forwardMaterials.length) {
      const images = options.forwardMaterials
        .filter((m) => m && m.path && String(m.type || '').indexOf('image') === 0)
        .map((m) => m.path);
      if (images.length) this.globalData.pendingImages = images;
    }
  },

  globalData: {
    env: {
      get: shim.__get,
      helpers: shim.__helpers
    },
    usage: usage,
    pendingImages: []
  }
});
