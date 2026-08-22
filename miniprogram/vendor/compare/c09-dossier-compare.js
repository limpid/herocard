(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';

  window.COMPARE_TEMPLATES = window.COMPARE_TEMPLATES || {};
  window.COMPARE_TEMPLATES['dossier-compare'] = {
    key: 'dossier-compare',
    file: 'c09-dossier-compare.html',
    name: '档案对比',
    tagline: '双档案卡与条形码，冷静专业',
    render(ctx, d, h) {
      const pal = window.CARD_PALETTES[d.themeKey];
      const starA = { image: d.imageA, focusX: 50, focusY: d.focusYA, zoom: d.zoomA };
      const starB = { image: d.imageB, focusX: 50, focusY: d.focusYB, zoom: d.zoomB };
      const contact = d.contact || '洽谈代言合作';

      ctx.fillStyle = pal.deep;
      ctx.fillRect(0, 0, 900, 1200);

      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 90; x < 900; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 60);
        ctx.lineTo(x, 1140);
        ctx.stroke();
      }
      for (let y = 90; y < 1200; y += 90) {
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(850, y);
        ctx.stroke();
      }

      ctx.fillStyle = pal.glow;
      ctx.font = `700 20px ${SANS}`;
      ctx.fillText('DOSSIER · 人选对比', 60, 84);
      ctx.textAlign = 'right';
      ctx.fillStyle = pal.accent;
      ctx.fillText('VS FILE', 840, 84);
      ctx.textAlign = 'left';

      const drawCard = (cardX, star, name, tag, fee, label) => {
        h.fillRoundRect(ctx, cardX, 150, 360, 660, 14, 'rgba(255,255,255,0.06)');
        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 1;
        h.roundedRect(ctx, cardX, 150, 360, 660, 14);
        ctx.stroke();

        ctx.save();
        h.roundedRect(ctx, cardX, 150, 360, 310, 14);
        ctx.clip();
        h.drawPhoto(star, pal, cardX, 150, 360, 310);
        ctx.restore();

        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 3;
        const x1 = cardX - 10;
        const x2 = cardX + 370;
        [[x1, 140, 1, 1], [x2, 140, -1, 1], [x1, 820, 1, -1], [x2, 820, -1, -1]].forEach(([bx, by, sx, sy]) => {
          ctx.beginPath();
          ctx.moveTo(bx + sx * 30, by);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx, by + sy * 30);
          ctx.stroke();
        });

        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = `600 14px ${SANS}`;
        ctx.fillText(label, cardX + 30, 515);
        const nameSize = h.fitFont(name, 300, 30, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(name, cardX + 30, 551);

        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = `600 14px ${SANS}`;
        ctx.fillText('出场费 FEE', cardX + 30, 602);
        const feeSize = h.fitFont(fee, 300, 28, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${feeSize}px ${SANS}`;
        ctx.fillText(fee, cardX + 30, 638);

        const tagSize = h.fitFont(tag, 300, 16, 500);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `500 ${tagSize}px ${SANS}`;
        ctx.fillText(tag, cardX + 30, 688);
      };

      drawCard(60, starA, d.nameA, d.tagA, d.feeA, '人选 A · CANDIDATE');
      drawCard(480, starB, d.nameB, d.tagB, d.feeB, '人选 B · CANDIDATE');

      ctx.beginPath();
      ctx.arc(450, 430, 30, 0, Math.PI * 2);
      ctx.fillStyle = pal.accent;
      ctx.fill();
      ctx.fillStyle = '#17171f';
      ctx.font = `800 18px ${SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText('OR', 450, 437);
      ctx.textAlign = 'left';

      const tipSize = h.fitFont(d.tip, 700, 15, 400);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `400 ${tipSize}px ${SANS}`;
      ctx.fillText(d.tip, 60, 846);

      const seed = Array.from(`${d.nameA}${d.nameB}`).reduce((sum, ch) => sum + ch.codePointAt(0), 3);
      let barX = 60;
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      for (let i = 0; i < 46; i += 1) {
        const barWidth = (i * 7 + seed) % 3 + 1;
        if (i % 2 === 0) ctx.fillRect(barX, 880, barWidth, 52);
        barX += barWidth + 2;
      }

      const contactSize = h.fitFont(contact, 620, 22, 700);
      ctx.fillStyle = pal.accent;
      ctx.font = `700 ${contactSize}px ${SANS}`;
      ctx.fillText(contact, 60, 990);

      const footerSize = h.fitFont(d.footer, 600, 15, 500);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `500 ${footerSize}px ${SANS}`;
      ctx.fillText(d.footer, 60, 1040);

      h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.09 });
    }
  };
})();
