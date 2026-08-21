(function () {
  'use strict';

  const canvas = document.getElementById('cardCanvas');
  const ctx = canvas.getContext('2d');
  const helpers = window.CARD_HELPERS;
  const templateKey = document.body.dataset.template || 'classic';

  const elements = {
    photoInput: document.getElementById('photoInput'),
    photoZoom: document.getElementById('photoZoom'),
    photoZoomValue: document.getElementById('photoZoomValue'),
    photoPositionX: document.getElementById('photoPositionX'),
    photoPosition: document.getElementById('photoPosition'),
    smartFit: document.getElementById('smartFitButton'),
    name: document.getElementById('nameInput'),
    role: document.getElementById('roleInput'),
    price: document.getElementById('priceInput'),
    tip: document.getElementById('tipInput'),
    bio: document.getElementById('bioInput'),
    footer: document.getElementById('footerInput'),
    contact: document.getElementById('contactInput'),
    watermark: document.getElementById('watermarkInput'),
    theme: document.getElementById('themeSelect'),
    size: document.getElementById('sizeSelect'),
    sizeBadge: document.getElementById('sizeBadge'),
    uploadTitle: document.getElementById('uploadTitle'),
    uploadZone: document.getElementById('uploadZone'),
    download: document.getElementById('downloadButton'),
    reset: document.getElementById('resetButton'),
    toast: document.getElementById('toast')
  };

  const defaults = {
    name: '林知夏',
    role: '生活方式创作者',
    price: '合作预算：8万起',
    tip: '合作报价仅供参考，具体以沟通方案为准',
    bio: '林知夏，独立生活方式创作者与视觉策划人。长期关注城市生活、美学空间与女性成长，擅长以温柔细腻的内容语言连接品牌与受众。曾与多个生活方式、家居及旅行品牌合作，作品兼具真实体验与审美表达。',
    footer: '明确合作类型、城市、时间与预算',
    contact: '',
    watermark: ''
  };

  let portraitImage = null;
  let toastTimer = null;
  let currentTemplate = null;

  const charCounters = Array.from(document.querySelectorAll('[data-count-for]')).map((element) => ({
    element,
    input: document.getElementById(element.dataset.countFor)
  }));

  function updateCharCounts(bioTruncated) {
    charCounters.forEach(({ element, input }) => {
      const count = Array.from(input.value).length;
      const max = input.getAttribute('maxlength');
      const overflowed = input === elements.bio && bioTruncated;
      const reachedLimit = Boolean(max && count >= Number(max));

      element.textContent = max
        ? `${count} / ${max}`
        : `${count} 字${overflowed ? ' · 超出卡片可显示范围' : ''}`;
      element.classList.toggle('is-over', reachedLimit || overflowed);
    });
  }

  function renderCard() {
    const [outputWidth, outputHeight] = elements.size.value.split('x').map(Number);
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const scale = outputWidth / 900;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    currentTemplate = (window.CARD_TEMPLATES && window.CARD_TEMPLATES[templateKey]) || window.CARD_TEMPLATES.classic;

    const data = {
      name: elements.name.value.trim() || '人物名称',
      role: elements.role.value.trim() || '身份标签',
      price: elements.price.value.trim() || '重点信息',
      tip: elements.tip.value.trim() || '在这里填写提示语',
      bio: elements.bio.value.trim() || '在这里填写人物介绍，让读者快速了解人物经历、特点和代表作品。',
      footer: elements.footer.value.trim() || '填写底部说明文字',
      contact: elements.contact.value.trim(),
      watermark: elements.watermark.value,
      themeKey: elements.theme.value,
      image: portraitImage,
      focusX: Number(elements.photoPositionX.value),
      focusY: Number(elements.photoPosition.value),
      zoom: Number(elements.photoZoom.value)
    };

    helpers.setDrawingContext(ctx);
    helpers.consumeBioOverflow();
    ctx.clearRect(0, 0, 900, 1200);
    currentTemplate.render(ctx, data, helpers);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    elements.photoZoomValue.textContent = `${elements.photoZoom.value}%`;
    elements.sizeBadge.textContent = `${outputWidth} × ${outputHeight} px`;
    updateCharCounts(helpers.consumeBioOverflow());
  }

  function applySmartFraming(showFeedback = true) {
    if (!portraitImage) {
      if (showFeedback) showToast('请先上传人物照片');
      return;
    }

    const ratio = portraitImage.width / portraitImage.height;
    elements.photoPositionX.value = '50';
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
    renderCard();
    if (showFeedback) showToast('已按照片比例智能适配');
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
        applySmartFraming(false);
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
    const safeName = (elements.name.value.trim() || '人物').replace(/[\\/:*?"<>|]/g, '-');
    const templateName = currentTemplate ? currentTemplate.name : '卡片';
    const link = document.createElement('a');
    link.download = `${safeName}-${templateName}.png`;
    link.href = canvas.toDataURL('image/png', 1);
    link.click();
    showToast('高清卡片已下载');
  }

  function resetForm() {
    Object.entries(defaults).forEach(([key, value]) => { elements[key].value = value; });
    elements.theme.value = 'lavender';
    elements.size.value = '1080x1440';
    elements.photoZoom.value = '100';
    elements.photoPositionX.value = '50';
    elements.photoPosition.value = '35';
    elements.photoInput.value = '';
    elements.uploadTitle.textContent = '点击或拖拽上传照片';
    portraitImage = null;
    renderCard();
    showToast('已恢复示例内容');
  }

  [
    elements.name,
    elements.role,
    elements.price,
    elements.tip,
    elements.bio,
    elements.footer,
    elements.contact,
    elements.watermark,
    elements.photoZoom,
    elements.photoPositionX,
    elements.photoPosition
  ].forEach((element) => element.addEventListener('input', renderCard));
  [elements.theme, elements.size].forEach((element) => element.addEventListener('change', renderCard));
  elements.photoInput.addEventListener('change', (event) => loadImageFile(event.target.files[0]));
  elements.smartFit.addEventListener('click', () => applySmartFraming(true));
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
