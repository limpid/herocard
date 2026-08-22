var window = require('../../utils/env.js');
(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['chart-list'] = {
    key: 'chart-list',
    file: 'b05-chart-list.html',
    name: '榜单排行',
    tagline: '序号榜单式排版，杂志气质',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 680, 32, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 92);
      ctx.fillStyle = '#9997a2';
      ctx.font = `600 12px ${SANS}`;
      ctx.fillText('TOP LIST · 报价榜单', 450, 120);

      const tableTop = 170;
      const tableBottom = 1000;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 55 ? 20 : rowHeight >= 42 ? 18 : 16;
      const indexFont = rowHeight >= 55 ? 24 : rowHeight >= 42 ? 20 : 17;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;

        ctx.textAlign = 'left';
        ctx.fillStyle = pal.dark;
        ctx.font = `800 ${indexFont}px ${SANS}`;
        ctx.fillText(String(index + 1).padStart(2, '0'), 80, baseline);

        const nameSize = h.fitFont(row.a || '—', 180, bodyFont, 700);
        ctx.fillStyle = pal.ink;
        ctx.font = `700 ${nameSize}px ${SANS}`;
        ctx.fillText(row.a || '—', 150, baseline);
        const nameWidth = ctx.measureText(row.a || '—').width;

        const workSize = h.fitFont(row.c || '—', 170, bodyFont - 5, 400);
        ctx.fillStyle = '#8a8896';
        ctx.font = `400 ${workSize}px ${SANS}`;
        ctx.fillText(row.c || '—', 166 + nameWidth, baseline);
        const workWidth = ctx.measureText(row.c || '—').width;

        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 170, bodyFont + 4, 800);
        ctx.font = `800 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(row.b || '—').width;
        ctx.fillStyle = pal.accent;
        ctx.fillText(row.b || '—', 560, baseline);

        ctx.strokeStyle = '#d0cdd9';
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.moveTo(182 + nameWidth + workWidth, baseline - 6);
        ctx.lineTo(546 - priceWidth, baseline - 6);
        ctx.stroke();
        ctx.setLineDash([]);

        if (index < rows.length - 1) {
          ctx.strokeStyle = '#d0cdd9';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(80, rowY + rowHeight);
          ctx.lineTo(820, rowY + rowHeight);
          ctx.stroke();
          ctx.setLineDash([]);
        }
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
