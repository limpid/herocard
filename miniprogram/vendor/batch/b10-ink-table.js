(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';
  const SERIF = '"Noto Serif SC", Georgia, serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['ink-table'] = {
    key: 'ink-table',
    file: 'b10-ink-table.html',
    name: '中式雅表',
    tagline: '朱红表头与衬线，东方韵味',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const sealRed = '#b03a2e';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 1;
      ctx.strokeRect(34, 34, 832, 1132);
      ctx.strokeRect(46, 46, 808, 1108);

      h.fillRoundRect(ctx, 760, 60, 68, 68, 8, sealRed);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = `700 34px ${SERIF}`;
      ctx.fillText('報', 794, 108);

      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(180, 92);
      ctx.lineTo(360, 92);
      ctx.moveTo(540, 92);
      ctx.lineTo(720, 92);
      ctx.stroke();

      const titleSize = h.fitFont(d.title, 460, 34, 800);
      ctx.fillStyle = '#26231f';
      ctx.font = `800 ${titleSize}px ${SERIF}`;
      ctx.fillText(d.title, 450, 104);
      ctx.fillStyle = '#8b8577';
      ctx.font = `600 12px ${SANS}`;
      ctx.fillText('QUOTATION · 行情一览', 450, 133);

      ctx.fillStyle = '#26231f';
      ctx.font = `800 16px ${SERIF}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[0], 90, 196);
      ctx.textAlign = 'right';
      ctx.fillText(d.columns[1], 540, 196);
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[2], 610, 196);
      ctx.strokeStyle = sealRed;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(70, 213);
      ctx.lineTo(830, 213);
      ctx.moveTo(70, 218);
      ctx.lineTo(830, 218);
      ctx.stroke();

      const tableTop = 232;
      const tableBottom = 1030;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 52 ? 19 : rowHeight >= 42 ? 17 : 15;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;
        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 270, bodyFont, 600);
        ctx.fillStyle = '#26231f';
        ctx.font = `600 ${nameSize}px ${SERIF}`;
        ctx.fillText(row.a || '—', 90, baseline);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 170, bodyFont + 2, 800);
        ctx.fillStyle = sealRed;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(row.b || '—', 540, baseline);
        ctx.textAlign = 'left';
        const workSize = h.fitFont(row.c || '—', 230, bodyFont - 3, 400);
        ctx.fillStyle = '#6f6a5d';
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

      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(84, 1062);
      ctx.lineTo(816, 1062);
      ctx.stroke();

      const contactSize = h.fitFont(contact, 640, 20, 700);
      ctx.fillStyle = sealRed;
      ctx.font = `700 ${contactSize}px ${SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText(contact, 450, 1108);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = '#8b8577';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1150);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3a362e', alpha: 0.09 });
    }
  };
})();
