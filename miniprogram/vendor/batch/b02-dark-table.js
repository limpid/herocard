var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['dark-table'] = {
    key: 'dark-table',
    file: 'b02-dark-table.html',
    name: '暗夜行情',
    tagline: '深色底高对比，报价一目了然',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = pal.deep;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 680, 34, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 95);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(410, 112, 80, 3);

      h.fillRoundRect(ctx, 60, 150, 780, 800, 18, 'rgba(255,255,255,0.06)');
      ctx.strokeStyle = 'rgba(255,255,255,0.14)';
      ctx.lineWidth = 1;
      h.roundedRect(ctx, 60, 150, 780, 800, 18);
      ctx.stroke();

      ctx.fillStyle = pal.glow;
      ctx.font = `700 16px ${SANS}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[0], 100, 194);
      ctx.textAlign = 'right';
      ctx.fillText(d.columns[1], 520, 194);
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[2], 580, 194);

      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 210);
      ctx.lineTo(820, 210);
      ctx.stroke();

      const tableTop = 226;
      const tableBottom = 926;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 52 ? 20 : rowHeight >= 42 ? 18 : 16;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;
        if (index % 2 === 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.04)';
          ctx.fillRect(70, rowY, 760, rowHeight);
        }
        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 260, bodyFont, 700);
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${nameSize}px ${SANS}`;
        ctx.fillText(row.a || '—', 100, baseline);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 170, bodyFont + 3, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(row.b || '—', 520, baseline);
        ctx.textAlign = 'left';
        const workSize = h.fitFont(row.c || '—', 250, bodyFont - 4, 400);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `400 ${workSize}px ${SANS}`;
        ctx.fillText(row.c || '—', 580, baseline);
        if (index < rows.length - 1) {
          ctx.strokeStyle = 'rgba(255,255,255,0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, rowY + rowHeight);
          ctx.lineTo(820, rowY + rowHeight);
          ctx.stroke();
        }
      });

      ctx.textAlign = 'center';
      const contactSize = h.fitFont(contact, 480, 19, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.roundedRect(ctx, 450 - contactWidth / 2 - 34, 980, contactWidth + 68, 50, 25);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = pal.glow;
      ctx.fillText(contact, 450, 1013);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1140);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.1 });
    }
  };
})();
