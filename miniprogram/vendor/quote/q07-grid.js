(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['grid'] = {
    key: 'grid',
    file: 'q07-grid.html',
    name: '极简数字',
    tagline: '超大报价数字矩阵，视觉冲击',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '洽谈代言合作';

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 900, 1200);
      ctx.strokeStyle = '#edecf2';
      ctx.lineWidth = 2;
      h.roundedRect(ctx, 30, 30, 840, 1140, 10);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(160, 172, 78, 0, Math.PI * 2);
      ctx.clip();
      h.drawPhoto(star, pal, 82, 94, 156, 156);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(160, 172, 85, 0, Math.PI * 2);
      ctx.strokeStyle = pal.dark;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'left';
      const nameSize = h.fitFont(d.name, 420, 32, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${nameSize}px ${SANS}`;
      ctx.fillText(d.name, 282, 156);
      const tagSize = h.fitFont(d.tag, 380, 16, 500);
      ctx.fillStyle = '#8a8896';
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 284, 190);

      const titleSize = h.fitFont(d.title, 420, 20, 700);
      ctx.fillStyle = '#b9b7c4';
      ctx.font = `700 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 284, 232);

      ctx.strokeStyle = '#edecf2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 272);
      ctx.lineTo(800, 272);
      ctx.stroke();

      const cells = [[100, 310], [450, 310], [100, 530], [450, 530]];
      d.items.forEach((item, index) => {
        const [cellX, cellY] = cells[index];
        ctx.fillStyle = '#c9c7d2';
        ctx.font = `700 13px ${SANS}`;
        ctx.fillText(String(index + 1).padStart(2, '0'), cellX, cellY + 44);
        const priceSize = h.fitFont(item.price, 300, 46, 800);
        ctx.fillStyle = pal.button;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(item.price, cellX, cellY + 108);
        const itemNameSize = h.fitFont(item.name, 300, 16, 500);
        ctx.fillStyle = '#8a8896';
        ctx.font = `500 ${itemNameSize}px ${SANS}`;
        ctx.fillText(item.name, cellX, cellY + 148);
      });

      ctx.strokeStyle = '#edecf2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 790);
      ctx.lineTo(800, 790);
      ctx.stroke();

      const validitySize = h.fitFont(d.validity, 500, 17, 600);
      ctx.fillStyle = pal.button;
      ctx.font = `600 ${validitySize}px ${SANS}`;
      ctx.fillText(d.validity, 100, 846);

      ctx.fillStyle = '#8a8896';
      ctx.font = `400 15px ${SANS}`;
      const tip = h.wrapText(d.tip, 700, 2);
      tip.lines.forEach((line, index) => ctx.fillText(line, 100, 894 + index * 26));

      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.roundedRect(ctx, 100, 962, contactWidth + 60, 52, 26);
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = pal.ink;
      ctx.fillText(contact, 130, 996);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#b9b7c4';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1130);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
