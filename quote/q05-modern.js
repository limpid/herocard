(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['modern'] = {
    key: 'modern',
    file: 'q05-modern.html',
    name: '渐变横幅',
    tagline: '渐变底与横幅大图，现代明快',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '商务合作洽谈';

      const bg = ctx.createLinearGradient(0, 0, 900, 1200);
      bg.addColorStop(0, pal.light);
      bg.addColorStop(1, pal.dark);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.save();
      ctx.shadowColor = 'rgba(40, 35, 80, 0.3)';
      ctx.shadowBlur = 34;
      ctx.shadowOffsetY = 16;
      h.fillRoundRect(ctx, 80, 130, 740, 700, 28, '#ffffff');
      ctx.restore();

      ctx.save();
      h.roundedRect(ctx, 120, 170, 660, 300, 20);
      ctx.clip();
      h.drawPhoto(star, pal, 120, 170, 660, 300);
      ctx.restore();

      ctx.textAlign = 'left';
      const nameSize = h.fitFont(d.name, 500, 34, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${nameSize}px ${SANS}`;
      ctx.fillText(d.name, 130, 548);
      const tagSize = h.fitFont(d.tag, 400, 17, 500);
      ctx.fillStyle = '#8a8896';
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 132, 583);

      d.items.forEach((item, index) => {
        const rowY = 628 + index * 56;
        const itemNameSize = h.fitFont(item.name, 380, 20, 600);
        ctx.fillStyle = '#3f3e49';
        ctx.font = `600 ${itemNameSize}px ${SANS}`;
        ctx.fillText(item.name, 130, rowY);

        const priceSize = h.fitFont(item.price, 160, 19, 700);
        ctx.font = `700 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(item.price).width;
        h.fillRoundRect(ctx, 770 - priceWidth - 36, rowY - 30, priceWidth + 36, 42, 21, pal.soft);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.button;
        ctx.fillText(item.price, 752, rowY - 3);
        ctx.textAlign = 'left';
      });

      ctx.textAlign = 'center';
      const validitySize = h.fitFont(d.validity, 420, 16, 600);
      ctx.font = `600 ${validitySize}px ${SANS}`;
      const validityWidth = ctx.measureText(d.validity).width;
      h.roundedRect(ctx, 450 - validityWidth / 2 - 28, 862, validityWidth + 56, 42, 21);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(d.validity, 450, 890);

      const tipSize = h.fitFont(d.tip, 640, 15, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 952);

      const contactSize = h.fitFont(contact, 480, 21, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 38, 990, contactWidth + 76, 54, 27, '#ffffff');
      ctx.fillStyle = pal.ink;
      ctx.fillText(contact, 450, 1026);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1088);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.12 });
    }
  };
})();
