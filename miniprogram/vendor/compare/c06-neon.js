var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['neon'] = {
    key: 'neon',
    file: 'c06-neon.html',
    name: '电竞霓虹',
    tagline: '霓虹描边与倾斜相框，热血电竞感',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '洽谈代言合作';

      ctx.fillStyle = '#0c0c14';
      ctx.fillRect(0, 0, 900, 1200);

      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let x = 75; x < 900; x += 75) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1200);
        ctx.stroke();
      }
      for (let y = 75; y < 1200; y += 75) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(900, y);
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      ctx.save();
      ctx.shadowColor = pal.glow;
      ctx.shadowBlur = 18;
      const titleSize = h.fitFont(d.title, 700, 32, 800);
      ctx.fillStyle = pal.glow;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 92);
      ctx.restore();

      const drawFrame = (cx, rotate, star) => {
        ctx.save();
        ctx.translate(cx, 400);
        ctx.rotate(rotate);
        ctx.save();
        h.roundedRect(ctx, -165, -225, 330, 450, 14);
        ctx.clip();
        h.drawPhoto(star, pal, -165, -225, 330, 450);
        ctx.restore();
        ctx.save();
        ctx.shadowColor = pal.glow;
        ctx.shadowBlur = 22;
        ctx.strokeStyle = pal.glow;
        ctx.lineWidth = 3;
        h.roundedRect(ctx, -165, -225, 330, 450, 14);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      };

      drawFrame(240, -0.055, starA);
      drawFrame(660, 0.055, starB);

      ctx.beginPath();
      ctx.arc(450, 400, 56, 0, Math.PI * 2);
      ctx.save();
      ctx.shadowColor = pal.glow;
      ctx.shadowBlur = 22;
      ctx.fillStyle = pal.deep;
      ctx.fill();
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = pal.glow;
      ctx.font = `800 28px ${SANS}`;
      ctx.fillText('VS', 450, 410);

      const nameASize = h.fitFont(d.nameA, 320, 40, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameASize}px ${SANS}`;
      ctx.fillText(d.nameA, 240, 740);
      const tagASize = h.fitFont(d.tagA, 280, 18, 500);
      ctx.fillStyle = pal.glow;
      ctx.font = `500 ${tagASize}px ${SANS}`;
      ctx.fillText(d.tagA, 240, 776);

      const nameBSize = h.fitFont(d.nameB, 320, 40, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameBSize}px ${SANS}`;
      ctx.fillText(d.nameB, 660, 740);
      const tagBSize = h.fitFont(d.tagB, 280, 18, 500);
      ctx.fillStyle = pal.glow;
      ctx.font = `500 ${tagBSize}px ${SANS}`;
      ctx.fillText(d.tagB, 660, 776);

      ctx.save();
      ctx.shadowColor = pal.accent;
      ctx.shadowBlur = 16;
      const feeASize = h.fitFont(d.feeA, 320, 36, 800);
      ctx.fillStyle = pal.accent;
      ctx.font = `800 ${feeASize}px ${SANS}`;
      ctx.fillText(d.feeA, 240, 852);
      const feeBSize = h.fitFont(d.feeB, 320, 36, 800);
      ctx.fillStyle = pal.accent;
      ctx.font = `800 ${feeBSize}px ${SANS}`;
      ctx.fillText(d.feeB, 660, 852);
      ctx.restore();

      const tipSize = h.fitFont(d.tip, 640, 16, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 940);

      ctx.save();
      ctx.shadowColor = pal.glow;
      ctx.shadowBlur = 14;
      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.roundedRect(ctx, 450 - contactWidth / 2 - 36, 972, contactWidth + 72, 52, 26);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = pal.glow;
      ctx.fillText(contact, 450, 1006);
      ctx.restore();

      const footerSize = h.fitFont(d.footer, 600, 14, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1078);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.12 });
    }
  };
})();
