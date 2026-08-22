(function () {
  'use strict';

  const SANS = '"Noto Sans SC", sans-serif';
  const SERIF = '"Noto Serif SC", Georgia, serif';

  const PALETTES = {
    lavender: { light: '#a8a9ef', dark: '#7f82dc', glow: '#c9caff', accent: '#e59945', ink: '#24242a', deep: '#35326a', soft: '#f3f2fb', paper: '#fffdf6', line: '#f1d59e', button: '#536de5' },
    peach: { light: '#efb49d', dark: '#de856f', glow: '#ffd8c8', accent: '#db673a', ink: '#2b2422', deep: '#6b3527', soft: '#fdf3ee', paper: '#fffaf6', line: '#f0c0a9', button: '#d6654b' },
    mint: { light: '#a7d8c9', dark: '#69aa9b', glow: '#d4f2e9', accent: '#d8843e', ink: '#1f2b28', deep: '#1f4a42', soft: '#eef8f4', paper: '#fbfffc', line: '#c5dfb9', button: '#378b7d' },
    midnight: { light: '#96acd0', dark: '#324b78', glow: '#b9c9e2', accent: '#efb164', ink: '#172235', deep: '#141d33', soft: '#eef1f7', paper: '#f7f8fb', line: '#d6c9a8', button: '#2d5b9e' }
  };

  let activeCtx = null;
  let bioOverflow = false;

  function setDrawingContext(context) {
    activeCtx = context;
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function fillRoundRect(context, x, y, width, height, radius, fill) {
    roundedRect(context, x, y, width, height, radius);
    context.fillStyle = fill;
    context.fill();
  }

  function fitFont(text, maxWidth, startSize, weight = 700) {
    let size = startSize;
    while (size > 18) {
      activeCtx.font = `${weight} ${size}px ${SANS}`;
      if (activeCtx.measureText(text).width <= maxWidth) break;
      size -= 1;
    }
    return size;
  }

  function wrapText(text, maxWidth, maxLines) {
    const paragraphs = String(text || '').replace(/\r\n?/g, '\n').split('\n');
    const wrappedLines = [];

    paragraphs.forEach((paragraph) => {
      if (!paragraph) {
        wrappedLines.push('');
        return;
      }

      let current = '';
      Array.from(paragraph).forEach((char) => {
        const test = current + char;
        if (current && activeCtx.measureText(test).width > maxWidth) {
          wrappedLines.push(current);
          current = char;
        } else {
          current = test;
        }
      });
      if (current) wrappedLines.push(current);
    });

    const truncated = wrappedLines.length > maxLines;
    const lines = wrappedLines.slice(0, maxLines);
    if (truncated && lines.length) {
      let last = lines[lines.length - 1];
      while (activeCtx.measureText(`${last}…`).width > maxWidth && last.length) last = last.slice(0, -1);
      lines[lines.length - 1] = `${last}…`;
    }
    return { lines, truncated };
  }

  function drawCoverImage(image, x, y, width, height, focusX, focusY, zoomPercent) {
    const coverScale = Math.max(width / image.width, height / image.height);
    const zoom = zoomPercent / 100;
    const drawWidth = image.width * coverScale * zoom;
    const drawHeight = image.height * coverScale * zoom;
    const drawX = x + (width - drawWidth) * (focusX / 100);
    const drawY = y + (height - drawHeight) * (focusY / 100);

    if (zoom < 1) {
      const backdropScale = coverScale * 1.1;
      const backdropWidth = image.width * backdropScale;
      const backdropHeight = image.height * backdropScale;
      activeCtx.save();
      activeCtx.filter = 'blur(20px)';
      activeCtx.globalAlpha = 0.72;
      activeCtx.drawImage(image, x + (width - backdropWidth) / 2, y + (height - backdropHeight) / 2, backdropWidth, backdropHeight);
      activeCtx.restore();
    }

    activeCtx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }

  function drawSilhouette(x, y, width, height, pal) {
    const context = activeCtx;
    const previousAlign = context.textAlign;
    const gradient = context.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, pal.soft);
    gradient.addColorStop(1, pal.glow);
    context.fillStyle = gradient;
    context.fillRect(x, y, width, height);

    const radius = Math.min(width, height) * 0.17;
    context.save();
    context.globalAlpha = 0.75;
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(x + width / 2, y + height * 0.38, radius, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.ellipse(x + width / 2, y + height * 0.92, width * 0.31, height * 0.36, 0, Math.PI, Math.PI * 2);
    context.fill();
    context.restore();

    context.fillStyle = '#77758a';
    context.textAlign = 'center';
    context.font = `500 22px ${SANS}`;
    context.fillText('上传人物照片', x + width / 2, y + height * 0.67);
    context.textAlign = previousAlign;
  }

  function drawPhoto(data, pal, x, y, width, height) {
    if (data.image) {
      drawCoverImage(data.image, x, y, width, height, data.focusX, data.focusY, data.zoom);
    } else {
      drawSilhouette(x, y, width, height, pal);
    }
  }

  function hexToRgba(hex, alpha) {
    const value = hex.replace('#', '');
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function drawWatermark(text, options = {}) {
    const value = String(text || '').trim();
    if (!value) return;

    const context = activeCtx;
    const fontSize = options.size || 44;
    context.save();
    context.fillStyle = options.color || '#3c3c46';
    context.globalAlpha = options.alpha == null ? 0.1 : options.alpha;
    context.font = `700 ${fontSize}px ${SANS}`;
    const textWidth = context.measureText(value).width;
    const stepX = textWidth + fontSize * 2.6;
    const stepY = fontSize * 3.2;
    context.translate(450, 600);
    context.rotate(-Math.PI / 6);
    const cols = Math.ceil(820 / stepX);
    const rows = Math.ceil(820 / stepY);
    for (let row = -rows; row <= rows; row += 1) {
      for (let col = -cols; col <= cols; col += 1) {
        context.fillText(value, col * stepX, row * stepY);
      }
    }
    context.restore();
  }

  const helpers = {
    roundedRect,
    fillRoundRect,
    fitFont,
    wrapText,
    drawPhoto,
    setDrawingContext,
    hexToRgba,
    drawWatermark,
    reportBioOverflow(value) {
      bioOverflow = Boolean(value);
    },
    consumeBioOverflow() {
      const value = bioOverflow;
      bioOverflow = false;
      return value;
    }
  };

  const CARD_TEMPLATES = {
    classic: {
      key: 'classic',
      file: 't01-classic.html',
      name: '经典图文',
      tagline: '照片与资料分区呈现，信息完整均衡',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 900, 1200);

        ctx.save();
        ctx.shadowColor = 'rgba(48, 48, 90, 0.15)';
        ctx.shadowBlur = 28;
        ctx.shadowOffsetY = 12;
        h.roundedRect(ctx, 55, 35, 790, 1130, 48);
        const panel = ctx.createLinearGradient(55, 35, 845, 1165);
        panel.addColorStop(0, pal.light);
        panel.addColorStop(1, pal.dark);
        ctx.fillStyle = panel;
        ctx.fill();
        ctx.restore();

        ctx.save();
        h.roundedRect(ctx, 85, 70, 730, 500, 14);
        ctx.clip();
        h.drawPhoto(d, pal, 85, 70, 730, 405);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(85, 475, 730, 95);
        ctx.restore();

        const nameSize = h.fitFont(d.name, 205, 31, 800);
        ctx.fillStyle = pal.ink;
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(d.name, 110, 532);
        const nameWidth = ctx.measureText(d.name).width;

        ctx.fillStyle = '#9a98a2';
        ctx.font = `500 26px ${SANS}`;
        ctx.fillText('/', 126 + nameWidth, 532);

        const roleX = 158 + nameWidth;
        const roleMax = Math.max(110, 790 - roleX);
        const roleSize = h.fitFont(d.role, roleMax, 25, 500);
        ctx.fillStyle = '#3c3b43';
        ctx.font = `500 ${roleSize}px ${SANS}`;
        ctx.fillText(d.role, roleX, 532);

        const priceSize = h.fitFont(d.price, 680, 24, 700);
        ctx.font = `700 ${priceSize}px ${SANS}`;
        ctx.fillStyle = pal.accent;
        ctx.textAlign = 'right';
        ctx.fillText(d.price, 790, 559);
        ctx.textAlign = 'left';

        h.fillRoundRect(ctx, 85, 590, 730, 64, 8, pal.paper);
        ctx.strokeStyle = pal.line;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        h.roundedRect(ctx, 85, 590, 730, 64, 8);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = pal.accent;
        ctx.textAlign = 'center';
        const tipSize = h.fitFont(d.tip, 670, 22, 600);
        ctx.font = `600 ${tipSize}px ${SANS}`;
        ctx.fillText(d.tip, 450, 631);
        ctx.textAlign = 'left';

        h.fillRoundRect(ctx, 85, 678, 730, 300, 12, '#ffffff');
        ctx.fillStyle = pal.ink;
        ctx.font = `400 23px ${SANS}`;
        const bio = h.wrapText(d.bio, 670, 8);
        bio.lines.forEach((line, index) => ctx.fillText(line, 115, 727 + index * 32));
        h.reportBioOverflow(bio.truncated);

        ctx.font = `700 19px ${SANS}`;
        ctx.fillStyle = pal.accent;
        ctx.textAlign = 'right';
        ctx.fillText('MORE +', 782, 950);
        ctx.textAlign = 'left';

        h.fillRoundRect(ctx, 85, 1002, 730, 130, 20, pal.paper);
        ctx.strokeStyle = pal.line;
        ctx.lineWidth = 2;
        h.roundedRect(ctx, 85, 1002, 730, 130, 20);
        ctx.stroke();
        ctx.fillStyle = '#4c4a50';
        ctx.textAlign = 'center';
        const footerSize = h.fitFont(d.footer, 670, 19, 500);
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.fillText(d.footer, 450, 1030);
        if (d.contact) {
          const contactSize = h.fitFont(d.contact, 650, 19, 700);
          ctx.font = `700 ${contactSize}px ${SANS}`;
          ctx.fillStyle = pal.button;
          ctx.fillText(d.contact, 450, 1058);
        }

        h.fillRoundRect(ctx, 120, 1070, 660, 46, 13, pal.button);
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 20px ${SANS}`;
        ctx.fillText(d.contact ? '商务合作洽谈' : '查看完整人物资料', 450, 1101);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
      }
    },

    magazine: {
      key: 'magazine',
      file: 't02-magazine.html',
      name: '杂志封面',
      tagline: '满版照片配超大标题，视觉冲击力最强',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        h.drawPhoto(d, pal, 0, 0, 900, 1200);

        const shade = ctx.createLinearGradient(0, 480, 0, 1200);
        shade.addColorStop(0, h.hexToRgba(pal.deep, 0));
        shade.addColorStop(0.5, h.hexToRgba(pal.deep, 0.5));
        shade.addColorStop(1, h.hexToRgba(pal.deep, 0.9));
        ctx.fillStyle = shade;
        ctx.fillRect(0, 480, 900, 720);

        ctx.fillStyle = h.hexToRgba(pal.deep, 0.62);
        ctx.fillRect(0, 0, 900, 74);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 24px ${SANS}`;
        ctx.fillText('PORTRAIT · 人物志', 48, 48);
        ctx.textAlign = 'right';
        ctx.font = `500 17px ${SANS}`;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText(d.footer, 852, 46);
        ctx.textAlign = 'left';

        const priceSize = h.fitFont(d.price, 300, 21, 700);
        ctx.font = `700 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(d.price).width;
        const pillWidth = priceWidth + 40;
        const pillX = 840 - pillWidth;
        h.fillRoundRect(ctx, pillX, 100, pillWidth, 46, 23, 'rgba(255,255,255,0.94)');
        ctx.textAlign = 'center';
        ctx.fillStyle = pal.ink;
        ctx.fillText(d.price, pillX + pillWidth / 2, 131);
        ctx.textAlign = 'left';

        const roleSize = h.fitFont(d.role, 500, 26, 700);
        ctx.font = `700 ${roleSize}px ${SANS}`;
        ctx.fillStyle = pal.glow;
        ctx.fillText(d.role, 60, 872);

        const nameSize = h.fitFont(d.name, 780, 88, 800);
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(d.name, 56, 968);

        ctx.font = `400 24px ${SANS}`;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        const bio = h.wrapText(d.bio, 770, 2);
        bio.lines.forEach((line, index) => ctx.fillText(line, 60, 1022 + index * 37));
        h.reportBioOverflow(bio.truncated);

        if (d.contact) {
          const contactSize = h.fitFont(d.contact, 500, 22, 700);
          ctx.font = `700 ${contactSize}px ${SANS}`;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(d.contact, 60, 1090);
        }

        const tipSize = h.fitFont(d.tip, 500, 18, 400);
        ctx.font = `400 ${tipSize}px ${SANS}`;
        ctx.fillStyle = 'rgba(255,255,255,0.62)';
        ctx.fillText(d.tip, 60, 1132);
        ctx.textAlign = 'right';
        ctx.font = `700 20px ${SANS}`;
        ctx.fillStyle = pal.glow;
        ctx.fillText('MORE +', 840, 1132);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.13 });
      }
    },

    minimal: {
      key: 'minimal',
      file: 't03-minimal.html',
      name: '极简留白',
      tagline: '大图居中与大量留白，突出人物气质',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        const contact = d.contact || '商务合作洽谈';
        ctx.fillStyle = pal.soft;
        ctx.fillRect(0, 0, 900, 1200);
        ctx.strokeStyle = pal.glow;
        ctx.lineWidth = 2;
        h.roundedRect(ctx, 30, 30, 840, 1140, 10);
        ctx.stroke();

        ctx.save();
        h.roundedRect(ctx, 140, 60, 620, 590, 28);
        ctx.clip();
        h.drawPhoto(d, pal, 140, 60, 620, 590);
        ctx.restore();

        ctx.textAlign = 'center';
        const nameSize = h.fitFont(d.name, 700, 56, 800);
        ctx.fillStyle = pal.ink;
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(d.name, 450, 730);
        const roleSize = h.fitFont(d.role, 560, 20, 500);
        ctx.fillStyle = '#8a8896';
        ctx.font = `500 ${roleSize}px ${SANS}`;
        ctx.fillText(d.role, 450, 772);

        ctx.fillStyle = pal.accent;
        ctx.fillRect(425, 806, 50, 4);

        const priceSize = h.fitFont(d.price, 640, 26, 700);
        ctx.font = `700 ${priceSize}px ${SANS}`;
        ctx.fillText(d.price, 450, 856);

        ctx.fillStyle = '#55535f';
        ctx.font = `400 23px ${SANS}`;
        const bio = h.wrapText(d.bio, 620, 3);
        bio.lines.forEach((line, index) => ctx.fillText(line, 450, 913 + index * 36));
        h.reportBioOverflow(bio.truncated);

        const contactSize = h.fitFont(contact, 520, 24, 700);
        ctx.font = `700 ${contactSize}px ${SANS}`;
        const contactWidth = ctx.measureText(contact).width;
        h.roundedRect(ctx, 450 - contactWidth / 2 - 30, 1032, contactWidth + 60, 54, 27);
        ctx.strokeStyle = pal.button;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = pal.button;
        ctx.fillText(contact, 450, 1068);

        const tipSize = h.fitFont(d.tip, 620, 17, 400);
        ctx.fillStyle = '#9997a2';
        ctx.font = `400 ${tipSize}px ${SANS}`;
        ctx.fillText(d.tip, 450, 1112);
        const footerSize = h.fitFont(d.footer, 620, 15, 500);
        ctx.fillStyle = '#bab8c4';
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.fillText(d.footer, 450, 1146);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
      }
    },

    poster: {
      key: 'poster',
      file: 't04-poster.html',
      name: '大字海报',
      tagline: '深色底与超大字号，一眼记住名字',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        ctx.fillStyle = pal.deep;
        ctx.fillRect(0, 0, 900, 1200);

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 900, 616);
        ctx.clip();
        h.drawPhoto(d, pal, 0, 0, 900, 616);
        ctx.restore();
        ctx.fillStyle = pal.accent;
        ctx.fillRect(0, 616, 900, 12);

        const roleSize = h.fitFont(d.role, 300, 22, 700);
        ctx.font = `700 ${roleSize}px ${SANS}`;
        const roleWidth = ctx.measureText(d.role).width;
        h.fillRoundRect(ctx, 60, 668, roleWidth + 44, 46, 23, 'rgba(255,255,255,0.14)');
        ctx.fillStyle = pal.glow;
        ctx.fillText(d.role, 82, 700);

        const priceSize = h.fitFont(d.price, 360, 34, 800);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(d.price, 840, 702);
        ctx.textAlign = 'left';

        const nameSize = h.fitFont(d.name, 780, 96, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(d.name, 56, 836);

        ctx.font = `400 25px ${SANS}`;
        ctx.fillStyle = 'rgba(255,255,255,0.78)';
        const bio = h.wrapText(d.bio, 780, 3);
        bio.lines.forEach((line, index) => ctx.fillText(line, 60, 906 + index * 38));
        h.reportBioOverflow(bio.truncated);

        if (d.contact) {
          const contactSize = h.fitFont(d.contact, 700, 26, 800);
          ctx.font = `800 ${contactSize}px ${SANS}`;
          ctx.fillStyle = pal.accent;
          ctx.textAlign = 'center';
          ctx.fillText(d.contact, 450, 1022);
          ctx.textAlign = 'left';
        }

        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, 1052);
        ctx.lineTo(840, 1052);
        ctx.stroke();
        const footerSize = h.fitFont(d.footer, 380, 20, 500);
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.fillText(d.footer, 60, 1094);
        const tipSize = h.fitFont(d.tip, 360, 20, 500);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.glow;
        ctx.font = `500 ${tipSize}px ${SANS}`;
        ctx.fillText(d.tip, 840, 1094);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.11 });
      }
    },

    cinema: {
      key: 'cinema',
      file: 't05-cinema.html',
      name: '电影片头',
      tagline: '满幅银幕形象与醒目合作入口',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        const contact = d.contact || '商务合作洽谈';
        ctx.fillStyle = pal.deep;
        ctx.fillRect(0, 0, 900, 1200);

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 900, 660);
        ctx.clip();
        h.drawPhoto(d, pal, 0, 0, 900, 660);
        ctx.restore();
        const fade = ctx.createLinearGradient(0, 460, 0, 660);
        fade.addColorStop(0, h.hexToRgba(pal.deep, 0));
        fade.addColorStop(1, h.hexToRgba(pal.deep, 1));
        ctx.fillStyle = fade;
        ctx.fillRect(0, 460, 900, 200);
        const topScrim = ctx.createLinearGradient(0, 0, 0, 130);
        topScrim.addColorStop(0, h.hexToRgba(pal.deep, 0.6));
        topScrim.addColorStop(1, h.hexToRgba(pal.deep, 0));
        ctx.fillStyle = topScrim;
        ctx.fillRect(0, 0, 900, 130);

        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `600 19px ${SANS}`;
        ctx.fillText('PROFILE · 人物代言档案', 450, 62);

        const nameSize = h.fitFont(d.name, 700, 54, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(d.name, 450, 760);
        const roleSize = h.fitFont(d.role, 560, 24, 600);
        ctx.fillStyle = pal.glow;
        ctx.font = `600 ${roleSize}px ${SANS}`;
        ctx.fillText(d.role, 450, 806);

        const priceSize = h.fitFont(d.price, 320, 22, 700);
        ctx.font = `700 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(d.price).width;
        h.fillRoundRect(ctx, 450 - priceWidth / 2 - 26, 842, priceWidth + 52, 46, 23, pal.accent);
        ctx.fillStyle = '#17171f';
        ctx.fillText(d.price, 450, 874);

        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = `400 23px ${SANS}`;
        const bio = h.wrapText(d.bio, 620, 3);
        bio.lines.forEach((line, index) => ctx.fillText(line, 450, 940 + index * 36));
        h.reportBioOverflow(bio.truncated);

        const contactSize = h.fitFont(contact, 480, 24, 700);
        ctx.font = `700 ${contactSize}px ${SANS}`;
        const contactWidth = ctx.measureText(contact).width;
        h.fillRoundRect(ctx, 450 - contactWidth / 2 - 40, 1058, contactWidth + 80, 56, 28, pal.accent);
        ctx.fillStyle = '#17171f';
        ctx.fillText(contact, 450, 1096);

        const tipSize = h.fitFont(d.tip, 380, 16, 400);
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `400 ${tipSize}px ${SANS}`;
        ctx.fillText(d.tip, 90, 1156);
        const footerSize = h.fitFont(d.footer, 300, 16, 500);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.fillText(d.footer, 810, 1156);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.11 });
      }
    },

    social: {
      key: 'social',
      file: 't06-social.html',
      name: '社交渐变',
      tagline: '大图卡片与鲜明联系按钮，亲和吸睛',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        const contact = d.contact || '商务合作洽谈';
        const bg = ctx.createLinearGradient(0, 0, 900, 1200);
        bg.addColorStop(0, pal.light);
        bg.addColorStop(1, pal.dark);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 900, 1200);

        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.beginPath();
        ctx.arc(120, 1070, 150, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(806, 128, 92, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.arc(770, 1010, 64, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.shadowColor = 'rgba(40, 35, 80, 0.3)';
        ctx.shadowBlur = 34;
        ctx.shadowOffsetY = 16;
        h.fillRoundRect(ctx, 70, 88, 760, 1024, 32, '#ffffff');
        ctx.restore();

        ctx.save();
        h.roundedRect(ctx, 110, 124, 680, 430, 24);
        ctx.clip();
        h.drawPhoto(d, pal, 110, 124, 680, 430);
        ctx.restore();

        ctx.textAlign = 'center';
        const nameSize = h.fitFont(d.name, 600, 42, 800);
        ctx.fillStyle = pal.ink;
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(d.name, 450, 634);
        const roleSize = h.fitFont(d.role, 560, 22, 500);
        ctx.fillStyle = '#8a8896';
        ctx.font = `500 ${roleSize}px ${SANS}`;
        ctx.fillText(d.role, 450, 674);

        const priceSize = h.fitFont(d.price, 420, 22, 700);
        ctx.font = `700 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(d.price).width;
        h.roundedRect(ctx, 450 - priceWidth / 2 - 28, 704, priceWidth + 56, 48, 24);
        ctx.strokeStyle = pal.button;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = pal.button;
        ctx.fillText(d.price, 450, 737);

        ctx.fillStyle = '#55535f';
        ctx.font = `400 23px ${SANS}`;
        const bio = h.wrapText(d.bio, 620, 3);
        bio.lines.forEach((line, index) => ctx.fillText(line, 450, 806 + index * 36));
        h.reportBioOverflow(bio.truncated);

        const contactSize = h.fitFont(contact, 480, 24, 700);
        ctx.font = `700 ${contactSize}px ${SANS}`;
        const contactWidth = ctx.measureText(contact).width;
        h.fillRoundRect(ctx, 450 - contactWidth / 2 - 40, 940, contactWidth + 80, 56, 28, pal.button);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(contact, 450, 978);

        const tipSize = h.fitFont(d.tip, 620, 18, 400);
        ctx.fillStyle = '#9997a2';
        ctx.font = `400 ${tipSize}px ${SANS}`;
        ctx.fillText(d.tip, 450, 1040);
        const footerSize = h.fitFont(d.footer, 600, 17, 500);
        ctx.fillStyle = '#b9b7c2';
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.fillText(d.footer, 450, 1078);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#3c3c46', alpha: 0.09 });
      }
    },

    press: {
      key: 'press',
      file: 't07-press.html',
      name: '报章黑白',
      tagline: '整版人物特写与报纸排版，可信复古',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        const contact = d.contact || '商务合作洽谈请联系';
        ctx.fillStyle = pal.soft;
        ctx.fillRect(0, 0, 900, 1200);

        ctx.strokeStyle = '#161616';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(60, 62);
        ctx.lineTo(840, 62);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 72);
        ctx.lineTo(840, 72);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#141414';
        ctx.font = `800 38px ${SERIF}`;
        ctx.fillText('人物周报', 450, 128);
        ctx.fillStyle = '#5a5850';
        ctx.font = `500 15px ${SANS}`;
        ctx.fillText('PORTRAIT WEEKLY · 代言人物专刊', 450, 156);
        ctx.strokeStyle = '#161616';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 176);
        ctx.lineTo(840, 176);
        ctx.stroke();

        ctx.save();
        ctx.filter = 'grayscale(1) contrast(1.05)';
        ctx.beginPath();
        ctx.rect(70, 196, 760, 500);
        ctx.clip();
        h.drawPhoto(d, pal, 70, 196, 760, 500);
        ctx.restore();
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 2;
        ctx.strokeRect(70, 196, 760, 500);

        const tipSize = h.fitFont(d.tip, 680, 17, 400);
        ctx.fillStyle = '#75726a';
        ctx.font = `400 ${tipSize}px ${SANS}`;
        ctx.fillText(d.tip, 450, 732);

        const nameSize = h.fitFont(d.name, 740, 56, 800);
        ctx.fillStyle = '#111111';
        ctx.font = `800 ${nameSize}px ${SERIF}`;
        ctx.fillText(d.name, 450, 816);
        const roleSize = h.fitFont(d.role, 600, 20, 600);
        ctx.fillStyle = '#55534c';
        ctx.font = `600 ${roleSize}px ${SANS}`;
        ctx.fillText(d.role, 450, 854);

        const priceSize = h.fitFont(d.price, 420, 22, 700);
        ctx.font = `700 ${priceSize}px ${SANS}`;
        const priceWidth = ctx.measureText(d.price).width;
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 2;
        ctx.strokeRect(450 - priceWidth / 2 - 22, 880, priceWidth + 44, 44);
        ctx.fillStyle = '#141414';
        ctx.fillText(d.price, 450, 911);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#2c2b27';
        ctx.font = `400 22px ${SERIF}`;
        const bio = h.wrapText(d.bio, 760, 3);
        bio.lines.forEach((line, index) => ctx.fillText(line, 70, 978 + index * 33));
        h.reportBioOverflow(bio.truncated);

        ctx.strokeStyle = '#161616';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 1082);
        ctx.lineTo(840, 1082);
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(60, 1086);
        ctx.lineTo(840, 1086);
        ctx.stroke();
        const contactSize = h.fitFont(contact, 700, 22, 800);
        ctx.textAlign = 'center';
        ctx.fillStyle = pal.button;
        ctx.font = `800 ${contactSize}px ${SANS}`;
        ctx.fillText(contact, 450, 1122);
        const footerSize = h.fitFont(d.footer, 600, 15, 500);
        ctx.fillStyle = '#75726a';
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.fillText(d.footer, 450, 1156);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#1a1a1a', alpha: 0.07 });
      }
    },

    glass: {
      key: 'glass',
      file: 't08-glass.html',
      name: '通透玻璃',
      tagline: '渐变底色配半透明面板，现代通透',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        const bg = ctx.createLinearGradient(0, 0, 900, 1200);
        bg.addColorStop(0, pal.dark);
        bg.addColorStop(1, pal.deep);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 900, 1200);

        const blobA = ctx.createRadialGradient(170, 240, 0, 170, 240, 340);
        blobA.addColorStop(0, 'rgba(255,255,255,0.4)');
        blobA.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = blobA;
        ctx.beginPath();
        ctx.arc(170, 240, 340, 0, Math.PI * 2);
        ctx.fill();

        const blobB = ctx.createRadialGradient(760, 920, 0, 760, 920, 360);
        blobB.addColorStop(0, h.hexToRgba(pal.accent, 0.38));
        blobB.addColorStop(1, h.hexToRgba(pal.accent, 0));
        ctx.fillStyle = blobB;
        ctx.beginPath();
        ctx.arc(760, 920, 360, 0, Math.PI * 2);
        ctx.fill();

        const glassFill = 'rgba(255,255,255,0.2)';
        const glassStroke = 'rgba(255,255,255,0.55)';
        h.fillRoundRect(ctx, 80, 78, 740, 512, 28, glassFill);
        ctx.strokeStyle = glassStroke;
        ctx.lineWidth = 2;
        h.roundedRect(ctx, 80, 78, 740, 512, 28);
        ctx.stroke();

        ctx.save();
        h.roundedRect(ctx, 98, 96, 704, 414, 18);
        ctx.clip();
        h.drawPhoto(d, pal, 98, 96, 704, 414);
        ctx.restore();

        h.fillRoundRect(ctx, 80, 622, 740, 498, 28, glassFill);
        ctx.strokeStyle = glassStroke;
        ctx.lineWidth = 2;
        h.roundedRect(ctx, 80, 622, 740, 498, 28);
        ctx.stroke();

        const nameSize = h.fitFont(d.name, 400, 40, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(d.name, 128, 712);
        const roleSize = h.fitFont(d.role, 380, 22, 600);
        ctx.fillStyle = pal.glow;
        ctx.font = `600 ${roleSize}px ${SANS}`;
        ctx.fillText(d.role, 128, 752);

        const priceSize = h.fitFont(d.price, 280, 26, 800);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(d.price, 772, 714);
        ctx.textAlign = 'left';

        const tipSize = h.fitFont(d.tip, 640, 18, 400);
        ctx.fillStyle = 'rgba(255,255,255,0.68)';
        ctx.font = `400 ${tipSize}px ${SANS}`;
        ctx.fillText(d.tip, 128, 806);

        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        ctx.font = `400 23px ${SANS}`;
        const bio = h.wrapText(d.bio, 644, 5);
        bio.lines.forEach((line, index) => ctx.fillText(line, 128, 862 + index * 35));
        h.reportBioOverflow(bio.truncated);

        if (d.contact) {
          const contactSize = h.fitFont(d.contact, 640, 22, 700);
          ctx.font = `700 ${contactSize}px ${SANS}`;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(d.contact, 128, 1046);
        }

        const footerSize = h.fitFont(d.footer, 420, 17, 500);
        ctx.fillStyle = 'rgba(255,255,255,0.58)';
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.fillText(d.footer, 128, 1084);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.accent;
        ctx.font = `700 19px ${SANS}`;
        ctx.fillText('MORE +', 772, 1084);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.15 });
      }
    },

    ink: {
      key: 'ink',
      file: 't09-ink.html',
      name: '竖排雅致',
      tagline: '大图竖排与朱印点缀，东方韵味',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
        const sealRed = '#b03a2e';
        ctx.fillStyle = pal.soft;
        ctx.fillRect(0, 0, 900, 1200);
        ctx.strokeStyle = pal.glow;
        ctx.lineWidth = 2;
        ctx.strokeRect(34, 34, 832, 1132);

        ctx.save();
        ctx.beginPath();
        ctx.rect(76, 92, 380, 540);
        ctx.clip();
        h.drawPhoto(d, pal, 76, 92, 380, 540);
        ctx.restore();
        ctx.strokeStyle = '#26231f';
        ctx.lineWidth = 3;
        ctx.strokeRect(76, 92, 380, 540);

        h.fillRoundRect(ctx, 382, 558, 74, 74, 8, sealRed);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = `700 38px ${SERIF}`;
        ctx.fillText(Array.from(d.name)[0] || '人', 419, 612);
        ctx.textAlign = 'left';

        const limitChars = (text, limit) => {
          const chars = Array.from(text).slice(0, limit);
          if (Array.from(text).length > limit) chars[limit - 1] = '…';
          return chars;
        };

        const nameChars = limitChars(d.name, 5);
        ctx.fillStyle = '#26231f';
        ctx.font = `800 58px ${SERIF}`;
        nameChars.forEach((ch, index) => ctx.fillText(ch, 796, 140 + index * 74));

        const roleChars = limitChars(d.role, 10);
        ctx.fillStyle = '#6f6a5d';
        ctx.font = `500 26px ${SANS}`;
        roleChars.forEach((ch, index) => ctx.fillText(ch, 734, 130 + index * 36));

        const priceChars = limitChars(d.price, 12);
        ctx.fillStyle = pal.button;
        ctx.font = `600 24px ${SANS}`;
        priceChars.forEach((ch, index) => ctx.fillText(ch, 672, 130 + index * 34));

        const contactChars = limitChars(d.contact || '商务合作洽谈', 15);
        ctx.fillStyle = sealRed;
        ctx.font = `700 23px ${SANS}`;
        contactChars.forEach((ch, index) => ctx.fillText(ch, 616, 130 + index * 33));

        const bioChars = Array.from(d.bio);
        const perColumn = 27;
        const maxColumns = 3;
        ctx.fillStyle = '#3a362e';
        ctx.font = `400 23px ${SANS}`;
        for (let column = 0; column < maxColumns; column += 1) {
          for (let index = 0; index < perColumn; index += 1) {
            const charIndex = column * perColumn + index;
            if (charIndex >= bioChars.length) break;
            const isLast = charIndex === maxColumns * perColumn - 1 && bioChars.length > maxColumns * perColumn;
            ctx.fillText(isLast ? '…' : bioChars[charIndex], 560 - column * 44, 118 + index * 34);
          }
        }
        h.reportBioOverflow(bioChars.length > maxColumns * perColumn);

        ctx.fillStyle = '#6f6a5d';
        ctx.font = `400 18px ${SANS}`;
        const tip = h.wrapText(d.tip, 390, 2);
        tip.lines.forEach((line, index) => ctx.fillText(line, 76, 676 + index * 30));

        ctx.strokeStyle = pal.glow;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(84, 1098);
        ctx.lineTo(816, 1098);
        ctx.stroke();
        const footerSize = h.fitFont(d.footer, 600, 17, 500);
        ctx.fillStyle = '#8b8577';
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.textAlign = 'center';
        ctx.fillText(d.footer, 450, 1136);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#3a362e', alpha: 0.09 });
      }
    },

    dossier: {
      key: 'dossier',
      file: 't10-dossier.html',
      name: '档案编号',
      tagline: '档案卡式信息陈列，冷静专业',
      render(ctx, d, h) {
        const pal = PALETTES[d.themeKey];
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

        const serial = Array.from(d.name).reduce((sum, ch) => sum + ch.codePointAt(0), 7) % 9000 + 1000;
        ctx.fillStyle = pal.glow;
        ctx.font = `700 20px ${SANS}`;
        ctx.fillText('DOSSIER · 人物档案', 60, 84);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.accent;
        ctx.fillText(`NO. ${serial}`, 840, 84);
        ctx.textAlign = 'left';

        ctx.save();
        h.roundedRect(ctx, 470, 170, 360, 430, 10);
        ctx.clip();
        h.drawPhoto(d, pal, 470, 170, 360, 430);
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        h.roundedRect(ctx, 470, 170, 360, 430, 10);
        ctx.stroke();

        ctx.strokeStyle = pal.accent;
        ctx.lineWidth = 3;
        [[460, 160, 1, 1], [840, 160, -1, 1], [460, 610, 1, -1], [840, 610, -1, -1]].forEach(([bx, by, sx, sy]) => {
          ctx.beginPath();
          ctx.moveTo(bx + sx * 34, by);
          ctx.lineTo(bx, by);
          ctx.lineTo(bx, by + sy * 34);
          ctx.stroke();
        });

        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = `600 15px ${SANS}`;
        ctx.fillText('姓名 NAME', 60, 208);
        const nameSize = h.fitFont(d.name, 360, 34, 800);
        ctx.fillStyle = '#ffffff';
        ctx.font = `800 ${nameSize}px ${SANS}`;
        ctx.fillText(d.name, 60, 252);

        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 292);
        ctx.lineTo(420, 292);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = `600 15px ${SANS}`;
        ctx.fillText('身份 ROLE', 60, 336);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `600 26px ${SANS}`;
        const role = h.wrapText(d.role, 360, 2);
        role.lines.forEach((line, index) => ctx.fillText(line, 60, 380 + index * 36));

        ctx.beginPath();
        ctx.moveTo(60, 472);
        ctx.lineTo(420, 472);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = `600 15px ${SANS}`;
        ctx.fillText('重点 KEY INFO', 60, 516);
        const priceSize = h.fitFont(d.price, 360, 30, 800);
        ctx.fillStyle = pal.accent;
        ctx.font = `800 ${priceSize}px ${SANS}`;
        ctx.fillText(d.price, 60, 562);

        h.fillRoundRect(ctx, 60, 668, 780, 296, 14, 'rgba(255,255,255,0.06)');
        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 1;
        h.roundedRect(ctx, 60, 668, 780, 296, 14);
        ctx.stroke();
        ctx.fillStyle = pal.glow;
        ctx.font = `600 15px ${SANS}`;
        ctx.fillText('简介 PROFILE', 90, 706);
        ctx.fillStyle = 'rgba(255,255,255,0.88)';
        ctx.font = `400 22px ${SANS}`;
        const bio = h.wrapText(d.bio, 700, 6);
        bio.lines.forEach((line, index) => ctx.fillText(line, 90, 750 + index * 34));
        h.reportBioOverflow(bio.truncated);

        if (d.contact) {
          const contactSize = h.fitFont(d.contact, 620, 21, 700);
          ctx.font = `700 ${contactSize}px ${SANS}`;
          ctx.fillStyle = pal.accent;
          ctx.fillText(d.contact, 60, 1002);
        }
        const tipSize = h.fitFont(d.tip, 700, 16, 400);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = `400 ${tipSize}px ${SANS}`;
        ctx.fillText(d.tip, 60, d.contact ? 1030 : 1006);

        const seed = Array.from(d.name).reduce((sum, ch) => sum + ch.codePointAt(0), 3);
        let barX = 60;
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        for (let i = 0; i < 42; i += 1) {
          const barWidth = (i * 7 + seed) % 3 + 1;
          if (i % 2 === 0) ctx.fillRect(barX, 1040, barWidth, 52);
          barX += barWidth + 2;
        }
        const footerSize = h.fitFont(d.footer, 380, 16, 500);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.font = `500 ${footerSize}px ${SANS}`;
        ctx.fillText(d.footer, 60, 1122);
        ctx.textAlign = 'right';
        ctx.fillStyle = pal.accent;
        ctx.font = `700 19px ${SANS}`;
        ctx.fillText('MORE +', 840, 1076);
        ctx.textAlign = 'left';
        h.drawWatermark(d.watermark, { color: '#ffffff', alpha: 0.09 });
      }
    }
  };

  window.CARD_TEMPLATES = CARD_TEMPLATES;
  window.CARD_HELPERS = helpers;
  window.CARD_PALETTES = PALETTES;
})();
