var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['price-list'] = {
    key: 'price-list',
    file: 'q01-price-list.html',
    name: '价目单',
    tagline: '简洁价目排版，报价一目了然',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 2;
      h.roundedRect(ctx, 30, 30, 840, 1140, 10);
      ctx.stroke();

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 640, 30, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 100);
      ctx.fillStyle = '#9997a2';
      ctx.font = `600 13px ${SANS}`;
      ctx.fillText('QUOTATION · 明星商务报价', 450, 128);

      ctx.save();
      ctx.beginPath();
      ctx.arc(450, 265, 105, 0, Math.PI * 2);
      ctx.clip();
      h.drawPhoto(star, pal, 345, 160, 210, 210);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(450, 265, 112, 0, Math.PI * 2);
      ctx.strokeStyle = pal.dark;
      ctx.lineWidth = 3;
      ctx.stroke();

      const nameSize = h.fitFont(d.name, 500, 34, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${nameSize}px ${SANS}`;
      ctx.fillText(d.name, 450, 428);
      const tagSize = h.fitFont(d.tag, 400, 18, 500);
      ctx.fillStyle = '#8a8896';
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 450, 464);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(425, 494, 50, 3);

      d.items.forEach((item, index) => {
        const rowY = 552 + index * 62;
        ctx.textAlign = 'left';
        const itemNameSize = h.fitFont(item.name, 420, 22, 600);
        ctx.fillStyle = '#3f3e49';
        ctx.font = `600 ${itemNameSize}px ${SANS}`;
        ctx.fillText(item.name, 110, rowY);
        const nameWidth = ctx.measureText(item.name).width;

        const priceSize = h.fitFont(item.price, 240, 26, 800);
        ctx.font = `800 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(item.price).width;
        ctx.strokeStyle = '#d0cdd9';
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.moveTo(126 + nameWidth, rowY - 6);
        ctx.lineTo(764 - priceWidth, rowY - 6);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.accent;
        ctx.fillText(item.price, 790, rowY);
        ctx.textAlign = 'center';
      });

      const validitySize = h.fitFont(d.validity, 420, 16, 600);
      ctx.font = `600 ${validitySize}px ${SANS}`;
      const validityWidth = ctx.measureText(d.validity).width;
      h.fillRoundRect(ctx, 450 - validityWidth / 2 - 26, 800, validityWidth + 52, 44, 22, pal.paper);
      ctx.strokeStyle = pal.line;
      ctx.lineWidth = 1.5;
      h.roundedRect(ctx, 450 - validityWidth / 2 - 26, 800, validityWidth + 52, 44, 22);
      ctx.stroke();
      ctx.fillStyle = pal.button;
      ctx.fillText(d.validity, 450, 829);

      h.fillRoundRect(ctx, 110, 872, 680, 78, 10, pal.paper);
      ctx.strokeStyle = pal.line;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      h.roundedRect(ctx, 110, 872, 680, 78, 10);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#6f6d7a';
      ctx.font = `400 16px ${SANS}`;
      const tip = h.wrapText(d.tip, 620, 2);
      tip.lines.forEach((line, index) => ctx.fillText(line, 450, 902 + index * 28));

      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 36, 990, contactWidth + 72, 52, 26, pal.deep);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 450, 1024);

      const footerSize = h.fitFont(d.footer, 600, 14, 500);
      ctx.fillStyle = '#9997a2';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1100);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
