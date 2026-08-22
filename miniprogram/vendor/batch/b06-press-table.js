var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';
  const SERIF = '"Noto Serif SC", Georgia, serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['press-table'] = {
    key: 'press-table',
    file: 'b06-press-table.html',
    name: '报纸行情',
    tagline: '报纸行情版式，复古可信',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 58);
      ctx.lineTo(840, 58);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 68);
      ctx.lineTo(840, 68);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#141414';
      ctx.font = `800 36px ${SERIF}`;
      ctx.fillText('明星行情', 450, 116);
      ctx.fillStyle = '#5a5850';
      ctx.font = `500 13px ${SANS}`;
      ctx.fillText('STAR MARKET QUOTATIONS · 批量报价', 450, 144);
      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, 162);
      ctx.lineTo(840, 162);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 168);
      ctx.lineTo(840, 168);
      ctx.stroke();

      ctx.fillStyle = '#141414';
      ctx.font = `800 16px ${SERIF}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[0], 90, 206);
      ctx.textAlign = 'right';
      ctx.fillText(d.columns[1], 540, 206);
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[2], 610, 206);
      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, 220);
      ctx.lineTo(830, 220);
      ctx.moveTo(70, 225);
      ctx.lineTo(830, 225);
      ctx.stroke();

      const tableTop = 240;
      const tableBottom = 1030;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 52 ? 19 : rowHeight >= 42 ? 17 : 15;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;
        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 270, bodyFont, 600);
        ctx.fillStyle = '#141414';
        ctx.font = `600 ${nameSize}px ${SERIF}`;
        ctx.fillText(row.a || '—', 90, baseline);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 170, bodyFont + 1, 800);
        ctx.fillStyle = pal.button;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(row.b || '—', 540, baseline);
        ctx.textAlign = 'left';
        const workSize = h.fitFont(row.c || '—', 230, bodyFont - 3, 400);
        ctx.fillStyle = '#75726a';
        ctx.font = `400 ${workSize}px ${SERIF}`;
        ctx.fillText(row.c || '—', 610, baseline);
        if (index < rows.length - 1) {
          ctx.strokeStyle = '#d9d3c3';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(70, rowY + rowHeight);
          ctx.lineTo(830, rowY + rowHeight);
          ctx.stroke();
        }
      });

      ctx.strokeStyle = '#161616';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 1052);
      ctx.lineTo(840, 1052);
      ctx.moveTo(60, 1057);
      ctx.lineTo(840, 1057);
      ctx.stroke();

      const contactSize = h.fitFont(contact, 640, 20, 800);
      ctx.fillStyle = pal.button;
      ctx.font = `800 ${contactSize}px ${SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText(contact, 450, 1102);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = '#75726a';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1148);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#1a1a1a', alpha: 0.07 });
    }
  };
})();
