(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';
  const SERIF = '"Noto Serif SC", Georgia, serif';

  window.QUOTE_TEMPLATES = window.QUOTE_TEMPLATES || {};
  window.QUOTE_TEMPLATES['menu'] = {
    key: 'menu',
    file: 'q02-menu.html',
    name: '菜单报价',
    tagline: '菜单式排版与椭圆相框，典雅有格调',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const star = { image: d.image, focusX: 50, focusY: d.focusY, zoom: d.zoom };
      const contact = d.contact || '商务合作洽谈';

      ctx.fillStyle = pal.soft;
      ctx.fillRect(0, 0, 900, 1200);
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 1;
      ctx.strokeRect(34, 34, 832, 1132);
      ctx.strokeRect(46, 46, 808, 1108);

      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(170, 92);
      ctx.lineTo(320, 92);
      ctx.moveTo(580, 92);
      ctx.lineTo(730, 92);
      ctx.stroke();

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 560, 34, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${titleSize}px ${SERIF}`;
      ctx.fillText(d.title, 450, 104);
      ctx.fillStyle = '#9997a2';
      ctx.font = `600 12px ${SANS}`;
      ctx.fillText('QUOTATION MENU', 450, 134);

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(450, 310, 125, 155, 0, 0, Math.PI * 2);
      ctx.clip();
      h.drawPhoto(star, pal, 325, 155, 250, 310);
      ctx.restore();
      ctx.beginPath();
      ctx.ellipse(450, 310, 132, 162, 0, 0, Math.PI * 2);
      ctx.strokeStyle = pal.dark;
      ctx.lineWidth = 3;
      ctx.stroke();

      const nameSize = h.fitFont(d.name, 500, 34, 800);
      ctx.fillStyle = pal.ink;
      ctx.font = `800 ${nameSize}px ${SERIF}`;
      ctx.fillText(d.name, 450, 528);
      const tagSize = h.fitFont(d.tag, 400, 17, 500);
      ctx.fillStyle = '#8a8896';
      ctx.font = `500 ${tagSize}px ${SANS}`;
      ctx.fillText(d.tag, 450, 565);

      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(300, 596);
      ctx.lineTo(600, 596);
      ctx.stroke();
      ctx.save();
      ctx.translate(450, 596);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = pal.accent;
      ctx.fillRect(-5, -5, 10, 10);
      ctx.restore();

      d.items.forEach((item, index) => {
        const rowY = 660 + index * 62;
        ctx.textAlign = 'left';
        const itemNameSize = h.fitFont(item.name, 400, 21, 600);
        ctx.fillStyle = '#3f3e49';
        ctx.font = `600 ${itemNameSize}px ${SERIF}`;
        ctx.fillText(item.name, 140, rowY);
        const nameWidth = ctx.measureText(item.name).width;

        const priceSize = h.fitFont(item.price, 220, 24, 800);
        ctx.font = `800 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(item.price).width;
        ctx.strokeStyle = '#d0cdd9';
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.moveTo(156 + nameWidth, rowY - 6);
        ctx.lineTo(734 - priceWidth, rowY - 6);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.accent;
        ctx.fillText(item.price, 760, rowY);
        ctx.textAlign = 'center';
      });

      const validitySize = h.fitFont(d.validity, 460, 16, 600);
      ctx.fillStyle = pal.button;
      ctx.font = `600 ${validitySize}px ${SANS}`;
      ctx.fillText(`· ${d.validity} ·`, 450, 925);

      const tipSize = h.fitFont(d.tip, 640, 15, 400);
      ctx.fillStyle = '#75726a';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 972);

      const contactSize = h.fitFont(contact, 560, 22, 800);
      ctx.fillStyle = pal.button;
      ctx.font = `800 ${contactSize}px ${SANS}`;
      ctx.fillText(contact, 450, 1032);

      const footerSize = h.fitFont(d.footer, 600, 13, 500);
      ctx.fillStyle = '#9997a2';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1094);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#1a1a1a', alpha: 0.07 });
    }
  };
})();
