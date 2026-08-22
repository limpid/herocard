(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['dossier'] = {
    key: 'dossier',
    file: 'q09-dossier.html',
    name: '报价档案',
    tagline: '档案卡式明细表，冷静专业',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.deep;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 90; x < 900; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 60);
        ctx.lineTo(x, 1140);
        ctx.stroke();
      }
      for (let y = 90; y < 1200; y += 90) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(850, y);
        ctx.stroke();
      }

      const serial = Array.from(d.name).reduce((sum, ch) => sum + ch.codePointAt(0), 7) % 9000 + 1000;
      ctx.textAlign = 'left';
      ctx.fillStyle = pal.glow;
      ctx.font = `700 20px ${SANS}`;
      ctx.fillText('QUOTATION · 报价档案', 60, 84);
      ctx.textAlign = 'right';
      ctx.fillStyle = pal.accent;
      ctx.fillText(`NO. ${serial}`, 840, 84);
      ctx.textAlign = 'left';

      ctx.save();
      h.roundedRect(ctx, 470, 130, 360, 400, 10);
      ctx.clip();
      h.drawPhoto(star, pal, 470, 130, 360, 400);
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      h.roundedRect(ctx, 470, 130, 360, 400, 10);
      ctx.stroke();
      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 3;
      [[460, 120, 1, 1], [840, 120, -1, 1], [460, 540, 1, -1], [840, 540, -1, -1]].forEach(([bx, by, sx, sy]) => {
        ctx.beginPath();
        ctx.moveTo(bx + sx * 30, by);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx, by + sy * 30);
        ctx.stroke();
      });

      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = `600 14px ${SANS}`;
      ctx.fillText('姓名 NAME', 60, 190);
      const nameSize = h.fitFont(d.name, 340, 30, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${nameSize}px ${SANS}`;
      ctx.fillText(d.name, 60, 226);

      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 264);
      ctx.lineTo(420, 264);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = `600 14px ${SANS}`;
      ctx.fillText('身份 ROLE', 60, 304);
      const tagSize = h.fitFont(d.tag, 340, 24, 600);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = `600 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 60, 340);

      ctx.beginPath();
      ctx.moveTo(60, 382);
      ctx.lineTo(420, 382);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = `600 14px ${SANS}`;
      ctx.fillText('有效期 VALID', 60, 422);
      const validitySize = h.fitFont(d.validity, 340, 22, 700);
      ctx.fillStyle = pal.accent;
      ctx.font = `700 ${validitySize}px ${SANS}`;
      ctx.fillText(d.validity, 60, 456);

      h.fillRoundRect(ctx, 60, 580, 780, 340, 14, 'rgba(255,255,255,0.06)');
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.lineWidth = 1;
      h.roundedRect(ctx, 60, 580, 780, 340, 14);
      ctx.stroke();
      ctx.fillStyle = pal.glow;
      ctx.font = `600 15px ${SANS}`;
      ctx.fillText('报价明细 PRICE LIST', 90, 620);

      d.items.forEach((item, index) => {
        const rowY = 672 + index * 64;
        const itemNameSize = h.fitFont(item.name, 460, 21, 600);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `600 ${itemNameSize}px ${SANS}`;
        ctx.fillText(item.name, 90, rowY);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(item.price, 200, 26, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(item.price, 810, rowY);
        ctx.textAlign = 'left';
        if (index < 3) {
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(90, rowY + 22);
          ctx.lineTo(810, rowY + 22);
          ctx.stroke();
        }
      });

      const tipSize = h.fitFont(d.tip, 700, 15, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 60, 962);

      const seed = Array.from(d.name).reduce((sum, ch) => sum + ch.codePointAt(0), 3);
      let barX = 60;
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      for (let i = 0; i < 42; i += 1) {
        const barWidth = (i * 7 + seed) % 3 + 1;
        if (i % 2 === 0) ctx.fillRect(barX, 1000, barWidth, 52);
        barX += barWidth + 2;
      }

      const contactSize = h.fitFont(contact, 620, 22, 700);
      ctx.fillStyle = pal.accent;
      ctx.font = `700 ${contactSize}px ${SANS}`;
      ctx.fillText(contact, 60, 1098);

      const footerSize = h.fitFont(d.footer, 600, 14, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 60, 1140);

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.09 });
    }
  };
})();
