(function () {
  'use strict';

  function isMobileEnvironment() {
    const ua = navigator.userAgent || '';
    if (/Android|iPhone|iPad|iPod|Mobile|MicroMessenger/i.test(ua)) return true;
    if (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua)) return true;
    return false;
  }

  let overlay = null;
  let toastTimer = null;

  function notify(text) {
    const toast = document.getElementById('toast');
    if (!toast || !text) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function closeOverlay() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function showSaveOverlay(dataUrl, filename) {
    closeOverlay();

    overlay = document.createElement('div');
    overlay.className = 'save-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', '保存图片到相册');

    const title = document.createElement('div');
    title.className = 'save-overlay-title';
    title.textContent = '长按图片，保存到手机相册';

    const image = document.createElement('img');
    image.className = 'save-overlay-img';
    image.src = dataUrl;
    image.alt = '生成的卡片图片';

    const hint = document.createElement('div');
    hint.className = 'save-overlay-hint';
    hint.textContent = '在微信或浏览器中长按上方图片，选择「保存图片 / 存储图像」，即可存入手机相册。';

    const actions = document.createElement('div');
    actions.className = 'save-overlay-actions';

    const fileLink = document.createElement('a');
    fileLink.className = 'save-overlay-secondary';
    fileLink.href = dataUrl;
    fileLink.download = filename;
    fileLink.textContent = '下载 PNG 文件';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'save-overlay-close';
    closeButton.textContent = '完成';
    closeButton.addEventListener('click', closeOverlay);

    actions.appendChild(fileLink);
    actions.appendChild(closeButton);
    overlay.appendChild(title);
    overlay.appendChild(image);
    overlay.appendChild(hint);
    overlay.appendChild(actions);
    document.body.appendChild(overlay);
  }

  window.saveCanvasImage = function (canvas, filename, messages) {
    const options = messages || {};
    const dataUrl = canvas.toDataURL('image/png', 1);

    if (!isMobileEnvironment()) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
      notify(options.desktop || '高清卡片已下载');
      return;
    }

    showSaveOverlay(dataUrl, filename);
    notify(options.mobile || '长按图片即可保存到相册');
  };
})();
