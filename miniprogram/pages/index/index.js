const schema = require('../../utils/schema.js');

const groupsWithCount = schema.groups.map((group) => ({
  key: group.key,
  name: group.name,
  desc: group.desc,
  count: Object.keys(schema.templates[group.key]).length
}));

Page({
  data: {
    groups: groupsWithCount,
    activeGroup: 'single',
    templates: [],
    shareTemplate: null
  },

  onLoad(options) {
    // 支持从分享卡片直达：?g=compare&t=split-vs
    // 延迟到下一事件循环再跳转：onLoad 中同步 redirectTo 会打断
    // 页面生命周期状态机，触发 "LifeCycle.load fail" 框架错误
    if (options && options.g && options.t) {
      const list = schema.templates[options.g];
      if (list && list[options.t]) {
        const url = '/pages/editor/editor?g=' + options.g + '&t=' + options.t;
        setTimeout(() => { wx.redirectTo({ url: url }); }, 0);
        return;
      }
    }
    this.applyGroup(options && options.g ? options.g : 'single');
  },

  applyGroup(groupKey) {
    const group = schema.groups.some((g) => g.key === groupKey) ? groupKey : 'single';
    const map = schema.templates[group];
    const usage = getApp().globalData.usage;
    const templates = Object.keys(map).map((key) => ({
      key: key,
      name: map[key].name,
      tagline: map[key].tagline,
      usage: usage.display(group, key)
    }));
    this.setData({ activeGroup: group, templates: templates });
  },

  onShow() {
    // 每次回到主页刷新计数：先用缓存即时渲染，再异步拉取后端全局计数
    const usage = getApp().globalData.usage;
    this.applyGroup(this.data.activeGroup);
    usage.fetchAll().then(() => {
      this.applyGroup(this.data.activeGroup);
    });
  },

  onSwitchGroup(event) {
    const group = event.currentTarget.dataset.group;
    if (group === this.data.activeGroup) return;
    this.applyGroup(group);
  },

  onOpenTemplate(event) {
    const { g, t } = event.currentTarget.dataset;
    wx.navigateTo({ url: '/pages/editor/editor?g=' + g + '&t=' + t });
  },

  onShareAppMessage() {
    return {
      title: '星风暴人物卡片生成器 · 40 款明星卡片模板',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return { title: '星风暴人物卡片生成器 · 40 款明星卡片模板' };
  }
});
