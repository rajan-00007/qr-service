import QRCode from "qrcode";
import { createCanvas, loadImage } from "canvas";
import path from "path";

export let cachedLogoImg: any = null; // exported so test can mutate it
const logoPath = path.join(__dirname, "../assets/logo.png");
loadImage(logoPath).then(img => { cachedLogoImg = img; }).catch(() => { });

export async function generateQR(shortCode: string, data?: any) {
  const baseUrl = process.env.QR_BASE_URL || "https://whereplus/qr";
  const url = `${baseUrl}/${shortCode}`;
  const scale = 1.2;


  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 800,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // Extract dynamic data
  const email = data?.metadata?.email || null;
  const phone = data?.metadata?.phone || null;


  const width = 1338;
  const height = 2020;

  const canvas = createCanvas(Math.round(width * scale), Math.round(height * scale));
  const ctx = canvas.getContext("2d");

  ctx.scale(scale, scale);

  // Clip canvas to rounded card
  const rCanvas = 117;
  ctx.beginPath();
  ctx.moveTo(rCanvas, 0);
  ctx.lineTo(width - rCanvas, 0);
  ctx.quadraticCurveTo(width, 0, width, rCanvas);
  ctx.lineTo(width, height - rCanvas);
  ctx.quadraticCurveTo(width, height, width - rCanvas, height);
  ctx.lineTo(rCanvas, height);
  ctx.quadraticCurveTo(0, height, 0, height - rCanvas);
  ctx.lineTo(0, rCanvas);
  ctx.quadraticCurveTo(0, 0, rCanvas, 0);
  ctx.closePath();
  ctx.clip();

  // Draw the rounded background (white canvas)
  roundRect(ctx, 0, 0, width, height, rCanvas, "#ffffff");

  // ====== LOGO AREA ======
  let logoImg: any = cachedLogoImg;
  if (!logoImg) {
    try {
      logoImg = await loadImage(logoPath);
      cachedLogoImg = logoImg;
    } catch (e) {
      // ignore
    }
  }

  // Adjusted logo size for 1338 width scale
  const logoH = 87;
  const logoW = 137;

  const brandText = "Whereplus";
  ctx.font = "normal 87px Arial, sans-serif";
  const textWidth = ctx.measureText(brandText).width;

  const gap = 40;
  const totalLogoW = logoW + gap + textWidth;
  const startX = (width - totalLogoW) / 2;
  const logoY = 138;

  if (logoImg) {
    ctx.drawImage(logoImg, startX, logoY, logoW, logoH);
  }

  ctx.fillStyle = "#111111";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(brandText, startX + logoW + gap, logoY + logoH / 2 + 5);

  // GRADIENT CARD VARIABLES 

  const cardX = 184; // (1338 - 970) / 2
  const cardY = 388; // margin top 388px 
  const cardW = 970; // width scaled up 
  const cardH = 1466; // blue container height
  const rCard = 67;   // radius for card

  // DECORATIVE BARS (left side) 
  const lBarX = 50;
  const lBarRight = cardX + 67;
  const lBarY = cardY + 382;
  const lBarGap = 40;
  const lBarH = 47;

  // Bar 1 (top)
  roundRect(ctx, lBarX + 60, lBarY, lBarRight - (lBarX + 60), lBarH, lBarH / 2, "#221d67");
  // Bar 2 (bottom)
  roundRect(ctx, lBarX, lBarY + lBarH + lBarGap, lBarRight - lBarX, lBarH, lBarH / 2, "#221d67");

  // DECORATIVE BARS
  const rBarLeft = cardX + cardW - 67;
  const rBarEnd = width - 50;
  const rBarY = cardY + 1101;
  const rBarGap = 40;
  const rBarH = 47;

  // Bar 1 (top)
  roundRect(ctx, rBarLeft, rBarY, rBarEnd - rBarLeft, rBarH, rBarH / 2, "#3051A0");
  // Bar 2 (bottom)
  roundRect(ctx, rBarLeft, rBarY + rBarH + rBarGap, rBarEnd - rBarLeft - 60, rBarH, rBarH / 2, "#3051A0");

  // MAIN GRADIENT CARD 

  const gradient = ctx.createLinearGradient(cardX, cardY + cardH, cardX, cardY);
  gradient.addColorStop(0, "#3a79cc");
  gradient.addColorStop(0.57, "#221d67");
  gradient.addColorStop(1, "#221d67");
  roundRect(ctx, cardX, cardY, cardW, cardH, rCard, gradient);

  // "SCAN THE CODE" TEXT 
  ctx.font = "bold 67px Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.fillText("SCAN THE CODE", width / 2, cardY + 230);

  // QR CODE 
  const qrBgSize = 636;
  const qrBgX = (width - qrBgSize) / 2;
  const qrBgY = cardY + 415;
  const rQR = 54;

  // White rounded background for QR
  roundRect(ctx, qrBgX, qrBgY, qrBgSize, qrBgSize, rQR, "#ffffff");

  // Inner QR code sizes
  const qrPadding = 28;
  const qrSize = qrBgSize - (qrPadding * 2);


  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, qrBgX + qrPadding, qrBgY + qrPadding, qrSize, qrSize);

  //  FOOTER TEXTS 
  ctx.font = "bold 50px Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(email, width / 2, cardY + cardH - 174);
  ctx.fillText(phone, width / 2, cardY + cardH - 94);

  // CONVERT TO PNG DATA URL
  const qrImage = canvas.toDataURL("image/png");

  return {
    qrUrl: url,
    qrImage
  };
}

// Helper - draw a filled rounded rectangle
function roundRect(
  ctx: any,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string | CanvasGradient
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}
