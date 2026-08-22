(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['minimal-lines'] = {
    key: 'minimal-lines',
    file: 'b04-minimal-lines.html',
    name: '极简线表',
    tagline: '细线与大留白，安静有力',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 900, 1200);
      ctx.strokeStyle = '#edecf2';
      ctx.lineWidth = 2;
      h.roundedRect(ctx, 30, 30, 840, 1140, 10);
      ctx.stroke();

      ctx.textAlign = 'left';
      const titleSize = h.fitFont(d.title, 620, 40, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 80, 105);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#b9b7c4';
      ctx.font = `700 12px ${SANS}`;
      ctx.fillText('PRICE LIST', 820, 103);

      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 135);
      ctx.lineTo(820, 135);
      ctx.stroke();

      ctx.fillStyle = '#8a8896';
      ctx.font = `700 14px ${SANS}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[0], 80, 185);
      ctx.textAlign = 'right';
      ctx.fillText(d.columns[1], 560, 185);
      ctx.fillText(d.columns[2], 820, 185);
      ctx.strokeStyle = '#edecf2';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 205);
      ctx.lineTo(820, 205);
      ctx.stroke();

      const tableTop = 215;
      const tableBottom = 1010;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 52 ? 21 : rowHeight >= 42 ? 18 : 16;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;
        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 300, bodyFont, 600);
        ctx.fillStyle = pal.ink;
        ctx.font = `600 ${nameSize}px ${SANS}`;
        ctx.fillText(row.a || '—', 80, baseline);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 180, bodyFont + 2, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(row.b || '—', 560, baseline);
        const workSize = h.fitFont(row.c || '—', 230, bodyFont - 5, 400);
        ctx.fillStyle = '#8a8896';
        ctx.font = `400 ${workSize}px ${SANS}`;
        ctx.fillText(row.c || '—', 820, baseline);
        if (index < rows.length - 1) {
          ctx.strokeStyle = '#edecf2';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, rowY + rowHeight);
          ctx.lineTo(820, rowY + rowHeight);
          ctx.stroke();
        }
      });

      ctx.textAlign = 'center';
      const contactSize = h.fitFont(contact, 520, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      ctx.fillStyle = pal.ink;
      ctx.fillText(contact, 450, 1085);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(450 - contactWidth / 2, 1096, contactWidth, 3);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = '#b9b7c4';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1148);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
