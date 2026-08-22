(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['glass-vs'] = {
    key: 'glass-vs',
    file: 'c08-glass-vs.html',
    name: '玻璃对决',
    tagline: '双玻璃面板与通透 VS，现代质感',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '商务合作洽谈';

      const bg = ctx.createLinearGradient(0, 0, 900, 1200);
      bg.addColorStop(0, pal.dark);
      bg.addColorStop(1, pal.deep);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 900, 1200);

      const blobA = ctx.createRadialGradient(180, 300, 0, 180, 300, 380);
      blobA.addColorStop(0, h.hexToRgba(pal.light, 0.4));
      blobA.addColorStop(1, h.hexToRgba(pal.light, 0));
      ctx.fillStyle = blobA;
      ctx.beginPath();
      ctx.arc(180, 300, 380, 0, Math.PI * 2);
      ctx.fill();

      const blobB = ctx.createRadialGradient(740, 950, 0, 740, 950, 400);
      blobB.addColorStop(0, h.hexToRgba(pal.accent, 0.35));
      blobB.addColorStop(1, h.hexToRgba(pal.accent, 0));
      ctx.fillStyle = blobB;
      ctx.beginPath();
      ctx.arc(740, 950, 400, 0, Math.PI * 2);
      ctx.fill();

      ctx.textAlign = 'center';
      const titleSize = h.fitFont(d.title, 700, 32, 800);
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 ${titleSize}px ${SANS}`;
      ctx.fillText(d.title, 450, 92);

      const glassFill = 'rgba(255,255,255,0.2)';
      const glassStroke = 'rgba(255,255,255,0.55)';
      const drawPanel = (panelX, textX, star, name, tag, fee) => {
        h.fillRoundRect(ctx, panelX, 150, 360, 660, 28, glassFill);
        ctx.strokeStyle = glassStroke;
        ctx.lineWidth = 2;
        h.roundedRect(ctx, panelX, 150, 360, 660, 28);
        ctx.stroke();

        ctx.save();
        h.roundedRect(ctx, panelX + 20, 170, 320, 380, 18);
        ctx.clip();
        h.drawPhoto(star, pal, panelX + 20, 170, 320, 380);
        ctx.restore();

        ctx.textAlign = 'left';
        const nameSize = h.fitFont(name, 300, 36, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(name, textX, 612);

        const tagSize = h.fitFont(tag, 280, 18, 500);
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = `500 ${tagSize}px ${SANS}`;
        ctx.fillText(tag, textX, 648);

        const feeSize = h.fitFont(fee, 280, 28, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${feeSize}px ${SANS}`;
        ctx.fillText(fee, textX, 706);
        ctx.textAlign = 'center';
      };

      drawPanel(65, 105, starA, d.nameA, d.tagA, d.feeA);
      drawPanel(475, 515, starB, d.nameB, d.tagB, d.feeB);

      ctx.beginPath();
      ctx.arc(450, 480, 58, 0, Math.PI * 2);
      ctx.fillStyle = glassFill;
      ctx.fill();
      ctx.strokeStyle = glassStroke;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = `800 30px ${SANS}`;
      ctx.fillText('VS', 450, 490);

      const tipSize = h.fitFont(d.tip, 640, 16, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 450, 882);

      const contactSize = h.fitFont(contact, 480, 22, 700);
      ctx.font = `700 ${contactSize}px ${SANS}`;
      const contactWidth = ctx.measureText(contact).width;
      h.fillRoundRect(ctx, 450 - contactWidth / 2 - 40, 920, contactWidth + 80, 54, 27, pal.accent);
      ctx.fillStyle = '#17171f';
      ctx.fillText(contact, 450, 956);

      const footerSize = h.fitFont(d.footer, 600, 15, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 450, 1040);
      ctx.textAlign = 'left';

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.15 });
    }
  };
})();
