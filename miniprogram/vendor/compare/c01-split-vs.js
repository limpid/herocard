var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['split-vs'] = {
    key: 'split-vs',
    file: 'c01-split-vs.html',
    name: '对垒分屏',
    tagline: '对角线分屏与中央 VS，对抗感最强',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.deep;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(520, 0);
      ctx.lineTo(400, 1200);
      ctx.lineTo(0, 1200);
      ctx.closePath();
      ctx.clip();
      h.drawPhoto(starA, pal, 0, 0, 520, 1200);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(520, 0);
      ctx.lineTo(900, 0);
      ctx.lineTo(900, 1200);
      ctx.lineTo(400, 1200);
      ctx.closePath();
      ctx.clip();
      h.drawPhoto(starB, pal, 380, 0, 520, 1200);
      ctx.restore();

      const scrim = ctx.createLinearGradient(0, 700, 0, 1200);
      scrim.addColorStop(0, h.hexToRgba(pal.deep, 0));
      scrim.addColorStop(1, h.hexToRgba(pal.deep, 0.94));
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 700, 900, 500);

      const topScrim = ctx.createLinearGradient(0, 0, 0, 160);
      topScrim.addColorStop(0, h.hexToRgba(pal.deep, 0.7));
      topScrim.addColorStop(1, h.hexToRgba(pal.deep, 0));
      ctx.fillStyle = topScrim;
      ctx.fillRect(0, 0, 900, 160);

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 700, 34, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 88);
      const footerSize = h.fitFont(d.footer, 560, 15, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 122);
      ctx.textAlign = 'left';

      ctx.beginPath();
      ctx.arc(450, 600, 82, 0, Math.PI * 2);
      ctx.fillStyle = pal.accent;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1c1c28';
      ctx.font = `800 52px ${SANS}`;
      ctx.fillText('VS', 450, 618);
      ctx.textAlign = 'left';

      const nameASize = h.fitFont(d.nameA, 340, 56, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameASize}px ${SANS}`;
      ctx.fillText(d.nameA, 50, 920);
      const tagASize = h.fitFont(d.tagA, 300, 22, 600);
      ctx.fillStyle = pal.glow;
      ctx.font = `600 ${tagASize}px ${SANS}`;
      ctx.fillText(d.tagA, 52, 958);
      const feeASize = h.fitFont(d.feeA, 320, 30, 800);
      ctx.font = `800 ${feeASize}px ${SANS}`;
      const feeAWidth = ctx.measureText(d.feeA).width;
      h.fillRoundRect(ctx, 50, 986, feeAWidth + 44, 52, 26, pal.accent);
      ctx.fillStyle = '#1c1c28';
      ctx.fillText(d.feeA, 72, 1022);

      ctx.textAlign = 'right';
      const nameBSize = h.fitFont(d.nameB, 340, 56, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameBSize}px ${SANS}`;
      ctx.fillText(d.nameB, 850, 920);
      const tagBSize = h.fitFont(d.tagB, 300, 22, 600);
      ctx.fillStyle = pal.glow;
      ctx.font = `600 ${tagBSize}px ${SANS}`;
      ctx.fillText(d.tagB, 848, 958);
      const feeBSize = h.fitFont(d.feeB, 320, 30, 800);
      ctx.font = `800 ${feeBSize}px ${SANS}`;
      const feeBWidth = ctx.measureText(d.feeB).width;
      h.fillRoundRect(ctx, 850 - feeBWidth - 44, 986, feeBWidth + 44, 52, 26, pal.accent);
      ctx.fillStyle = '#1c1c28';
      ctx.fillText(d.feeB, 850 - 22, 1022);

      ctx.textAlign = 'center';
      const tipSize = h.fitFont(d.tip, 640, 17, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.62)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 1092);
      const contactSize = h.fitFont(contact, 560, 21, 700);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${contactSize}px ${SANS}`;
      ctx.fillText(contact, 450, 1134);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.12 });
    }
  };
})();
