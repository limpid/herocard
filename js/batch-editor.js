(function () {
  'use strict';

  const canvas = document.getElementById('cardCanvas');
  const ctx = canvas.getContext('2d');
  const helpers = window.CARD_HELPERS;
  const templateKey = document.body.dataset.batch || 'classic-table';

  const elements = {
    title: document.getElementById('titleInput'),
    rowCount: document.getElementById('rowCountSelect'),
    col1: document.getElementById('col1Input'),
    col2: document.getElementById('col2Input'),
    col3: document.getElementById('col3Input'),
    rowsContainer: document.getElementById('rowsContainer'),
    contact: document.getElementById('contactInput'),
    footer: document.getElementById('footerInput'),
    watermark: document.getElementById('watermarkInput'),
    theme: document.getElementById('themeSelect'),
    size: document.getElementById('sizeSelect'),
    sizeBadge: document.getElementById('sizeBadge'),
    download: document.getElementById('downloadButton'),
    reset: document.getElementById('resetButton'),
    toast: document.getElementById('toast')
  };

  const defaultColumns = ['明星艺人', '出场费/万', '代表作品'];
  const defaultRows = [
    ['沈亦舟', '180', '《长安十二时》'],
    ['顾南枝', '120', '《风起南枝》'],
    ['陆延铮', '95', '《破晓行动》'],
    ['白鹿溪', '88', '《云上少女》'],
    ['程一诺', '76', '《都市之光》'],
    ['江叙白', '65', '《夜航西飞》'],
    ['苏晚晴', '58', '《半夏微凉》'],
    ['温叙年', '52', '《山月不知》'],
    ['林知夏', '46', '《城市旅人》'],
    ['周聿风', '40', '《少年游》']
  ];
  const defaults = {
    title: '明星艺人商务报价表',
    contact: '',
    footer: '明星经纪 · 报价以最终合同为准',
    watermark: ''
  };

  let rowValues = defaultRows.map((row) => [...row]);
  let toastTimer = null;

  const charCounters = Array.from(document.querySelectorAll('[data-count-for]')).map((element) => ({
    element,
    input: document.getElementById(element.dataset.countFor)
  }));

  function updateCharCounts() {
    charCounters.forEach(({ element, input }) => {
      const count = Array.from(input.value).length;
      const max = input.getAttribute('maxlength');
      element.textContent = max ? `${count} / ${max}` : `${count} 字`;
      element.classList.toggle('is-over', Boolean(max && count >= Number(max)));
    });
  }

  function renderRowInputs() {
    const count = Number(elements.rowCount.value);
    while (rowValues.length < count) rowValues.push(['', '', '']);
    rowValues = rowValues.slice(0, count);
    elements.rowsContainer.innerHTML = '';

    const labels = ['明星', '报价', '作品'];
    for (let index = 0; index < count; index += 1) {
      const row = document.createElement('div');
      row.className = 'batch-row';
      for (let column = 0; column < 3; column += 1) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = rowValues[index][column];
        input.maxLength = column === 2 ? 14 : 10;
        input.setAttribute('aria-label', `第 ${index + 1} 行${labels[column]}`);
        input.addEventListener('input', () => {
          rowValues[index][column] = input.value;
          renderCard();
        });
        row.appendChild(input);
      }
      elements.rowsContainer.appendChild(row);
    }
  }

  function renderCard() {
    const template = window.BATCH_TEMPLATES && window.BATCH_TEMPLATES[templateKey];
    if (!template) return;

    const [outputWidth, outputHeight] = elements.size.value.split('x').map(Number);
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const scale = outputWidth / 900;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const data = {
      title: elements.title.value.trim() || '明星艺人商务报价表',
      columns: [
        elements.col1.value.trim() || defaultColumns[0],
        elements.col2.value.trim() || defaultColumns[1],
        elements.col3.value.trim() || defaultColumns[2]
      ],
      rows: rowValues.map((row) => ({ a: row[0].trim(), b: row[1].trim(), c: row[2].trim() })),
      contact: elements.contact.value.trim(),
      footer: elements.footer.value.trim() || '填写底部说明文字',
      watermark: elements.watermark.value,
      themeKey: elements.theme.value
    };

    helpers.setDrawingContext(ctx);
    ctx.clearRect(0, 0, 900, 1200);
    template.render(ctx, data, helpers);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    elements.sizeBadge.textContent = `${outputWidth} × ${outputHeight} px`;
    updateCharCounts();
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 2600);
  }

  function downloadCard() {
    renderCard();
    const template = window.BATCH_TEMPLATES[templateKey];
    const safeTitle = (elements.title.value.trim() || '批量报价').replace(/[\\/:*?"<>|]/g, '-');
    window.saveCanvasImage(canvas, `${safeTitle}-${template ? template.name : ''}.png`, {
      desktop: '高清批量报价表已下载',
      mobile: '长按图片即可保存到相册'
    });
  }

  function resetForm() {
    Object.entries(defaults).forEach(([key, value]) => { elements[key].value = value; });
    elements.col1.value = defaultColumns[0];
    elements.col2.value = defaultColumns[1];
    elements.col3.value = defaultColumns[2];
    elements.rowCount.value = '10';
    rowValues = defaultRows.map((row) => [...row]);
    elements.theme.value = 'lavender';
    elements.size.value = '1080x1440';
    renderRowInputs();
    renderCard();
    showToast('已恢复示例内容');
  }

  [
    elements.title, elements.col1, elements.col2, elements.col3,
    elements.contact, elements.footer, elements.watermark
  ].forEach((element) => element.addEventListener('input', renderCard));
  [elements.theme, elements.size].forEach((element) => element.addEventListener('change', renderCard));
  elements.rowCount.addEventListener('change', () => {
    renderRowInputs();
    renderCard();
  });
  elements.download.addEventListener('click', downloadCard);
  elements.reset.addEventListener('click', resetForm);

  renderRowInputs();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderCard);
  renderCard();
})();
