var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['gradient-header'] = {
    key: 'gradient-header',
    file: 'b03-gradient-header.html',
    name: '渐变榜头',
    tagline: '大渐变题头，现代醒目',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 900, 1200);

      const header = ctx.createLinearGradient(50, 50, 850, 240);
      header.addColorStop(0, pal.light);
      header.addColorStop(1, pal.dark);
      h.roundedRect(ctx, 50, 50, 800, 190, 24);
      ctx.fillStyle = header;
      ctx.fill();

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 680, 38, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 128);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = `600 13px ${SANS}`;
      ctx.fillText('BATCH QUOTATION · 批量报价', 450, 164);

      ctx.fillStyle = pal.dark;
      ctx.font = `700 16px ${SANS}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[0], 80, 292);
      ctx.textAlign = 'right';
      ctx.fillText(d.columns[1], 540, 292);
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[2], 610, 292);

      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(70, 310);
      ctx.lineTo(830, 310);
      ctx.stroke();

      const tableTop = 322;
      const tableBottom = 1000;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 52 ? 20 : rowHeight >= 42 ? 18 : 16;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;
        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 280, bodyFont, 700);
        ctx.fillStyle = pal.ink;
        ctx.font = `700 ${nameSize}px ${SANS}`;
        ctx.fillText(row.a || '—', 80, baseline);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 180, bodyFont + 2, 800);
        ctx.fillStyle = pal.button;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(row.b || '—', 540, baseline);
        ctx.textAlign = 'left';
        const workSize = h.fitFont(row.c || '—', 240, bodyFont - 3, 400);
        ctx.fillStyle = '#8a8896';
        ctx.font = `400 ${workSize}px ${SANS}`;
        ctx.fillText(row.c || '—', 610, baseline);
        if (index < rows.length - 1) {
          ctx.strokeStyle = '#edecf2';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(70, rowY + rowHeight);
          ctx.lineTo(830, rowY + rowHeight);
          ctx.stroke();
        }
      });

      ctx.textAlign = 'center';
      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      const cta = ctx.createLinearGradient(450 - contactWidth / 2 - 36, 1030, 450 + contactWidth / 2 + 36, 1082);
      cta.addColorStop(0, pal.light);
      cta.addColorStop(1, pal.dark);
      h.roundedRect(ctx, 450 - contactWidth / 2 - 36, 1030, contactWidth + 72, 52, 26);
      ctx.fillStyle = cta;
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 450, 1064);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = '#9997a2';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1145);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
