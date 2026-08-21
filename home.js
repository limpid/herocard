(function () {
  'use strict';

  const helpers = window.CARD_HELPERS;

  const singleSample = {
    name: '林知夏',
    role: '生活方式创作者',
    price: '合作预算：8万起',
    tip: '合作报价仅供参考，具体以沟通方案为准',
    bio: '林知夏，独立生活方式创作者与视觉策划人。长期关注城市生活、美学空间与女性成长，擅长以温柔细腻的内容语言连接品牌与受众，曾与多个生活方式及旅行品牌深度合作。',
    footer: '明确合作类型、城市、时间与预算',
    contact: '商务合作：微信 StarBiz01',
    watermark: '人物卡片',
    themeKey: 'lavender',
    image: null,
    focusX: 50,
    focusY: 35,
    zoom: 100
  };

  const compareSample = {
    title: '代言人对比 · 谁更适合你的品牌',
    tip: '报价仅供参考，以实际沟通为准',
    contact: '商务合作：微信 StarBiz01',
    footer: '点击联系经纪人，锁定心仪人选',
    watermark: '人物卡片',
    themeKey: 'lavender',
    imageA: null,
    imageB: null,
    zoomA: 100,
    zoomB: 100,
    focusYA: 35,
    focusYB: 35,
    nameA: '沈亦舟',
    tagA: '影视演员',
    feeA: '出场费 80万/场',
    nameB: '顾南枝',
    tagB: '全能艺人',
    feeB: '出场费 120万/场'
  };

  const quoteSample = {
    title: '商务合作报价单',
    validity: '报价有效期：30天',
    name: '沈亦舟',
    tag: '影视演员',
    image: null,
    zoom: 100,
    focusY: 35,
    items: [
      { name: '形象代言（年度）', price: '180万' },
      { name: '出席商业活动', price: '25万/场' },
      { name: '社媒图文发布', price: '12万/条' },
      { name: '直播专场', price: '40万/场' }
    ],
    tip: '以上报价不含差旅与制作费用，最终以合同为准',
    contact: '商务合作：微信 StarBiz01',
    footer: '明星经纪 · 一对一服务',
    watermark: '人物卡片',
    themeKey: 'lavender'
  };

  const batchSample = {
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
    contact: '联系人：李经理 138-0000-0000',
    footer: '明星经纪 · 报价以最终合同为准',
    watermark: '人物卡片',
    themeKey: 'lavender'
  };

  function createTabGroup(options) {
    const ctx = options.canvas.getContext('2d');

    function render(key) {
      const template = options.registry[key];
      if (!template) return;

      options.canvas.width = 1080;
      options.canvas.height = 1440;
      ctx.setTransform(1.2, 0, 0, 1.2, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      helpers.setDrawingContext(ctx);
      helpers.consumeBioOverflow();
      ctx.clearRect(0, 0, 900, 1200);
      template.render(ctx, options.sample, helpers);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const index = options.tabs.findIndex((tab) => tab.dataset.template === key || tab.dataset.compare === key || tab.dataset.quote === key || tab.dataset.batch === key);
      options.nameEl.textContent = template.name;
      options.taglineEl.textContent = template.tagline;
      options.indexEl.textContent = `${options.prefix} · ${String(index + 1).padStart(2, '0')}`;
      options.ctaEl.href = `${options.base}${template.file}`;
    }

    function selectTab(tab) {
      options.tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
      });
      render(tab.dataset.template || tab.dataset.compare || tab.dataset.quote || tab.dataset.batch);
    }

    options.tabs.forEach((tab) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const next = options.tabs[(options.tabs.indexOf(tab) + delta + options.tabs.length) % options.tabs.length];
        selectTab(next);
        next.focus();
      });
    });

    return render;
  }

  const renderSingle = createTabGroup({
    tabs: Array.from(document.querySelectorAll('#template-tabs [role="tab"]')),
    canvas: document.getElementById('previewCanvas'),
    nameEl: document.getElementById('templateName'),
    taglineEl: document.getElementById('templateTagline'),
    indexEl: document.getElementById('templateIndex'),
    ctaEl: document.getElementById('useTemplate'),
    registry: window.CARD_TEMPLATES,
    sample: singleSample,
    prefix: 'TEMPLATE',
    base: 'templates/'
  });

  const renderCompare = createTabGroup({
    tabs: Array.from(document.querySelectorAll('#compare-tabs [role="tab"]')),
    canvas: document.getElementById('compareCanvas'),
    nameEl: document.getElementById('compareName'),
    taglineEl: document.getElementById('compareTagline'),
    indexEl: document.getElementById('compareIndex'),
    ctaEl: document.getElementById('useCompare'),
    registry: window.COMPARE_TEMPLATES,
    sample: compareSample,
    prefix: 'COMPARE',
    base: 'compare/'
  });

  const renderQuote = createTabGroup({
    tabs: Array.from(document.querySelectorAll('#quote-tabs [role="tab"]')),
    canvas: document.getElementById('quoteCanvas'),
    nameEl: document.getElementById('quoteName'),
    taglineEl: document.getElementById('quoteTagline'),
    indexEl: document.getElementById('quoteIndex'),
    ctaEl: document.getElementById('useQuote'),
    registry: window.QUOTE_TEMPLATES,
    sample: quoteSample,
    prefix: 'QUOTE',
    base: 'quote/'
  });

  const renderBatch = createTabGroup({
    tabs: Array.from(document.querySelectorAll('#batch-tabs [role="tab"]')),
    canvas: document.getElementById('batchCanvas'),
    nameEl: document.getElementById('batchName'),
    taglineEl: document.getElementById('batchTagline'),
    indexEl: document.getElementById('batchIndex'),
    ctaEl: document.getElementById('useBatch'),
    registry: window.BATCH_TEMPLATES,
    sample: batchSample,
    prefix: 'BATCH',
    base: 'batch/'
  });

  const sideNavLinks = Array.from(document.querySelectorAll('.side-nav a'));
  const groupSections = Array.from(document.querySelectorAll('.home-group'));

  function showGroup(name) {
    groupSections.forEach((section) => {
      section.classList.toggle('is-hidden', section.dataset.group !== name);
    });
    sideNavLinks.forEach((link) => {
      const active = link.dataset.group === name;
      link.classList.toggle('is-active', active);
      if (active) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  sideNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showGroup(link.dataset.group);
    });
  });

  showGroup('single');

  function renderAll() {
    renderSingle('classic');
    renderCompare('split-vs');
    renderQuote('price-list');
    renderBatch('classic-table');
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderAll);
  renderAll();
})();
