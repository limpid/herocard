var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['magazine'] = {
    key: 'magazine',
    file: 'q06-magazine.html',
    name: '杂志分栏',
    tagline: '左图右文杂志分栏，编辑气质',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '洽谈代言合作';

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, 380, 1200);
      ctx.clip();
      h.drawPhoto(star, pal, 0, 0, 380, 1200);
      ctx.restore();
      const scrim = ctx.createLinearGradient(0, 900, 0, 1200);
      scrim.addColorStop(0, h.hexToRgba(pal.deep, 0));
      scrim.addColorStop(1, h.hexToRgba(pal.deep, 0.5));
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 900, 380, 300);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(380, 0, 520, 1200);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#9997a2';
      ctx.font = `600 12px ${SANS}`;
      ctx.fillText('QUOTATION · 明星报价', 430, 88);

      const titleSize = h.fitFont(d.title, 420, 26, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 430, 138);

      const nameSize = h.fitFont(d.name, 420, 44, 800);
      ctx.font = `800 ${nameSize}px ${SANS}`;
      ctx.fillText(d.name, 430, 224);

      const tagSize = h.fitFont(d.tag, 400, 17, 500);
      ctx.fillStyle = '#8a8896';
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 432, 262);

      ctx.strokeStyle = '#edecf2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(430, 292);
      ctx.lineTo(840, 292);
      ctx.stroke();

      d.items.forEach((item, index) => {
        const rowY = 352 + index * 76;
        const itemNameSize = h.fitFont(item.name, 320, 20, 600);
        ctx.fillStyle = '#3f3e49';
        ctx.font = `600 ${itemNameSize}px ${SANS}`;
        ctx.fillText(item.name, 430, rowY);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(item.price, 180, 28, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(item.price, 840, rowY);
        ctx.textAlign = 'left';
        if (index < 3) {
          ctx.strokeStyle = '#edecf2';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(430, rowY + 28);
          ctx.lineTo(840, rowY + 28);
          ctx.stroke();
        }
      });

      const validitySize = h.fitFont(d.validity, 400, 17, 600);
      ctx.fillStyle = pal.button;
      ctx.font = `600 ${validitySize}px ${SANS}`;
      ctx.fillText(d.validity, 430, 690);

      ctx.fillStyle = '#8a8896';
      ctx.font = `400 14px ${SANS}`;
      const tip = h.wrapText(d.tip, 400, 2);
      tip.lines.forEach((line, index) => ctx.fillText(line, 430, 736 + index * 26));

      const contactSize = h.fitFont(contact, 340, 19, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 430, 812, contactWidth + 64, 50, 25, pal.deep);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 462, 845);

      const footerSize = h.fitFont(d.footer, 400, 13, 500);
      ctx.fillStyle = '#9997a2';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 430, 1108);

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.12 });
    }
  };
})();
