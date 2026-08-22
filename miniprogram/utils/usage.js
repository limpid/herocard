/**
 * 模板使用次数统计
 *
 * 双层数据源，网络失败不影响使用：
 *  - 本地计数（wx storage，立即可用、离线兜底）
 *  - 后端全局计数（GET /mp-api/usage 拉取、POST /mp-api/usage 上报，全部静默容错）
 *
 * 显示策略：优先后端全局计数，拉取失败时回退本地计数。
 */
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

/** 获取某模板的显示计数（远端优先，本地兜底） */
function display(group, tpl) {
  const key = group + ':' + tpl;
  const remote = readRemote();
  if (remote[key] !== undefined) return remote[key];
  return readLocal()[key] || 0;
}

/** 记录一次使用：本地立即 +1，异步上报后端（失败静默） */
function record(group, tpl) {
  const key = group + ':' + tpl;

  const local = readLocal();
  local[key] = (local[key] || 0) + 1;
  try { wx.setStorageSync(LOCAL_KEY, local); } catch (e) { /* 忽略 */ }

  wx.request({
    url: API_URL,
    method: 'POST',
    data: { group: group, tpl: tpl },
    timeout: 4000,
    success: (res) => {
      if (res.statusCode === 200 && res.data && res.data.ok) {
        const remote = readRemote();
        remote[key] = res.data.count;
        writeRemote(remote);
      }
    },
    fail: () => { /* 网络失败不影响使用 */ }
  });
}

/** 拉取后端全量计数（成功返回 map 并写缓存，失败返回 null） */
function fetchAll() {
  return new Promise((resolve) => {
    wx.request({
      url: API_URL,
      method: 'GET',
      timeout: 4000,
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.ok) {
          const map = res.data.data || {};
          writeRemote(map);
          resolve(map);
        } else {
          resolve(null);
        }
      },
      fail: () => resolve(null)
    });
  });
}

module.exports = {
  display: display,
  record: record,
  fetchAll: fetchAll
};
