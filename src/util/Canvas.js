module.exports = class CanvasUtil {
  static greyscale(ctx, x, y, width, height) {
    const data = ctx.getImageData(x, y, width, height);
    for (let i = 0; i < data.data.length; i += 4) {
      const brightness =
        0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
      data.data[i] = brightness;
      data.data[i + 1] = brightness;
      data.data[i + 2] = brightness;
    }
    ctx.putImageData(data, x, y);
    return ctx;
  }

  static shortenText(ctx, text, maxWidth) {
    let shorten = false;
    while (ctx.measureText(text).width > maxWidth) {
      if (!shorten) shorten = true;
      text = text.substr(0, text.length - 1);
    }
    return shorten ? `${text}...` : text;
  }

  static sepia(ctx, x, y, width, height) {
    const data = ctx.getImageData(x, y, width, height);
    for (let i = 0; i < data.data.length; i += 4) {
      const brightness =
        0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
      data.data[i] = brightness + 100;
      data.data[i + 1] = brightness + 50;
      data.data[i + 2] = brightness;
    }
    ctx.putImageData(data, x, y);
    return ctx;
  }

  static silhouette(ctx, x, y, width, height) {
    const data = ctx.getImageData(x, y, width, height);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = 0;
      data.data[i + 1] = 0;
      data.data[i + 2] = 0;
    }
    ctx.putImageData(data, x, y);
    return ctx;
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
};
