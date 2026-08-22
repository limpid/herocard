(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['luxury'] = {
    key: 'luxury',
    file: 'q03-luxury.html',
    name: '奢华拱窗',
    tagline: '深色底与拱形大图，高端商务感',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.deep;
      ctx.fillRect(0, 0, 900, 1200);
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 40, 820, 1120);

      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(180, 92);
      ctx.lineTo(320, 92);
      ctx.moveTo(580, 92);
      ctx.lineTo(720, 92);
      ctx.stroke();

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 560, 26, 800);
      ctx.fillStyle = pal.accent;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 104);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(300, 470);
      ctx.lineTo(300, 280);
      ctx.arc(450, 280, 150, Math.PI, 0);
      ctx.lineTo(600, 470);
      ctx.closePath();
      ctx.clip();
      h.drawPhoto(star, pal, 300, 130, 300, 340);
      ctx.restore();
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(300, 470);
      ctx.lineTo(300, 280);
      ctx.arc(450, 280, 150, Math.PI, 0);
      ctx.lineTo(600, 470);
      ctx.stroke();

      const nameSize = h.fitFont(d.name, 500, 36, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameSize}px ${SANS}`;
      ctx.fillText(d.name, 450, 548);
      const tagSize = h.fitFont(d.tag, 400, 18, 500);
      ctx.fillStyle = pal.glow;
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 450, 586);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(410, 614, 80, 2);

      d.items.forEach((item, index) => {
        const rowY = 676 + index * 64;
        ctx.textAlign = 'left';
        const itemNameSize = h.fitFont(item.name, 400, 20, 600);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `600 ${itemNameSize}px ${SANS}`;
        ctx.fillText(item.name, 150, rowY);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(item.price, 220, 26, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(item.price, 750, rowY);
        if (index < 3) {
          ctx.strokeStyle = 'rgba(255,255,255,0.12)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(150, rowY + 22);
          ctx.lineTo(750, rowY + 22);
          ctx.stroke();
        }
        ctx.textAlign = 'center';
      });

      const validitySize = h.fitFont(d.validity, 460, 16, 600);
      ctx.fillStyle = pal.glow;
      ctx.font = `600 ${validitySize}px ${SANS}`;
      ctx.fillText(`· ${d.validity} ·`, 450, 945);

      const tipSize = h.fitFont(d.tip, 640, 15, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 986);

      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 36, 1020, contactWidth + 72, 52, 26, pal.accent);
      ctx.fillStyle = '#17171f';
      ctx.fillText(contact, 450, 1054);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1112);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.1 });
    }
  };
})();
