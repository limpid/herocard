(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['clash'] = {
    key: 'clash',
    file: 'c05-clash.html',
    name: '撞色渐变',
    tagline: '左右撞色渐变与悬浮白卡，明快抢眼',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '洽谈代言合作';

      const left = ctx.createLinearGradient(0, 0, 450, 1200);
      left.addColorStop(0, pal.light);
      left.addColorStop(1, pal.dark);
      ctx.fillStyle = left;
      ctx.fillRect(0, 0, 450, 1200);

      const right = ctx.createLinearGradient(450, 0, 900, 1200);
      right.addColorStop(0, pal.dark);
      right.addColorStop(1, pal.light);
      ctx.fillStyle = right;
      ctx.fillRect(450, 0, 450, 1200);

      const titleSize = h.fitFont(d.title, 600, 26, 800);
      ctx.font = `800 ${titleSize}px ${SANS}`;
      const titleWidth = ctx.measureText(d.title).width;
      h.fillRoundRect(ctx, 450 - titleWidth / 2 - 32, 56, titleWidth + 64, 56, 28, pal.deep);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(d.title, 450, 94);

      const drawSide = (cardX, center, star, name, tag, fee) => {
        ctx.save();
        ctx.shadowColor = 'rgba(30, 28, 60, 0.3)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 14;
        h.fillRoundRect(ctx, cardX, 180, 350, 470, 24, '#ffffff');
        ctx.restore();

        ctx.save();
        h.roundedRect(ctx, cardX + 20, 200, 310, 430, 14);
        ctx.clip();
        h.drawPhoto(star, pal, cardX + 20, 200, 310, 430);
        ctx.restore();

        const nameSize = h.fitFont(name, 310, 38, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(name, center, 730);

        const tagSize = h.fitFont(tag, 280, 18, 500);
        ctx.fillStyle = 'rgba(255,255,255,0.78)';
        ctx.font = `500 ${tagSize}px ${SANS}`;
        ctx.fillText(tag, center, 766);

        const feeSize = h.fitFont(fee, 280, 26, 800);
        ctx.font = `800 ${feeSize}px ${SANS}`;
        const feeWidth = ctx.measureText(fee).width;
        h.fillRoundRect(ctx, center - feeWidth / 2 - 24, 794, feeWidth + 48, 50, 25, pal.accent);
        ctx.fillStyle = '#1c1c28';
        ctx.fillText(fee, center, 828);
      };

      drawSide(55, 230, starA, d.nameA, d.tagA, d.feeA);
      drawSide(495, 670, starB, d.nameB, d.tagB, d.feeB);

      ctx.beginPath();
      ctx.arc(450, 415, 60, 0, Math.PI * 2);
      ctx.fillStyle = pal.accent;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.fillStyle = '#1c1c28';
      ctx.font = `800 30px ${SANS}`;
      ctx.fillText('VS', 450, 426);

      const tipSize = h.fitFont(d.tip, 640, 16, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 916);

      const contactSize = h.fitFont(contact, 480, 22, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 40, 952, contactWidth + 80, 54, 27, '#ffffff');
      ctx.fillStyle = pal.ink;
      ctx.fillText(contact, 450, 988);

      const footerSize = h.fitFont(d.footer, 600, 15, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1058);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.12 });
    }
  };
})();
