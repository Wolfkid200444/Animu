module.exports = class CanvasUtil {
  static shortenText(ctx, text, maxWidth) {
    let shorten = false;
    while (ctx.measureText(text).width > maxWidth) {
      if (!shorten) shorten = true;
      text = text.substr(0, text.length - 1);
    }
    return shorten ? `${text}...` : text;
  }

  static drawImageWithTint(ctx, image, color, x, y, width, height) {
    const { fillStyle, globalAlpha } = ctx;
    ctx.fillStyle = color;
    ctx.drawImage(image, x, y, width, height);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = globalAlpha;
  }

  static distort(ctx, amplitude, x, y, width, height, strideLevel = 4) {
    const data = ctx.getImageData(x, y, width, height);
    const temp = ctx.getImageData(x, y, width, height);
    const stride = width * strideLevel;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const xs = Math.round(
          amplitude * Math.sin(2 * Math.PI * 3 * (j / height))
        );
        const ys = Math.round(
          amplitude * Math.cos(2 * Math.PI * 3 * (i / width))
        );
        const dest = j * stride + i * strideLevel;
        const src = (j + ys) * stride + (i + xs) * strideLevel;
        data.data[dest] = temp.data[src];
        data.data[dest + 1] = temp.data[src + 1];
        data.data[dest + 2] = temp.data[src + 2];
      }
    }
    ctx.putImageData(data, x, y);
    return ctx;
  }
***REMOVED***
