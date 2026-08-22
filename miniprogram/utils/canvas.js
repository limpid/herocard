/** canvas 2d 初始化、图片加载与保存相册 */

function initCanvas(selector) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select(selector).fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        reject(new Error('画布未就绪'));
        return;
      }
      resolve({ canvas: res[0].node, width: res[0].width, height: res[0].height });
    });
  });
}

function loadImage(canvas, src) {
  return new Promise((resolve, reject) => {
    const img = canvas.createImage();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = src;
  });
}

function toTempFile(canvas) {
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath({
      canvas: canvas,
      success: (res) => resolve(res.tempFilePath),
      fail: reject
    });
  });
}

function saveToAlbum(canvas) {
  return toTempFile(canvas).then((tempPath) => new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath: tempPath,
      success: () => resolve(tempPath),
      fail: (err) => {
        const denied = err && err.errMsg && err.errMsg.indexOf('auth') > -1;
        if (denied) {
          wx.showModal({
            title: '需要相册权限',
            content: '请在设置中开启「保存到相册」权限后重试',
            confirmText: '去设置',
            success: (r) => { if (r.confirm) wx.openSetting(); }
          });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
        reject(err);
      }
    });
  }));
}

/** 按照片比例智能适配（与 Web 端算法一致） */
function smartFit(image) {
  const ratio = image.width / image.height;
  if (ratio < 0.85) return { zoom: 82, focusY: 22 };
  if (ratio < 1.3) return { zoom: 92, focusY: 30 };
  return { zoom: 100, focusY: 50 };
}

module.exports = {
  initCanvas: initCanvas,
  loadImage: loadImage,
  toTempFile: toTempFile,
  saveToAlbum: saveToAlbum,
  smartFit: smartFit
};
