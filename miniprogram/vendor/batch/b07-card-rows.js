var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['card-rows'] = {
    key: 'card-rows',
    file: 'b07-card-rows.html',
    name: '卡片行组',
    tagline: '圆角卡片行与价签，现代轻快',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 680, 30, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 88);
      ctx.fillStyle = '#9997a2';
      ctx.font = `600 12px ${SANS}`;
      ctx.fillText(`${d.columns[0]} · ${d.columns[1]} · ${d.columns[2]}`, 450, 116);

      const tableTop = 140;
      const tableBottom = 1010;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const cardHeight = Math.max(rowHeight - 10, 34);
      const bodyFont = cardHeight >= 56 ? 20 : cardHeight >= 44 ? 18 : 15;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const cardY = rowY + 5;
        const baseline = cardY + cardHeight / 2 + bodyFont * 0.36;

        h.fillRoundRect(ctx, 70, cardY, 760, cardHeight, 12, '#ffffff');
        ctx.strokeStyle = '#edecf2';
        ctx.lineWidth = 1;
        h.roundedRect(ctx, 70, cardY, 760, cardHeight, 12);
        ctx.stroke();

        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 210, bodyFont, 700);
        ctx.fillStyle = pal.ink;
        ctx.font = `700 ${nameSize}px ${SANS}`;
        ctx.fillText(row.a || '—', 100, baseline);
        const nameWidth = ctx.measureText(row.a || '—').width;

        const workSize = h.fitFont(row.c || '—', 200, bodyFont - 4, 400);
        ctx.fillStyle = '#8a8896';
        ctx.font = `400 ${workSize}px ${SANS}`;
        ctx.fillText(row.c || '—', 116 + nameWidth, baseline);

        const priceSize = h.fitFont(row.b || '—', 120, bodyFont, 700);
        ctx.font = `700 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(row.b || '—').width;
        const chipY = cardY + (cardHeight - 34) / 2;
        h.fillRoundRect(ctx, 778 - priceWidth - 28, chipY, priceWidth + 28, 34, 17, pal.button);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(row.b || '—', 764, chipY + 24);
        ctx.textAlign = 'left';
      });

      ctx.textAlign = 'center';
      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 36, 1050, contactWidth + 72, 52, 26, pal.deep);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 450, 1084);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = '#9997a2';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1140);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
