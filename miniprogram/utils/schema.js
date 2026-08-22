/** 模板清单（由 Web 端渲染器自动提取生成）+ 表单字段定义与默认值 */

const templates = {
  "single": {
    "classic": {
      "name": "经典图文",
      "tagline": "照片与资料分区呈现，信息完整均衡"
    },
    "magazine": {
      "name": "杂志封面",
      "tagline": "满版照片配超大标题，视觉冲击力最强"
    },
    "minimal": {
      "name": "极简留白",
      "tagline": "大图居中与大量留白，突出人物气质"
    },
    "poster": {
      "name": "大字海报",
      "tagline": "深色底与超大字号，一眼记住名字"
    },
    "cinema": {
      "name": "电影片头",
      "tagline": "满幅银幕形象与醒目合作入口"
    },
    "social": {
      "name": "社交渐变",
      "tagline": "大图卡片与鲜明联系按钮，亲和吸睛"
    },
    "press": {
      "name": "报章黑白",
      "tagline": "整版人物特写与报纸排版，可信复古"
    },
    "glass": {
      "name": "通透玻璃",
      "tagline": "渐变底色配半透明面板，现代通透"
    },
    "ink": {
      "name": "竖排雅致",
      "tagline": "大图竖排与朱印点缀，东方韵味"
    },
    "dossier": {
      "name": "档案编号",
      "tagline": "档案卡式信息陈列，冷静专业"
    }
  },
  "compare": {
    "split-vs": {
      "name": "对垒分屏",
      "tagline": "对角线分屏与中央 VS，对抗感最强"
    },
    "spotlight": {
      "name": "焦点对决",
      "tagline": "双聚光灯圆形头像，报价大字陈列"
    },
    "ranking": {
      "name": "榜单对决",
      "tagline": "白卡并列与醒目报价条，一目了然"
    },
    "stacked": {
      "name": "上下对台",
      "tagline": "上下双舞台与中带 VS，纵向对比"
    },
    "clash": {
      "name": "撞色渐变",
      "tagline": "左右撞色渐变与悬浮白卡，明快抢眼"
    },
    "neon": {
      "name": "电竞霓虹",
      "tagline": "霓虹描边与倾斜相框，热血电竞感"
    },
    "press-duel": {
      "name": "报纸对决",
      "tagline": "黑白双栏与报纸刊头，可信复古"
    },
    "glass-vs": {
      "name": "玻璃对决",
      "tagline": "双玻璃面板与通透 VS，现代质感"
    },
    "dossier-compare": {
      "name": "档案对比",
      "tagline": "双档案卡与条形码，冷静专业"
    },
    "vote": {
      "name": "票选对决",
      "tagline": "选票式排版与勾选框，引导用户决策"
    }
  },
  "quote": {
    "price-list": {
      "name": "价目单",
      "tagline": "简洁价目排版，报价一目了然"
    },
    "menu": {
      "name": "菜单报价",
      "tagline": "菜单式排版与椭圆相框，典雅有格调"
    },
    "luxury": {
      "name": "奢华拱窗",
      "tagline": "深色底与拱形大图，高端商务感"
    },
    "ticket": {
      "name": "票据报价",
      "tagline": "票据打孔与条形码，形式感十足"
    },
    "modern": {
      "name": "渐变横幅",
      "tagline": "渐变底与横幅大图，现代明快"
    },
    "magazine": {
      "name": "杂志分栏",
      "tagline": "左图右文杂志分栏，编辑气质"
    },
    "grid": {
      "name": "极简数字",
      "tagline": "超大报价数字矩阵，视觉冲击"
    },
    "glass": {
      "name": "玻璃报价",
      "tagline": "通透玻璃面板，轻盈现代"
    },
    "dossier": {
      "name": "报价档案",
      "tagline": "档案卡式明细表，冷静专业"
    },
    "ink": {
      "name": "中式红笺",
      "tagline": "朱红点缀与雅致留白，东方韵味"
    }
  },
  "batch": {
    "classic-table": {
      "name": "经典蓝表",
      "tagline": "色带表头与斑马纹行，干净利落"
    },
    "dark-table": {
      "name": "暗夜行情",
      "tagline": "深色底高对比，报价一目了然"
    },
    "gradient-header": {
      "name": "渐变榜头",
      "tagline": "大渐变题头，现代醒目"
    },
    "minimal-lines": {
      "name": "极简线表",
      "tagline": "细线与大留白，安静有力"
    },
    "chart-list": {
      "name": "榜单排行",
      "tagline": "序号榜单式排版，杂志气质"
    },
    "press-table": {
      "name": "报纸行情",
      "tagline": "报纸行情版式，复古可信"
    },
    "card-rows": {
      "name": "卡片行组",
      "tagline": "圆角卡片行与价签，现代轻快"
    },
    "banner-table": {
      "name": "撞色横幅",
      "tagline": "撞色色块，视觉冲击强烈"
    },
    "glass-table": {
      "name": "玻璃行情",
      "tagline": "渐变底玻璃面板，通透精致"
    },
    "ink-table": {
      "name": "中式雅表",
      "tagline": "朱红表头与衬线，东方韵味"
    }
  }
};

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
    title: '商务合作报价单',
    tip: '报价仅供参考',
    nameA: '沈亦舟',
    tagA: '影视演员',
    feeA: '出场费 80万/场',
    nameB: '顾南枝',
    tagB: '全能艺人',
    feeB: '出场费 120万/场',
    contact: '',
    footer: '联系经纪人，锁定心仪人选',
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
