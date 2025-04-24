// Color conversion and palette generation utilities

export function hexToHSL(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s, l];
}

export function hslToHex(h, s, l) {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Utility to determine if black or white text is more readable on a given hex background
function getReadableTextColor(bgHex) {
  // Calculate luminance
  const hex = bgHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.6 ? '#111111' : '#ffffff';
}

export function generatePalette(baseHex) {
  const [h, s, l] = hexToHSL(baseHex);

  // Light UI: background is a light, colored tint of the base color
  // Use the same hue, very low saturation, high lightness
  // Visibly colored background and surface for light UI
  // Make background and surface darker so color is more visible
  const background = hslToHex(h, Math.max(0.30, s * 0.45), 0.85); // more colored, less light
  const surface = hslToHex(h, Math.max(0.32, s * 0.5), 0.78); // even more colored, darker
  const primary = baseHex;
  const secondary = hslToHex((h + 30) % 360, s, Math.max(Math.min(l, 0.7), 0.4)); // analogous, mid-light
  const text = getReadableTextColor(background);

  return {
    background,
    surface,
    primary,
    secondary,
    text,
  };
}
