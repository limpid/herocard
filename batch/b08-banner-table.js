(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['banner-table'] = {
    key: 'banner-table',
    file: 'b08-banner-table.html',
    name: '撞色横幅',
    tagline: '撞色色块，视觉冲击强烈',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = pal.deep;
      ctx.fillRect(0, 0, 900, 1200);

      h.fillRoundRect(ctx, 50, 50, 800, 140, 18, pal.accent);
      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 680, 36, 800);
      ctx.fillStyle = '#17171f';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 112);
      ctx.fillStyle = 'rgba(23,23,31,0.6)';
      ctx.font = `600 13px ${SANS}`;
      ctx.fillText('BATCH QUOTATION · 批量报价', 450, 146);

      ctx.fillStyle = '#ffffff';
      ctx.font = `700 17px ${SANS}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[0], 90, 242);
      ctx.textAlign = 'right';
      ctx.fillText(d.columns[1], 530, 242);
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[2], 600, 242);

      ctx.strokeStyle = pal.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(70, 260);
      ctx.lineTo(830, 260);
      ctx.stroke();

      const tableTop = 270;
      const tableBottom = 980;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 52 ? 20 : rowHeight >= 42 ? 18 : 16;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;
        if (index % 2 === 1) {
          ctx.fillStyle = 'rgba(255,255,255,0.05)';
          ctx.fillRect(64, rowY, 772, rowHeight);
        }
        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 260, bodyFont, 700);
        ctx.fillStyle = '#ffffff';
        ctx.font = `700 ${nameSize}px ${SANS}`;
        ctx.fillText(row.a || '—', 90, baseline);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 180, bodyFont + 3, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(row.b || '—', 530, baseline);
        ctx.textAlign = 'left';
        const workSize = h.fitFont(row.c || '—', 240, bodyFont - 4, 400);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `400 ${workSize}px ${SANS}`;
        ctx.fillText(row.c || '—', 600, baseline);
        if (index < rows.length - 1) {
          ctx.strokeStyle = 'rgba(255,255,255,0.08)';
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
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 36, 1030, contactWidth + 72, 52, 26, pal.accent);
      ctx.fillStyle = '#17171f';
      ctx.fillText(contact, 450, 1064);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1140);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.12 });
    }
  };
})();
