var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['glass-table'] = {
    key: 'glass-table',
    file: 'b09-glass-table.html',
    name: '玻璃行情',
    tagline: '渐变底玻璃面板，通透精致',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      const bg = ctx.createLinearGradient(0, 0, 900, 1200);
      bg.addColorStop(0, pal.dark);
      bg.addColorStop(1, pal.deep);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 900, 1200);

      const blobA = ctx.createRadialGradient(180, 260, 0, 180, 260, 380);
      blobA.addColorStop(0, h.hexToRgba(pal.light, 0.4));
      blobA.addColorStop(1, h.hexToRgba(pal.light, 0));
      ctx.fillStyle = blobA;
      ctx.beginPath();
      ctx.arc(180, 260, 380, 0, Math.PI * 2);
      ctx.fill();

      const blobB = ctx.createRadialGradient(740, 1000, 0, 740, 1000, 400);
      blobB.addColorStop(0, h.hexToRgba(pal.accent, 0.35));
      blobB.addColorStop(1, h.hexToRgba(pal.accent, 0));
      ctx.fillStyle = blobB;
      ctx.beginPath();
      ctx.arc(740, 1000, 400, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 680, 32, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 92);

      h.fillRoundRect(ctx, 70, 130, 760, 830, 28, 'rgba(255,255,255,0.2)');
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 2;
      h.roundedRect(ctx, 70, 130, 760, 830, 28);
      ctx.stroke();

      ctx.fillStyle = pal.glow;
      ctx.font = `700 16px ${SANS}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[0], 105, 182);
      ctx.textAlign = 'right';
      ctx.fillText(d.columns[1], 530, 182);
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[2], 600, 182);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(90, 198);
      ctx.lineTo(810, 198);
      ctx.stroke();

      const tableTop = 210;
      const tableBottom = 930;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 52 ? 20 : rowHeight >= 42 ? 18 : 16;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;
        if (index % 2 === 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.fillRect(78, rowY, 744, rowHeight);
        }
        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 260, bodyFont, 700);
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${nameSize}px ${SANS}`;
        ctx.fillText(row.a || '—', 105, baseline);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 180, bodyFont + 3, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(row.b || '—', 530, baseline);
        ctx.textAlign = 'left';
        const workSize = h.fitFont(row.c || '—', 230, bodyFont - 4, 400);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = `400 ${workSize}px ${SANS}`;
        ctx.fillText(row.c || '—', 600, baseline);
        if (index < rows.length - 1) {
          ctx.strokeStyle = 'rgba(255,255,255,0.12)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(90, rowY + rowHeight);
          ctx.lineTo(810, rowY + rowHeight);
          ctx.stroke();
        }
      });

      ctx.textAlign = 'center';
      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 38, 990, contactWidth + 76, 52, 26, pal.accent);
      ctx.fillStyle = '#17171f';
      ctx.fillText(contact, 450, 1024);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1130);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.15 });
    }
  };
})();
