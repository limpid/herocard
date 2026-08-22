var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';
  const SERIF = '"Noto Serif SC", Georgia, serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['press-duel'] = {
    key: 'press-duel',
    file: 'c07-press-duel.html',
    name: '报纸对决',
    tagline: '黑白双栏与报纸刊头，可信复古',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '洽谈代言合作请联系';

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 62);
      ctx.lineTo(840, 62);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 72);
      ctx.lineTo(840, 72);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#141414';
      ctx.font = `800 38px ${SERIF}`;
      ctx.fillText('对决周报', 450, 112);
      ctx.fillStyle = '#5a5850';
      ctx.font = `500 15px ${SANS}`;
      ctx.fillText('DUEL WEEKLY · 代言人选对比', 450, 142);
      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 162);
      ctx.lineTo(840, 162);
      ctx.stroke();

      const drawSide = (photoX, center, star, tag, name, fee) => {
        ctx.save();
        ctx.filter = 'grayscale(1) contrast(1.05)';
        ctx.beginPath();
        ctx.rect(photoX, 190, 330, 400);
        ctx.clip();
        h.drawPhoto(star, pal, photoX, 190, 330, 400);
        ctx.restore();
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 2;
        ctx.strokeRect(photoX, 190, 330, 400);

        const tagSize = h.fitFont(tag, 300, 16, 400);
        ctx.fillStyle = '#75726a';
        ctx.font = `400 ${tagSize}px ${SANS}`;
        ctx.fillText(tag, center, 626);

        const nameSize = h.fitFont(name, 310, 38, 800);
        ctx.fillStyle = '#111111';
        ctx.font = `800 ${nameSize}px ${SERIF}`;
        ctx.fillText(name, center, 706);

        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 2;
        ctx.strokeRect(photoX, 736, 330, 52);
        const feeSize = h.fitFont(fee, 290, 22, 800);
        ctx.fillStyle = '#141414';
        ctx.font = `800 ${feeSize}px ${SANS}`;
        ctx.fillText(fee, center, 771);
      };

      drawSide(85, 250, starA, d.tagA, d.nameA, d.feeA);
      drawSide(485, 650, starB, d.tagB, d.nameB, d.feeB);

      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(450, 190);
      ctx.lineTo(450, 790);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(450, 480, 42, 0, Math.PI * 2);
      ctx.fillStyle = pal.soft;
      ctx.fill();
      ctx.strokeStyle = '#141414';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#111111';
      ctx.font = `800 24px ${SERIF}`;
      ctx.fillText('VS', 450, 489);

      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 840);
      ctx.lineTo(840, 840);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 844);
      ctx.lineTo(840, 844);
      ctx.stroke();

      const titleSize = h.fitFont(d.title, 680, 24, 800);
      ctx.fillStyle = '#111111';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 892);

      const contactSize = h.fitFont(contact, 680, 22, 800);
      ctx.fillStyle = pal.button;
      ctx.font = `800 ${contactSize}px ${SANS}`;
      ctx.fillText(contact, 450, 940);

      const tipSize = h.fitFont(d.tip, 680, 15, 400);
      ctx.fillStyle = '#75726a';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 976);

      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 1096);
      ctx.lineTo(840, 1096);
      ctx.stroke();
      const footerSize = h.fitFont(d.footer, 600, 15, 500);
      ctx.fillStyle = '#75726a';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1132);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#1a1a1a', alpha: 0.07 });
    }
  };
})();
