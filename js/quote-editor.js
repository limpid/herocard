(function () {
  'use strict';

  const canvas = document.getElementById('cardCanvas');
  const ctx = canvas.getContext('2d');
  const helpers = window.CARD_HELPERS;
  const templateKey = document.body.dataset.quote || 'price-list';

  const elements = {
    photoInput: document.getElementById('photoInput'),
    photoZoom: document.getElementById('photoZoom'),
    photoZoomValue: document.getElementById('photoZoomValue'),
    photoPosition: document.getElementById('photoPosition'),
    uploadZone: document.getElementById('uploadZone'),
    uploadTitle: document.getElementById('uploadTitle'),
    title: document.getElementById('titleInput'),
    validity: document.getElementById('validityInput'),
    name: document.getElementById('nameInput'),
    tag: document.getElementById('tagInput'),
    tip: document.getElementById('tipInput'),
    contact: document.getElementById('contactInput'),
    footer: document.getElementById('footerInput'),
    watermark: document.getElementById('watermarkInput'),
    theme: document.getElementById('themeSelect'),
    size: document.getElementById('sizeSelect'),
    sizeBadge: document.getElementById('sizeBadge'),
    download: document.getElementById('downloadButton'),
    reset: document.getElementById('resetButton'),
    toast: document.getElementById('toast'),
    items: [1, 2, 3, 4].map((index) => ({
      name: document.getElementById(`item${index}NameInput`),
      price: document.getElementById(`item${index}PriceInput`)
    }))
  };

  const defaultItems = [
    { name: '形象代言（年度）', price: '180万' },
    { name: '出席商业活动', price: '25万/场' },
    { name: '社媒图文发布', price: '12万/条' },
    { name: '直播专场', price: '40万/场' }
  ];

  const defaults = {
    title: '商务合作报价单',
    validity: '报价有效期：30天',
    name: '沈亦舟',
    tag: '影视演员',
    tip: '以上报价不含差旅与制作费用，最终以合同为准',
    contact: '',
    footer: '明星经纪 · 一对一服务',
    watermark: ''
  };

  let portraitImage = null;
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

  function renderCard() {
    const template = window.QUOTE_TEMPLATES && window.QUOTE_TEMPLATES[templateKey];
    if (!template) return;

    const [outputWidth, outputHeight] = elements.size.value.split('x').map(Number);
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const scale = outputWidth / 900;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const data = {
      title: elements.title.value.trim() || '商务合作报价单',
      validity: elements.validity.value.trim() || '报价有效期：30天',
      name: elements.name.value.trim() || '明星姓名',
      tag: elements.tag.value.trim() || '身份标签',
      image: portraitImage,
      zoom: Number(elements.photoZoom.value),
      focusY: Number(elements.photoPosition.value),
      items: elements.items.map((item, index) => ({
        name: item.name.value.trim() || defaultItems[index].name,
        price: item.price.value.trim() || '面议'
      })),
      tip: elements.tip.value.trim() || '报价备注说明',
      contact: elements.contact.value.trim(),
      footer: elements.footer.value.trim() || '填写底部说明文字',
      watermark: elements.watermark.value,
      themeKey: elements.theme.value
    };

    helpers.setDrawingContext(ctx);
    ctx.clearRect(0, 0, 900, 1200);
    template.render(ctx, data, helpers);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    elements.photoZoomValue.textContent = `${elements.photoZoom.value}%`;
    elements.sizeBadge.textContent = `${outputWidth} × ${outputHeight} px`;
    updateCharCounts();
  }

  function applySmartFraming(image) {
    const ratio = image.width / image.height;
    if (ratio < 0.85) {
      elements.photoZoom.value = '82';
      elements.photoPosition.value = '22';
    } else if (ratio < 1.3) {
      elements.photoZoom.value = '92';
      elements.photoPosition.value = '30';
    } else {
      elements.photoZoom.value = '100';
      elements.photoPosition.value = '50';
    }
  }

  function loadImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('请选择 JPG、PNG 或 WebP 图片');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      showToast('图片请勿超过 12MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        portraitImage = image;
        elements.uploadTitle.textContent = file.name;
        applySmartFraming(image);
        renderCard();
      };
      image.onerror = () => showToast('图片读取失败，请更换文件');
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => elements.toast.classList.remove('show'), 2600);
  }

  function downloadCard() {
    renderCard();
    const template = window.QUOTE_TEMPLATES[templateKey];
    const safeName = (elements.name.value.trim() || '明星').replace(/[\\/:*?"<>|]/g, '-');
    const link = document.createElement('a');
    link.download = `${safeName}-报价单-${template ? template.name : ''}.png`;
    link.href = canvas.toDataURL('image/png', 1);
    link.click();
    showToast('高清报价单已下载');
  }

  function resetForm() {
    Object.entries(defaults).forEach(([key, value]) => { elements[key].value = value; });
    elements.items.forEach((item, index) => {
      item.name.value = defaultItems[index].name;
      item.price.value = defaultItems[index].price;
    });
    elements.theme.value = 'lavender';
    elements.size.value = '1080x1440';
    elements.photoZoom.value = '100';
    elements.photoPosition.value = '35';
    elements.photoInput.value = '';
    elements.uploadTitle.textContent = '上传明星照片';
    portraitImage = null;
    renderCard();
    showToast('已恢复示例内容');
  }

  const watchedInputs = [
    elements.title, elements.validity, elements.name, elements.tag,
    elements.tip, elements.contact, elements.footer, elements.watermark,
    elements.photoZoom, elements.photoPosition
  ];
  elements.items.forEach((item) => {
    watchedInputs.push(item.name, item.price);
  });
  watchedInputs.forEach((element) => element.addEventListener('input', renderCard));
  [elements.theme, elements.size].forEach((element) => element.addEventListener('change', renderCard));
  elements.photoInput.addEventListener('change', (event) => loadImageFile(event.target.files[0]));
  elements.download.addEventListener('click', downloadCard);
  elements.reset.addEventListener('click', resetForm);

  ['dragenter', 'dragover'].forEach((eventName) => {
    elements.uploadZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.uploadZone.classList.add('is-dragging');
    });
  });
  ['dragleave', 'drop'].forEach((eventName) => {
    elements.uploadZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.uploadZone.classList.remove('is-dragging');
    });
  });
  elements.uploadZone.addEventListener('drop', (event) => loadImageFile(event.dataTransfer.files[0]));

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderCard);
  renderCard();
})();
