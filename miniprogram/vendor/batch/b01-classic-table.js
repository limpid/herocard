(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.BATCH_TEMPLATES = window.BATCH_TEMPLATES || {};
  window.BATCH_TEMPLATES['classic-table'] = {
    key: 'classic-table',
    file: 'b01-classic-table.html',
    name: '经典蓝表',
    tagline: '色带表头与斑马纹行，干净利落',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const contact = d.contact || '商务合作请联系';
      const visible = d.rows.filter((row) => row.a || row.b || row.c);
      const rows = visible.length ? visible : [{ a: '—', b: '—', c: '—' }];

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);

      h.fillRoundRect(ctx, 60, 60, 780, 150, 20, pal.deep);
      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 640, 36, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 122);
      ctx.fillStyle = pal.glow;
      ctx.font = `600 13px ${SANS}`;
      ctx.fillText('STAR PRICE LIST · 批量报价', 450, 154);

      ctx.save();
      ctx.shadowColor = 'rgba(48, 45, 90, 0.14)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 10;
      h.fillRoundRect(ctx, 60, 244, 780, 756, 20, '#ffffff');
      ctx.restore();

      ctx.save();
      h.roundedRect(ctx, 60, 244, 780, 756, 20);
      ctx.clip();

      ctx.fillStyle = pal.dark;
      ctx.fillRect(60, 244, 780, 56);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 17px ${SANS}`;
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[0], 100, 280);
      ctx.textAlign = 'right';
      ctx.fillText(d.columns[1], 520, 280);
      ctx.textAlign = 'left';
      ctx.fillText(d.columns[2], 580, 280);

      const tableTop = 300;
      const tableBottom = 1000;
      const rowHeight = (tableBottom - tableTop) / rows.length;
      const bodyFont = rowHeight >= 52 ? 20 : rowHeight >= 42 ? 18 : 16;

      rows.forEach((row, index) => {
        const rowY = tableTop + index * rowHeight;
        const baseline = rowY + rowHeight / 2 + bodyFont * 0.36;
        if (index % 2 === 1) {
          ctx.fillStyle = pal.soft;
          ctx.fillRect(62, rowY, 776, rowHeight);
        }
        ctx.textAlign = 'left';
        const nameSize = h.fitFont(row.a || '—', 260, bodyFont, 700);
        ctx.fillStyle = pal.ink;
        ctx.font = `700 ${nameSize}px ${SANS}`;
        ctx.fillText(row.a || '—', 100, baseline);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(row.b || '—', 170, bodyFont + 2, 800);
        ctx.fillStyle = pal.button;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(row.b || '—', 520, baseline);
        ctx.textAlign = 'left';
        const workSize = h.fitFont(row.c || '—', 250, bodyFont - 3, 400);
        ctx.fillStyle = '#6f6d7a';
        ctx.font = `400 ${workSize}px ${SANS}`;
        ctx.fillText(row.c || '—', 580, baseline);
        if (index < rows.length - 1) {
          ctx.strokeStyle = '#edecf2';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(80, rowY + rowHeight);
          ctx.lineTo(820, rowY + rowHeight);
          ctx.stroke();
        }
      });
      ctx.restore();

      ctx.textAlign = 'center';
      const contactSize = h.fitFont(contact, 480, 20, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 36, 1052, contactWidth + 72, 52, 26, pal.button);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 450, 1086);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = '#9997a2';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1140);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
