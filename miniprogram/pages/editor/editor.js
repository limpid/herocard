const schema = require('../../utils/schema.js');
const canvasUtil = require('../../utils/canvas.js');

const RENDER_DEBOUNCE = 280;

Page({
  data: {
    group: 'single',
    tplKey: 'classic',
    tplName: '',
    tagline: '',
    themeOptions: schema.themeOptions,
    sizeOptions: schema.sizeOptions,
    themeKey: 'lavender',
    sizeKey: '1080x1440',
    sizeLabel: '1080 × 1440',
    cw: 320,
    ch: 427,
    safeBottom: 0,
    form: {},
    hasPhoto: false,
    hasPhotoA: false,
    hasPhotoB: false,
    logoWatermark: false,
    logoMode: 'tile',
    logoSrc: ''
  },

  onLoad(options) {
    const group = schema.groups.some((g) => g.key === options.g) ? options.g : 'single';
    const map = schema.templates[group];
    const tplKey = map && map[options.t] ? options.t : Object.keys(map || { classic: 1 })[0];
    const meta = map[tplKey] || { name: '经典图文', tagline: '' };
    const form = JSON.parse(JSON.stringify(schema.defaults[group]));

    // 点击进入模板即记一次使用（本地立即、后端异步上报，失败不影响使用）
    getApp().globalData.usage.record(group, tplKey);

    // 新 API 优先（getWindowInfo 同步返回），旧基础库回退 getSystemInfoSync
    const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    // 页面左右 padding 24rpx×2 + 预览容器 padding 16rpx×2（rpx → px 按 750 基准换算）
    const insets = Math.ceil(info.windowWidth / 750 * 80);
    const cw = Math.round(info.windowWidth - insets);
    const ch = Math.round(cw * 4 / 3);

    // 底部安全区（避免 calc 混合单位在真机失效，改为 JS 计算注入）
    const safeBottom = info.safeArea
      ? Math.max(info.screenHeight - info.safeArea.bottom, 0)
      : 0;

    this.setData({
      group: group,
      tplKey: tplKey,
      tplName: meta.name,
      tagline: meta.tagline,
      form: form,
      cw: cw,
      ch: ch,
      safeBottom: safeBottom
    });
    wx.setNavigationBarTitle({ title: meta.name + ' · 星风暴人物卡片生成器' });

    this.images = { main: null, a: null, b: null };
    this.renderTimer = null;
    this.canvas = null;
    this.ctx = null;
    this.logoImg = null;

    // 记住用户对图片水印的开关与位置选择（默认关闭，仅用户显式开启过才为开）
    try {
      const savedMode = wx.getStorageSync('herocard-logo-wm-mode');
      this.setData({
        logoWatermark: wx.getStorageSync('herocard-logo-wm') === 'on',
        logoMode: savedMode === 'corner' ? 'corner' : 'tile'
      });
    } catch (e) { /* 保持默认 */ }
  },

  onReady() {
    canvasUtil.initCanvas('#card').then((res) => {
      // 页面可能已被快速关闭（返回主页），此时放弃初始化
      if (this.unloaded || !res) return;
      this.canvas = res.canvas;
      this.ctx = res.canvas.getContext('2d');
      this.loadDefaultLogo();
      this.renderNow();
    });
  },

  /* ---------- 图片水印 ---------- */

  loadDefaultLogo() {
    // 优先加载包内真实 Logo（assets/star_storm_logo_64x64.png，读为 base64 规避包路径限制）；
    // 文件不存在或加载失败时，回退到离屏 canvas 绘制的内置星形 Logo。
    const path = '/assets/star_storm_logo_64x64.png';
    wx.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'base64',
      success: (res) => {
        const dataUrl = 'data:image/png;base64,' + res.data;
        canvasUtil.loadImage(this.canvas, dataUrl)
          .then((img) => {
            this.logoImg = img;
            this.setData({ logoSrc: dataUrl });
            this.renderNow();
          })
          .catch(() => this.useBuiltinLogo());
      },
      fail: () => this.useBuiltinLogo()
    });
  },

  useBuiltinLogo() {
    this.setData({ logoSrc: 'default' });
    this.drawDefaultLogoToCanvas().then((img) => {
      this.logoImg = img;
      this.renderNow();
    }).catch(() => { /* 绘制失败不启用 */ });
  },

  /** 离屏绘制星风暴风格 Logo（深紫圆角底 + 白色五角星），返回可绘制的 Image */
  drawDefaultLogoToCanvas() {
    return new Promise((resolve, reject) => {
      try {
        const off = wx.createOffscreenCanvas ? wx.createOffscreenCanvas({ type: '2d', width: 128, height: 128 }) : null;
        if (!off) { reject(new Error('offscreen unsupported')); return; }
        const c = off.getContext('2d');
        // 深紫圆角底
        c.fillStyle = '#5d58db';
        c.beginPath();
        const r = 20, x = 4, y = 4, w = 120, h = 120;
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
        c.fill();
        // 白色描边
        c.strokeStyle = 'rgba(255,255,255,0.5)';
        c.lineWidth = 3;
        c.stroke();
        // 白色五角星
        c.fillStyle = '#ffffff';
        c.beginPath();
        const cx = 64, cy = 60, R = 30, rr = 13;
        for (let i = 0; i < 10; i += 1) {
          const rad = (-90 + i * 36) * Math.PI / 180;
          const rR = i % 2 === 0 ? R : rr;
          const px = cx + rR * Math.cos(rad);
          const py = cy + rR * Math.sin(rad);
          if (i === 0) c.moveTo(px, py); else c.lineTo(px, py);
        }
        c.closePath();
        c.fill();
        // 离屏 canvas 转 data URL 再转 Image
        const dataUrl = off.toDataURL ? off.toDataURL('image/png') : '';
        if (dataUrl) {
          canvasUtil.loadImage(this.canvas, dataUrl).then(resolve).catch(reject);
        } else {
          reject(new Error('no dataURL'));
        }
      } catch (e) { reject(e); }
    });
  },

  onLogoWatermarkToggle(event) {
    const on = event.detail.value;
    this.setData({ logoWatermark: on });
    try { wx.setStorageSync('herocard-logo-wm', on ? 'on' : 'off'); } catch (e) { /* 忽略 */ }
    this.renderNow();
  },

  onLogoMode(event) {
    const mode = event.currentTarget.dataset.mode;
    if (mode === this.data.logoMode) return;
    this.setData({ logoMode: mode });
    try { wx.setStorageSync('herocard-logo-wm-mode', mode); } catch (e) { /* 忽略 */ }
    this.renderNow();
  },

  /** 点击缩略图放大预览 */
  onPreviewLogo() {
    const src = this.data.logoSrc;
    // 内置 Logo：从离屏 canvas 生成临时文件预览
    if (src === 'default' && this.logoImg) {
      const off = wx.createOffscreenCanvas({ type: '2d', width: 128, height: 128 });
      const c = off.getContext('2d');
      c.drawImage(this.logoImg, 0, 0, 128, 128);
      wx.canvasToTempFilePath({
        canvas: off,
        success: (res) => wx.previewImage({ urls: [res.tempFilePath] }),
        fail: () => wx.showToast({ title: '预览失败', icon: 'none' })
      });
      return;
    }
    // 真实 Logo（data URL）：写临时文件后预览
    if (src.indexOf('data:') === 0) {
      const dest = wx.env.USER_DATA_PATH + '/logo-preview.png';
      wx.getFileSystemManager().writeFile({
        filePath: dest,
        data: src.split(',')[1],
        encoding: 'base64',
        success: () => wx.previewImage({ urls: [dest] }),
        fail: () => wx.showToast({ title: '预览失败', icon: 'none' })
      });
      return;
    }
    // 自定义图（临时路径）
    if (src.indexOf('tmp') > -1 || src.indexOf('wxfile') > -1) {
      wx.previewImage({ urls: [src] });
      return;
    }
    wx.showToast({ title: 'Logo 加载中', icon: 'none' });
  },

  onChooseLogo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath;
        canvasUtil.loadImage(this.canvas, tempPath)
          .then((img) => {
            this.logoImg = img;
            this.setData({ logoSrc: tempPath, logoWatermark: true });
            this.renderNow();
            wx.showToast({ title: '水印图片已更换', icon: 'none' });
          })
          .catch(() => wx.showToast({ title: '图片读取失败', icon: 'none' }));
      }
    });
  },

  /** 在 900×1200 逻辑坐标系内绘制图片水印（tile=全图平铺 / corner=左上角） */
  drawImageWatermark(ctx, img) {
    if (this.data.logoMode === 'corner') {
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.drawImage(img, 36, 36, 56, 56);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.rotate(-Math.PI / 6);
    ctx.globalAlpha = 0.13;
    const size = 52;
    const gapX = 210;
    const gapY = 150;
    for (let y = -1000; y < 2300; y += gapY) {
      for (let x = -800; x < 1800; x += gapX) {
        ctx.drawImage(img, x, y, size, size);
      }
    }
    ctx.restore();
  },

  onUnload() {
    this.unloaded = true;
    clearTimeout(this.renderTimer);
  },

  /* ---------- 数据组装（与 Web 端编辑器逻辑一致） ---------- */

  buildData() {
    const d = this.data.form;
    const themeKey = this.data.themeKey;
    if (this.data.group === 'single') {
      return {
        name: (d.name || '').trim() || '人物名称',
        role: (d.role || '').trim() || '身份标签',
        price: (d.price || '').trim() || '重点信息',
        tip: (d.tip || '').trim() || '在这里填写提示语',
        bio: (d.bio || '').trim() || '在这里填写人物介绍，让读者快速了解人物经历、特点和代表作品。',
        footer: (d.footer || '').trim() || '填写底部说明文字',
        contact: (d.contact || '').trim(),
        watermark: d.watermark || '',
        themeKey: themeKey,
        image: this.images.main,
        focusX: Number(d.focusX),
        focusY: Number(d.focusY),
        zoom: Number(d.zoom)
      };
    }
    if (this.data.group === 'compare') {
      return {
        title: (d.title || '').trim() || '代言人对比',
        tip: (d.tip || '').trim() || '报价仅供参考',
        contact: (d.contact || '').trim(),
        footer: (d.footer || '').trim() || '填写底部说明文字',
        watermark: d.watermark || '',
        themeKey: themeKey,
        imageA: this.images.a,
        imageB: this.images.b,
        zoomA: Number(d.zoomA),
        zoomB: Number(d.zoomB),
        focusYA: Number(d.focusYA),
        focusYB: Number(d.focusYB),
        nameA: (d.nameA || '').trim() || '明星 A',
        tagA: (d.tagA || '').trim() || '身份标签',
        feeA: (d.feeA || '').trim() || '出场费 面议',
        nameB: (d.nameB || '').trim() || '明星 B',
        tagB: (d.tagB || '').trim() || '身份标签',
        feeB: (d.feeB || '').trim() || '出场费 面议'
      };
    }
    if (this.data.group === 'quote') {
      const defaults = schema.defaults.quote.items;
      return {
        title: (d.title || '').trim() || '商务合作报价单',
        validity: (d.validity || '').trim() || '报价有效期：30天',
        name: (d.name || '').trim() || '明星姓名',
        tag: (d.tag || '').trim() || '身份标签',
        image: this.images.main,
        zoom: Number(d.zoom),
        focusY: Number(d.focusY),
        items: d.items.map((item, index) => ({
          name: (item.name || '').trim() || defaults[index].name,
          price: (item.price || '').trim() || '面议'
        })),
        tip: (d.tip || '').trim() || '报价备注说明',
        contact: (d.contact || '').trim(),
        footer: (d.footer || '').trim() || '填写底部说明文字',
        watermark: d.watermark || '',
        themeKey: themeKey
      };
    }
    return {
      title: (d.title || '').trim() || '明星艺人商务报价表',
      columns: [
        (d.columns[0] || '').trim() || '明星艺人',
        (d.columns[1] || '').trim() || '出场费/万',
        (d.columns[2] || '').trim() || '代表作品'
      ],
      rows: d.rows.map((row) => ({
        a: (row.a || '').trim(),
        b: (row.b || '').trim(),
        c: (row.c || '').trim()
      })),
      contact: (d.contact || '').trim(),
      footer: (d.footer || '').trim() || '填写底部说明文字',
      watermark: d.watermark || '',
      themeKey: themeKey
    };
  },

  /* ---------- 渲染 ---------- */

  renderNow() {
    if (!this.canvas || !this.ctx || this.unloaded) return;
    const app = getApp();
    const env = app.globalData.env;
    const registry = env.get();
    const template = registry[this.data.group][this.data.tplKey];
    if (!template) return;

    const parts = this.data.sizeKey.split('x');
    const w = Number(parts[0]);
    const h = Number(parts[1]);
    this.canvas.width = w;
    this.canvas.height = h;

    const ctx = this.ctx;
    const scale = w / 900;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const helpers = env.helpers();
    helpers.setDrawingContext(ctx);
    if (helpers.consumeBioOverflow) helpers.consumeBioOverflow();
    ctx.clearRect(0, 0, 900, 1200);
    template.render(ctx, this.buildData(), helpers);
    if (this.data.logoWatermark && this.logoImg) {
      this.drawImageWatermark(ctx, this.logoImg);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  },

  scheduleRender() {
    clearTimeout(this.renderTimer);
    this.renderTimer = setTimeout(() => this.renderNow(), RENDER_DEBOUNCE);
  },

  /* ---------- 表单 ---------- */

  onField(event) {
    const field = event.currentTarget.dataset.field;
    this.data.form[field] = event.detail.value;
    this.scheduleRender();
  },

  onSlider(event) {
    const field = event.currentTarget.dataset.field;
    const value = Number(event.detail.value);
    this.data.form[field] = value;
    this.setData({ ['form.' + field]: value });
    this.scheduleRender();
  },

  onTheme(event) {
    this.setData({ themeKey: event.currentTarget.dataset.key });
    this.scheduleRender();
  },

  onSize(event) {
    const idx = Number(event.detail.value);
    const option = schema.sizeOptions[idx];
    this.setData({
      sizeKey: option.key,
      sizeLabel: option.key.split('x').join(' × ')
    });
    this.renderNow();
  },

  /* ---------- 照片 ---------- */

  choosePhoto(slot) {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['original'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath;
        canvasUtil.loadImage(this.canvas, tempPath).then((image) => {
          const fit = canvasUtil.smartFit(image);
          if (slot === 'a') {
            this.images.a = image;
            this.data.form.zoomA = fit.zoom;
            this.data.form.focusYA = fit.focusY;
            this.setData({ hasPhotoA: true, 'form.zoomA': fit.zoom, 'form.focusYA': fit.focusY });
          } else if (slot === 'b') {
            this.images.b = image;
            this.data.form.zoomB = fit.zoom;
            this.data.form.focusYB = fit.focusY;
            this.setData({ hasPhotoB: true, 'form.zoomB': fit.zoom, 'form.focusYB': fit.focusY });
          } else {
            this.images.main = image;
            this.data.form.zoom = fit.zoom;
            this.data.form.focusY = fit.focusY;
            this.setData({ hasPhoto: true, 'form.zoom': fit.zoom, 'form.focusY': fit.focusY });
          }
          this.renderNow();
        }).catch(() => {
          wx.showToast({ title: '图片读取失败', icon: 'none' });
        });
      }
    });
  },

  onChoosePhoto() { this.choosePhoto('main'); },
  onChoosePhotoA() { this.choosePhoto('a'); },
  onChoosePhotoB() { this.choosePhoto('b'); },

  /* ---------- 报价项目 ---------- */

  onItemField(event) {
    const { ii, fi } = event.currentTarget.dataset;
    this.data.form.items[Number(ii)][fi] = event.detail.value;
    this.scheduleRender();
  },

  /* ---------- 批量行 ---------- */

  onRowField(event) {
    const { ri, fi } = event.currentTarget.dataset;
    this.data.form.rows[Number(ri)][fi] = event.detail.value;
    this.scheduleRender();
  },

  onColumnField(event) {
    const ci = Number(event.currentTarget.dataset.ci);
    this.data.form.columns[ci] = event.detail.value;
    this.scheduleRender();
  },

  addRow() {
    if (this.data.form.rows.length >= 16) {
      wx.showToast({ title: '最多 16 行', icon: 'none' });
      return;
    }
    this.data.form.rows.push({ a: '', b: '', c: '' });
    this.setData({ 'form.rows': this.data.form.rows });
    this.scheduleRender();
  },

  removeRow(event) {
    const ri = Number(event.currentTarget.dataset.ri);
    if (this.data.form.rows.length <= 4) {
      wx.showToast({ title: '至少保留 4 行', icon: 'none' });
      return;
    }
    this.data.form.rows.splice(ri, 1);
    this.setData({ 'form.rows': this.data.form.rows });
    this.scheduleRender();
  },

  /* ---------- 保存与分享 ---------- */

  onSave() {
    if (!this.canvas) return;
    this.renderNow();
    wx.showLoading({ title: '正在保存', mask: true });
    canvasUtil.saveToAlbum(this.canvas).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '已保存到相册', icon: 'success' });
    }).catch(() => {
      wx.hideLoading();
    });
  },

  onShareAppMessage() {
    return {
      title: '星风暴人物卡片生成器 · ' + this.data.tplName,
      path: '/pages/editor/editor?g=' + this.data.group + '&t=' + this.data.tplKey
    };
  },

  onShareTimeline() {
    return {
      title: '星风暴人物卡片生成器 · ' + this.data.tplName,
      query: 'g=' + this.data.group + '&t=' + this.data.tplKey
    };
  }
});
