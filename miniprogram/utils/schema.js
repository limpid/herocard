/** 模板清单（由 Web 端渲染器自动提取生成）+ 表单字段定义与默认值 */

const templates = require('./templates.js');

const groups = [
  { key: 'single', name: '单人介绍', desc: '一位明星的介绍卡片，突出形象与合作联系' },
  { key: 'compare', name: '明星对比', desc: '两位人选同卡对比，突出照片与出场费' },
  { key: 'quote', name: '明星报价', desc: '面向客户的商务报价单，报价明细一目了然' },
  { key: 'batch', name: '批量报价', desc: '一次列出多位明星的报价表格' }
];

const themeOptions = [
  { key: 'lavender', name: '薰衣草', color: '#7f82dc' },
  { key: 'peach', name: '蜜桃', color: '#de856f' },
  { key: 'mint', name: '薄荷', color: '#69aa9b' },
  { key: 'midnight', name: '午夜', color: '#324b78' }
];

const sizeOptions = [
  { key: '1080x1440', name: '高清 1080×1440' },
  { key: '900x1200', name: '标准 900×1200' },
  { key: '750x1000', name: '轻量 750×1000' }
];

const defaults = {
  single: {
    name: '林知夏',
    role: '生活方式创作者',
    price: '合作预算：8万起',
    tip: '合作报价仅供参考，具体以沟通方案为准',
    bio: '林知夏，独立生活方式创作者与视觉策划人。长期关注城市生活、美学空间与女性成长，擅长以温柔细腻的内容语言连接品牌与受众。曾与多个生活方式、家居及旅行品牌合作，作品兼具真实体验与审美表达。',
    footer: '明确合作类型、城市、时间与预算',
    contact: '',
    watermark: '',
    focusX: 50,
    focusY: 35,
    zoom: 100
  },
  compare: {
    title: '代言人对比',
    tip: '报价仅供参考',
    nameA: '沈亦舟',
    tagA: '影视演员',
    feeA: '出场费 80万/场',
    nameB: '顾南枝',
    tagB: '全能艺人',
    feeB: '出场费 120万/场',
    contact: '',
    footer: '点击联系经纪人，锁定心仪人选',
    watermark: '',
    zoomA: 100,
    zoomB: 100,
    focusYA: 35,
    focusYB: 35
  },
  quote: {
    title: '商务合作报价单',
    validity: '报价有效期：30天',
    name: '沈亦舟',
    tag: '影视演员',
    tip: '以上报价不含差旅与制作费用，最终以合同为准',
    items: [
      { name: '形象代言（年度）', price: '180万' },
      { name: '出席商业活动', price: '25万/场' },
      { name: '社媒图文发布', price: '12万/条' },
      { name: '直播专场', price: '40万/场' }
    ],
    contact: '',
    footer: '明星经纪 · 一对一服务',
    watermark: '',
    zoom: 100,
    focusY: 35
  },
  batch: {
    title: '明星艺人商务报价表',
    columns: ['明星艺人', '出场费/万', '代表作品'],
    rows: [
      { a: '沈亦舟', b: '180', c: '《长安十二时》' },
      { a: '顾南枝', b: '120', c: '《风起南枝》' },
      { a: '陆延铮', b: '95', c: '《破晓行动》' },
      { a: '白鹿溪', b: '88', c: '《云上少女》' },
      { a: '程一诺', b: '76', c: '《都市之光》' },
      { a: '江叙白', b: '65', c: '《夜航西飞》' },
      { a: '苏晚晴', b: '58', c: '《半夏微凉》' },
      { a: '温叙年', b: '52', c: '《山月不知》' },
      { a: '林知夏', b: '46', c: '《城市旅人》' },
      { a: '周聿风', b: '40', c: '《少年游》' }
    ],
    contact: '',
    footer: '明星经纪 · 报价以最终合同为准',
    watermark: ''
  }
};

module.exports = {
  groups: groups,
  templates: templates,
  themeOptions: themeOptions,
  sizeOptions: sizeOptions,
  defaults: defaults
};
