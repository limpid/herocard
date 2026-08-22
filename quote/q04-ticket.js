(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['ticket'] = {
    key: 'ticket',
    file: 'q04-ticket.html',
    name: '票据报价',
    tagline: '票据打孔与条形码，形式感十足',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.save();
      ctx.shadowColor = 'rgba(48, 45, 90, 0.18)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 12;
      h.fillRoundRect(ctx, 65, 75, 770, 1050, 24, '#ffffff');
      ctx.restore();

      ctx.textAlign = 'left';
      const titleSize = h.fitFont(d.title, 480, 26, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 110, 150);
      const serial = Array.from(d.name).reduce((sum, ch) => sum + ch.codePointAt(0), 11) % 9000 + 1000;
      ctx.fillStyle = '#9997a2';
      ctx.font = `600 13px ${SANS}`;
      ctx.fillText(`QUOTATION · NO. QS-${serial}`, 110, 180);

      ctx.save();
      ctx.beginPath();
      ctx.arc(715, 165, 72, 0, Math.PI * 2);
      ctx.clip();
      h.drawPhoto(star, pal, 643, 93, 144, 144);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(715, 165, 79, 0, Math.PI * 2);
      ctx.strokeStyle = pal.dark;
      ctx.lineWidth = 3;
      ctx.stroke();

      const nameSize = h.fitFont(d.name, 440, 32, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${nameSize}px ${SANS}`;
      ctx.fillText(d.name, 110, 272);
      const tagSize = h.fitFont(d.tag, 400, 16, 500);
      ctx.fillStyle = '#8a8896';
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 112, 305);

      d.items.forEach((item, index) => {
        const rowY = 368 + index * 58;
        ctx.textAlign = 'left';
        const itemNameSize = h.fitFont(item.name, 420, 21, 600);
        ctx.fillStyle = '#3f3e49';
        ctx.font = `600 ${itemNameSize}px ${SANS}`;
        ctx.fillText(item.name, 110, rowY);
        ctx.textAlign = 'right';
        const priceSize = h.fitFont(item.price, 220, 24, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(item.price, 790, rowY);
        if (index < 3) {
          ctx.strokeStyle = '#e8e6ee';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(110, rowY + 24);
          ctx.lineTo(790, rowY + 24);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.textAlign = 'left';
      });

      ctx.strokeStyle = '#d0cdd9';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      h.roundedRect(ctx, 110, 592, 680, 70, 10);
      ctx.stroke();
      ctx.setLineDash([]);
      const tipSize = h.fitFont(d.tip, 640, 15, 400);
      ctx.fillStyle = '#6f6d7a';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText(d.tip, 450, 634);

      ctx.textAlign = 'left';
      const validitySize = h.fitFont(d.validity, 480, 18, 700);
      ctx.fillStyle = pal.button;
      ctx.font = `700 ${validitySize}px ${SANS}`;
      ctx.fillText(d.validity, 110, 716);

      ctx.strokeStyle = '#d0cdd9';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(85, 760);
      ctx.lineTo(815, 760);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = pal.soft;
      ctx.beginPath();
      ctx.arc(65, 760, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(835, 760, 20, 0, Math.PI * 2);
      ctx.fill();

      const contactSize = h.fitFont(contact, 560, 24, 800);
      ctx.fillStyle = pal.button;
      ctx.font = `800 ${contactSize}px ${SANS}`;
      ctx.fillText(contact, 110, 856);

      const footerSize = h.fitFont(d.footer, 520, 15, 500);
      ctx.fillStyle = '#8a8896';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 110, 900);

      const seed = Array.from(d.name).reduce((sum, ch) => sum + ch.codePointAt(0), 3);
      let barX = 490;
      ctx.fillStyle = 'rgba(60,60,70,0.75)';
      for (let i = 0; i < 42; i += 1) {
        const barWidth = (i * 7 + seed) % 3 + 1;
        if (i % 2 === 0) ctx.fillRect(barX, 960, barWidth, 60);
        barX += barWidth + 2;
      }
      ctx.fillStyle = '#9997a2';
      ctx.font = `600 11px ${SANS}`;
      ctx.fillText('STAR AGENCY · QUOTATION', 490, 1046);

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
