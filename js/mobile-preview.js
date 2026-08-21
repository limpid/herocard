(function () {
  'use strict';

  const downloadButton = document.getElementById('downloadButton');
  const stage = document.querySelector('.canvas-stage');
  if (!downloadButton || !stage) return;

  document.body.classList.add('has-mobile-bar');

  const bar = document.createElement('div');
  bar.className = 'mobile-bar';

  const previewButton = document.createElement('button');
  previewButton.type = 'button';
  previewButton.className = 'mobile-bar-button';
  previewButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg><span>预览效果</span>';

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.className = 'mobile-bar-button mobile-bar-primary';
  saveButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19.5h14"/></svg><span>保存图片</span>';

  bar.appendChild(previewButton);
  bar.appendChild(saveButton);
  document.body.appendChild(bar);

  const modal = document.createElement('div');
  modal.className = 'preview-modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', '卡片预览');

  const head = document.createElement('div');
  head.className = 'preview-modal-head';
  const headTitle = document.createElement('span');
  headTitle.textContent = '实时预览';
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'preview-modal-close';
  closeButton.textContent = '关闭';
  head.appendChild(headTitle);
  head.appendChild(closeButton);

  const body = document.createElement('div');
  body.className = 'preview-modal-body';

  modal.appendChild(head);
  modal.appendChild(body);
  document.body.appendChild(modal);

  const stageParent = stage.parentNode;
  const stageNext = stage.nextSibling;

  function openModal() {
    body.appendChild(stage);
    modal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.hidden = true;
    stageParent.insertBefore(stage, stageNext);
    document.body.classList.remove('modal-open');
  }

  previewButton.addEventListener('click', openModal);
  saveButton.addEventListener('click', () => downloadButton.click());
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target === body) closeModal();
  });
})();
