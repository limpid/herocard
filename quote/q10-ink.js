(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';
  const SERIF = '"Noto Serif SC", Georgia, serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['ink'] = {
    key: 'ink',
    file: 'q10-ink.html',
    name: '中式红笺',
    tagline: '朱红点缀与雅致留白，东方韵味',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '商务合作洽谈';
      const sealRed = '#b03a2e';

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 2;
      ctx.strokeRect(34, 34, 832, 1132);

      ctx.save();
      ctx.beginPath();
      ctx.rect(90, 100, 320, 440);
      ctx.clip();
      h.drawPhoto(star, pal, 90, 100, 320, 440);
      ctx.restore();
      ctx.strokeStyle = '#26231f';
      ctx.lineWidth = 3;
      ctx.strokeRect(90, 100, 320, 440);

      h.fillRoundRect(ctx, 336, 466, 74, 74, 8, sealRed);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = `700 38px ${SERIF}`;
      ctx.fillText(Array.from(d.name)[0] || '星', 373, 520);
      ctx.textAlign = 'left';

      const titleSize = h.fitFont(d.title, 380, 28, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 160);

      const nameSize = h.fitFont(d.name, 380, 40, 800);
      ctx.fillStyle = '#26231f';
      ctx.font = `800 ${nameSize}px ${SERIF}`;
      ctx.fillText(d.name, 450, 228);

      const tagSize = h.fitFont(d.tag, 340, 18, 500);
      ctx.fillStyle = '#6f6a5d';
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 452, 268);

      ctx.fillStyle = sealRed;
      ctx.fillRect(450, 298, 56, 3);

      d.items.forEach((item, index) => {
        const rowY = 360 + index * 58;
        const itemNameSize = h.fitFont(item.name, 300, 21, 600);
        ctx.fillStyle = '#3a362e';
        ctx.font = `600 ${itemNameSize}px ${SERIF}`;
        ctx.fillText(item.name, 450, rowY);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(item.price, 180, 24, 800);
        ctx.fillStyle = sealRed;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(item.price, 810, rowY);
        ctx.textAlign = 'left';
      });

      const validitySize = h.fitFont(d.validity, 400, 18, 600);
      ctx.fillStyle = sealRed;
      ctx.font = `600 ${validitySize}px ${SANS}`;
      ctx.fillText(d.validity, 90, 620);

      h.fillRoundRect(ctx, 90, 658, 760, 92, 10, '#ffffff');
      ctx.strokeStyle = '#d9d3c3';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      h.roundedRect(ctx, 90, 658, 760, 92, 10);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#6f6a5d';
      ctx.font = `400 16px ${SANS}`;
      ctx.textAlign = 'center';
      const tip = h.wrapText(d.tip, 700, 2);
      tip.lines.forEach((line, index) => ctx.fillText(line, 470, 692 + index * 30));

      ctx.textAlign = 'left';
      const contactSize = h.fitFont(contact, 620, 26, 700);
      ctx.fillStyle = sealRed;
      ctx.font = `700 ${contactSize}px ${SANS}`;
      ctx.fillText(contact, 90, 850);

      h.fillRoundRect(ctx, 736, 800, 80, 80, 8, sealRed);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = `700 40px ${SERIF}`;
      ctx.fillText('報', 776, 856);
      ctx.textAlign = 'left';

      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(84, 1090);
      ctx.lineTo(816, 1090);
      ctx.stroke();
      const footerSize = h.fitFont(d.footer, 600, 14, 500);
      ctx.fillStyle = '#8b8577';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText(d.footer, 450, 1128);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3a362e', alpha: 0.09 });
    }
  };
})();
