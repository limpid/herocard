(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['ranking'] = {
    key: 'ranking',
    file: 'c03-ranking.html',
    name: '榜单对决',
    tagline: '白卡并列与醒目报价条，一目了然',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 2;
      h.roundedRect(ctx, 30, 30, 840, 1140, 10);
      ctx.stroke();

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 700, 32, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 104);

      const drawSide = (cardX, center, star, name, tag, fee) => {
        ctx.save();
        ctx.shadowColor = 'rgba(48, 45, 90, 0.16)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 10;
        h.fillRoundRect(ctx, cardX, 160, 370, 700, 20, '#ffffff');
        ctx.restore();

        ctx.save();
        h.roundedRect(ctx, cardX + 35, 195, 300, 340, 16);
        ctx.clip();
        h.drawPhoto(star, pal, cardX + 35, 195, 300, 340);
        ctx.restore();

        const nameSize = h.fitFont(name, 320, 36, 800);
        ctx.fillStyle = pal.ink;
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(name, center, 606);

        const tagSize = h.fitFont(tag, 300, 18, 500);
        ctx.fillStyle = '#8a8896';
        ctx.font = `500 ${tagSize}px ${SANS}`;
        ctx.fillText(tag, center, 642);

        h.fillRoundRect(ctx, cardX + 30, 676, 310, 64, 12, pal.button);
        const feeSize = h.fitFont(fee, 270, 26, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${feeSize}px ${SANS}`;
        ctx.fillText(fee, center, 718);
      };

      drawSide(70, 255, starA, d.nameA, d.tagA, d.feeA);
      drawSide(460, 645, starB, d.nameB, d.tagB, d.feeB);

      ctx.beginPath();
      ctx.arc(450, 510, 54, 0, Math.PI * 2);
      ctx.fillStyle = pal.accent;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.fillStyle = '#1c1c28';
      ctx.font = `800 28px ${SANS}`;
      ctx.fillText('VS', 450, 520);

      const tipSize = h.fitFont(d.tip, 640, 17, 400);
      ctx.fillStyle = '#8a8896';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 916);

      const contactSize = h.fitFont(contact, 480, 22, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 40, 952, contactWidth + 80, 54, 27, pal.deep);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(contact, 450, 988);

      const footerSize = h.fitFont(d.footer, 600, 15, 500);
      ctx.fillStyle = '#9997a2';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1064);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
    }
  };
})();
