var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['stacked'] = {
    key: 'stacked',
    file: 'c04-stacked.html',
    name: '上下对台',
    tagline: '上下双舞台与中带 VS，纵向对比',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '洽谈代言合作';

      ctx.fillStyle = pal.deep;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 900, 540);
      ctx.clip();
      h.drawPhoto(starA, pal, 0, 0, 900, 540);
      ctx.restore();
      const scrimA = ctx.createLinearGradient(0, 260, 0, 540);
      scrimA.addColorStop(0, h.hexToRgba(pal.deep, 0));
      scrimA.addColorStop(1, h.hexToRgba(pal.deep, 0.88));
      ctx.fillStyle = scrimA;
      ctx.fillRect(0, 260, 900, 280);
      const topScrim = ctx.createLinearGradient(0, 0, 0, 150);
      topScrim.addColorStop(0, h.hexToRgba(pal.deep, 0.7));
      topScrim.addColorStop(1, h.hexToRgba(pal.deep, 0));
      ctx.fillStyle = topScrim;
      ctx.fillRect(0, 0, 900, 150);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 660, 900, 540);
      ctx.clip();
      h.drawPhoto(starB, pal, 0, 660, 900, 540);
      ctx.restore();
      const scrimB = ctx.createLinearGradient(0, 660, 0, 960);
      scrimB.addColorStop(0, h.hexToRgba(pal.deep, 0.85));
      scrimB.addColorStop(1, h.hexToRgba(pal.deep, 0));
      ctx.fillStyle = scrimB;
      ctx.fillRect(0, 660, 900, 300);
      const bottomScrim = ctx.createLinearGradient(0, 1000, 0, 1200);
      bottomScrim.addColorStop(0, h.hexToRgba(pal.deep, 0));
      bottomScrim.addColorStop(1, h.hexToRgba(pal.deep, 0.85));
      ctx.fillStyle = bottomScrim;
      ctx.fillRect(0, 1000, 900, 200);

      ctx.fillStyle = pal.accent;
      ctx.fillRect(0, 540, 900, 4);
      ctx.fillRect(0, 656, 900, 4);

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 700, 32, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 88);
      const footerTopSize = h.fitFont(d.footer, 560, 15, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = `500 ${footerTopSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 122);
      ctx.textAlign = 'left';

      const nameASize = h.fitFont(d.nameA, 400, 46, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameASize}px ${SANS}`;
      ctx.fillText(d.nameA, 60, 430);
      const tagASize = h.fitFont(d.tagA, 320, 18, 600);
      ctx.fillStyle = pal.glow;
      ctx.font = `600 ${tagASize}px ${SANS}`;
      ctx.fillText(d.tagA, 62, 466);
      const feeASize = h.fitFont(d.feeA, 320, 26, 800);
      ctx.font = `800 ${feeASize}px ${SANS}`;
      const feeAWidth = ctx.measureText(d.feeA).width;
      h.fillRoundRect(ctx, 60, 478, feeAWidth + 44, 48, 24, pal.accent);
      ctx.fillStyle = '#1c1c28';
      ctx.fillText(d.feeA, 82, 511);

      ctx.textAlign = 'right';
      const nameBSize = h.fitFont(d.nameB, 400, 46, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameBSize}px ${SANS}`;
      ctx.fillText(d.nameB, 840, 760);
      const tagBSize = h.fitFont(d.tagB, 320, 18, 600);
      ctx.fillStyle = pal.glow;
      ctx.font = `600 ${tagBSize}px ${SANS}`;
      ctx.fillText(d.tagB, 838, 796);
      const feeBSize = h.fitFont(d.feeB, 320, 26, 800);
      ctx.font = `800 ${feeBSize}px ${SANS}`;
      const feeBWidth = ctx.measureText(d.feeB).width;
      h.fillRoundRect(ctx, 840 - feeBWidth - 44, 808, feeBWidth + 44, 48, 24, pal.accent);
      ctx.fillStyle = '#1c1c28';
      ctx.fillText(d.feeB, 840 - 22, 841);
      ctx.textAlign = 'left';

      ctx.beginPath();
      ctx.arc(450, 600, 50, 0, Math.PI * 2);
      ctx.fillStyle = pal.accent;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1c1c28';
      ctx.font = `800 28px ${SANS}`;
      ctx.fillText('VS', 450, 610);

      const tipSize = h.fitFont(d.tip, 640, 16, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 1090);
      const contactSize = h.fitFont(contact, 560, 20, 700);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${contactSize}px ${SANS}`;
      ctx.fillText(contact, 450, 1130);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.12 });
    }
  };
})();
