(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['glass'] = {
    key: 'glass',
    file: 'q08-glass.html',
    name: '玻璃报价',
    tagline: '通透玻璃面板，轻盈现代',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '商务合作洽谈';

      const bg = ctx.createLinearGradient(0, 0, 900, 1200);
      bg.addColorStop(0, pal.dark);
      bg.addColorStop(1, pal.deep);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 900, 1200);

      const blobA = ctx.createRadialGradient(180, 280, 0, 180, 280, 360);
      blobA.addColorStop(0, h.hexToRgba(pal.light, 0.4));
      blobA.addColorStop(1, h.hexToRgba(pal.light, 0));
      ctx.fillStyle = blobA;
      ctx.beginPath();
      ctx.arc(180, 280, 360, 0, Math.PI * 2);
      ctx.fill();

      const blobB = ctx.createRadialGradient(740, 980, 0, 740, 980, 380);
      blobB.addColorStop(0, h.hexToRgba(pal.accent, 0.35));
      blobB.addColorStop(1, h.hexToRgba(pal.accent, 0));
      ctx.fillStyle = blobB;
      ctx.beginPath();
      ctx.arc(740, 980, 380, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 640, 30, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 92);

      const glassFill = 'rgba(255,255,255,0.2)';
      const glassStroke = 'rgba(255,255,255,0.55)';
      h.fillRoundRect(ctx, 80, 130, 740, 760, 28, glassFill);
      ctx.strokeStyle = glassStroke;
      ctx.lineWidth = 2;
      h.roundedRect(ctx, 80, 130, 740, 760, 28);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(450, 300, 110, 0, Math.PI * 2);
      ctx.clip();
      h.drawPhoto(star, pal, 340, 190, 220, 220);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(450, 300, 117, 0, Math.PI * 2);
      ctx.strokeStyle = glassStroke;
      ctx.lineWidth = 3;
      ctx.stroke();

      const nameSize = h.fitFont(d.name, 500, 34, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameSize}px ${SANS}`;
      ctx.fillText(d.name, 450, 478);
      const tagSize = h.fitFont(d.tag, 400, 17, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 450, 512);

      d.items.forEach((item, index) => {
        const rowY = 565 + index * 58;
        ctx.textAlign = 'left';
        const itemNameSize = h.fitFont(item.name, 380, 20, 600);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `600 ${itemNameSize}px ${SANS}`;
        ctx.fillText(item.name, 130, rowY);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(item.price, 200, 26, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(item.price, 770, rowY);
        ctx.textAlign = 'center';
        if (index < 3) {
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(130, rowY + 20);
          ctx.lineTo(770, rowY + 20);
          ctx.stroke();
        }
      });

      const validitySize = h.fitFont(d.validity, 420, 16, 600);
      ctx.font = `600 ${validitySize}px ${SANS}`;
      const validityWidth = ctx.measureText(d.validity).width;
      h.roundedRect(ctx, 450 - validityWidth / 2 - 28, 922, validityWidth + 56, 42, 21);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(d.validity, 450, 950);

      const tipSize = h.fitFont(d.tip, 640, 15, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 996);

      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 38, 1030, contactWidth + 76, 52, 26, pal.accent);
      ctx.fillStyle = '#17171f';
      ctx.fillText(contact, 450, 1064);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1122);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.15 });
    }
  };
})();
