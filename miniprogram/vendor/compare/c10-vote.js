var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['vote'] = {
    key: 'vote',
    file: 'c10-vote.html',
    name: '票选对决',
    tagline: '选票式排版与勾选框，引导用户决策',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 700, 50, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 112);

      const tipSize = h.fitFont(d.tip, 640, 16, 400);
      ctx.fillStyle = '#8a8896';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 156);

      const drawBallot = (cardX, center, star, name, tag, fee) => {
        ctx.save();
        ctx.shadowColor = 'rgba(48, 45, 90, 0.16)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 10;
        h.fillRoundRect(ctx, cardX, 200, 370, 630, 20, '#ffffff');
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cardX + 48, 252, 18, 0, Math.PI * 2);
        ctx.strokeStyle = pal.button;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.save();
        h.roundedRect(ctx, cardX + 45, 296, 280, 290, 16);
        ctx.clip();
        h.drawPhoto(star, pal, cardX + 45, 296, 280, 290);
        ctx.restore();

        const nameSize = h.fitFont(name, 320, 38, 800);
        ctx.fillStyle = pal.ink;
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(name, center, 648);

        const tagSize = h.fitFont(tag, 300, 17, 500);
        ctx.fillStyle = '#8a8896';
        ctx.font = `500 ${tagSize}px ${SANS}`;
        ctx.fillText(tag, center, 682);

        const feeSize = h.fitFont(fee, 300, 34, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${feeSize}px ${SANS}`;
        ctx.fillText(fee, center, 762);
      };

      drawBallot(70, 255, starA, d.nameA, d.tagA, d.feeA);
      drawBallot(460, 645, starB, d.nameB, d.tagB, d.feeB);

      ctx.beginPath();
      ctx.arc(450, 515, 52, 0, Math.PI * 2);
      ctx.fillStyle = pal.accent;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.fillStyle = '#1c1c28';
      ctx.font = `800 26px ${SANS}`;
      ctx.fillText('VS', 450, 525);

      const contactSize = h.fitFont(contact, 480, 22, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 40, 906, contactWidth + 80, 56, 28, pal.button);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 450, 944);

      const footerSize = h.fitFont(d.footer, 600, 15, 500);
      ctx.fillStyle = '#9997a2';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1030);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
