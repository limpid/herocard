(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['spotlight'] = {
    key: 'spotlight',
    file: 'c02-spotlight.html',
    name: '焦点对决',
    tagline: '双聚光灯圆形头像，报价大字陈列',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.deep;
      ctx.fillRect(0, 0, 900, 1200);

      [[225, 430], [675, 430]].forEach(([cx, cy]) => {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
        glow.addColorStop(0, h.hexToRgba(pal.light, 0.35));
        glow.addColorStop(1, h.hexToRgba(pal.light, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, 300, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 700, 32, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 96);

      ctx.save();
      ctx.beginPath();
      ctx.arc(225, 430, 168, 0, Math.PI * 2);
      ctx.clip();
      h.drawPhoto(starA, pal, 57, 262, 336, 336);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(225, 430, 176, 0, Math.PI * 2);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(675, 430, 168, 0, Math.PI * 2);
      ctx.clip();
      h.drawPhoto(starB, pal, 507, 262, 336, 336);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(675, 430, 176, 0, Math.PI * 2);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(450, 430, 46, 0, Math.PI * 2);
      ctx.fillStyle = pal.accent;
      ctx.fill();
      ctx.fillStyle = '#1c1c28';
      ctx.font = `800 24px ${SANS}`;
      ctx.fillText('VS', 450, 439);

      const nameASize = h.fitFont(d.nameA, 320, 42, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameASize}px ${SANS}`;
      ctx.fillText(d.nameA, 225, 690);
      const tagASize = h.fitFont(d.tagA, 280, 19, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = `500 ${tagASize}px ${SANS}`;
      ctx.fillText(d.tagA, 225, 726);

      const nameBSize = h.fitFont(d.nameB, 320, 42, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameBSize}px ${SANS}`;
      ctx.fillText(d.nameB, 675, 690);
      const tagBSize = h.fitFont(d.tagB, 280, 19, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = `500 ${tagBSize}px ${SANS}`;
      ctx.fillText(d.tagB, 675, 726);

      const feeASize = h.fitFont(d.feeA, 300, 44, 800);
      ctx.fillStyle = pal.accent;
      ctx.font = `800 ${feeASize}px ${SANS}`;
      ctx.fillText(d.feeA, 225, 812);

      const feeBSize = h.fitFont(d.feeB, 300, 44, 800);
      ctx.fillStyle = pal.accent;
      ctx.font = `800 ${feeBSize}px ${SANS}`;
      ctx.fillText(d.feeB, 675, 812);

      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 866);
      ctx.lineTo(800, 866);
      ctx.stroke();

      const tipSize = h.fitFont(d.tip, 640, 17, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 916);

      const contactSize = h.fitFont(contact, 480, 22, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 40, 958, contactWidth + 80, 54, 27, pal.button);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 450, 994);

      const footerSize = h.fitFont(d.footer, 600, 15, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1064);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.12 });
    }
  };
})();
