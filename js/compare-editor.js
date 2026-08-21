(function () {
  'use strict';

  const canvas = document.getElementById('cardCanvas');
  const ctx = canvas.getContext('2d');
  const helpers = window.CARD_HELPERS;
  const templateKey = document.body.dataset.compare || 'split-vs';

  const elements = {
    photoInputA: document.getElementById('photoInputA'),
    photoInputB: document.getElementById('photoInputB'),
    photoZoomA: document.getElementById('photoZoomA'),
    photoZoomValueA: document.getElementById('photoZoomValueA'),
    photoPositionA: document.getElementById('photoPositionA'),
    photoZoomB: document.getElementById('photoZoomB'),
    photoZoomValueB: document.getElementById('photoZoomValueB'),
    photoPositionB: document.getElementById('photoPositionB'),
    uploadZoneA: document.getElementById('uploadZoneA'),
    uploadZoneB: document.getElementById('uploadZoneB'),
    uploadTitleA: document.getElementById('uploadTitleA'),
    uploadTitleB: document.getElementById('uploadTitleB'),
    title: document.getElementById('titleInput'),
    tip: document.getElementById('tipInput'),
    nameA: document.getElementById('nameAInput'),
    tagA: document.getElementById('tagAInput'),
    feeA: document.getElementById('feeAInput'),
    nameB: document.getElementById('nameBInput'),
    tagB: document.getElementById('tagBInput'),
    feeB: document.getElementById('feeBInput'),
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

  const defaults = {
    title: '代言人对比 · 谁更适合你的品牌',
    tip: '报价仅供参考，以实际沟通为准',
    nameA: '沈亦舟',
    tagA: '影视演员',
    feeA: '出场费 80万/场',
    nameB: '顾南枝',
    tagB: '全能艺人',
    feeB: '出场费 120万/场',
    contact: '',
    footer: '点击联系经纪人，锁定心仪人选',
    watermark: ''
  };

  let imageA = null;
  let imageB = null;
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
    const template = window.COMPARE_TEMPLATES && window.COMPARE_TEMPLATES[templateKey];
    if (!template) return;

    const [outputWidth, outputHeight] = elements.size.value.split('x').map(Number);
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const scale = outputWidth / 900;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const data = {
      title: elements.title.value.trim() || '代言人对比',
      tip: elements.tip.value.trim() || '报价仅供参考',
      contact: elements.contact.value.trim(),
      footer: elements.footer.value.trim() || '填写底部说明文字',
      watermark: elements.watermark.value,
      themeKey: elements.theme.value,
      imageA,
      imageB,
      zoomA: Number(elements.photoZoomA.value),
      zoomB: Number(elements.photoZoomB.value),
      focusYA: Number(elements.photoPositionA.value),
      focusYB: Number(elements.photoPositionB.value),
      nameA: elements.nameA.value.trim() || '明星 A',
      tagA: elements.tagA.value.trim() || '身份标签',
      feeA: elements.feeA.value.trim() || '出场费 面议',
      nameB: elements.nameB.value.trim() || '明星 B',
      tagB: elements.tagB.value.trim() || '身份标签',
      feeB: elements.feeB.value.trim() || '出场费 面议'
    };

    helpers.setDrawingContext(ctx);
    ctx.clearRect(0, 0, 900, 1200);
    template.render(ctx, data, helpers);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    elements.photoZoomValueA.textContent = `${elements.photoZoomA.value}%`;
    elements.photoZoomValueB.textContent = `${elements.photoZoomB.value}%`;
    elements.sizeBadge.textContent = `${outputWidth} × ${outputHeight} px`;
    updateCharCounts();
  }

  function applySmartFraming(image, zoomInput, positionInput) {
    const ratio = image.width / image.height;
    if (ratio < 0.85) {
      zoomInput.value = '82';
      positionInput.value = '22';
    } else if (ratio < 1.3) {
      zoomInput.value = '92';
      positionInput.value = '30';
    } else {
      zoomInput.value = '100';
      positionInput.value = '50';
    }
  }

  function loadImageFile(file, slot) {
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
        if (slot === 'A') {
          imageA = image;
          elements.uploadTitleA.textContent = file.name;
          applySmartFraming(image, elements.photoZoomA, elements.photoPositionA);
        } else {
          imageB = image;
          elements.uploadTitleB.textContent = file.name;
          applySmartFraming(image, elements.photoZoomB, elements.photoPositionB);
        }
        renderCard();
        showToast(`明星 ${slot} 照片已更新`);
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
    const template = window.COMPARE_TEMPLATES[templateKey];
    const safeA = (elements.nameA.value.trim() || 'A').replace(/[\\/:*?"<>|]/g, '-');
    const safeB = (elements.nameB.value.trim() || 'B').replace(/[\\/:*?"<>|]/g, '-');
    const link = document.createElement('a');
    link.download = `${safeA}-vs-${safeB}-${template ? template.name : '对比'}.png`;
    link.href = canvas.toDataURL('image/png', 1);
    link.click();
    showToast('高清对比卡片已下载');
  }

  function resetForm() {
    Object.entries(defaults).forEach(([key, value]) => { elements[key].value = value; });
    elements.theme.value = 'lavender';
    elements.size.value = '1080x1440';
    elements.photoZoomA.value = '100';
    elements.photoPositionA.value = '35';
    elements.photoZoomB.value = '100';
    elements.photoPositionB.value = '35';
    elements.photoInputA.value = '';
    elements.photoInputB.value = '';
    elements.uploadTitleA.textContent = '上传明星 A 照片';
    elements.uploadTitleB.textContent = '上传明星 B 照片';
    imageA = null;
    imageB = null;
    renderCard();
    showToast('已恢复示例内容');
  }

  [
    elements.title, elements.tip,
    elements.nameA, elements.tagA, elements.feeA,
    elements.nameB, elements.tagB, elements.feeB,
    elements.contact, elements.footer, elements.watermark,
    elements.photoZoomA, elements.photoPositionA,
    elements.photoZoomB, elements.photoPositionB
  ].forEach((element) => element.addEventListener('input', renderCard));
  [elements.theme, elements.size].forEach((element) => element.addEventListener('change', renderCard));
  elements.photoInputA.addEventListener('change', (event) => loadImageFile(event.target.files[0], 'A'));
  elements.photoInputB.addEventListener('change', (event) => loadImageFile(event.target.files[0], 'B'));
  elements.download.addEventListener('click', downloadCard);
  elements.reset.addEventListener('click', resetForm);

  [['uploadZoneA', 'A'], ['uploadZoneB', 'B']].forEach(([zoneId, slot]) => {
    const zone = elements[zoneId];
    ['dragenter', 'dragover'].forEach((eventName) => {
      zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        zone.classList.add('is-dragging');
      });
    });
    ['dragleave', 'drop'].forEach((eventName) => {
      zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        zone.classList.remove('is-dragging');
      });
    });
    zone.addEventListener('drop', (event) => loadImageFile(event.dataTransfer.files[0], slot));
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(renderCard);
  renderCard();
})();
