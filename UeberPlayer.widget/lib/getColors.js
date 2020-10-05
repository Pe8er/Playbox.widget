
import ColorThief from "./color-thief.mjs";
const Thief = new ColorThief();

// Converts rgb to hex
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

// Calculates the relative luminance of an rgb color
const luminance = (r, g, b) => {
  const a = [r, g, b].map((x) => {
    x /= 255;
    return (x <= .03928) ? (x / 12.92) : (Math.pow((x + 0.055) / 1.055, 2.4));
  });
  return a[0] * .2126 + a[1] * .7152 + a[2] * .0722;
}

// Calculates contrast from two luminance values from two colors
const contrast = (lum1, lum2) => {
  const lightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (lightest + .05) / (darkest + .05);
}

// Get a fallback color for text over the primary color
const getFallbackColor = (color, primaryColorLum, offset) => {
  // Calculate HSL values first
  const r = color[0] / 255;
  const g = color[1] / 255;
  const b = color[2] / 255;
  const cmax = Math.max(r, g, b);
  const cmin = Math.min(r, g, b);
  const chroma = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = (cmax + cmin) / 2;
  if (chroma !== 0) {
    switch (cmax) {
      case r: h = ((g - b) / chroma) % 6; break;
      case g: h = ((b - r) / chroma) + 2; break;
      case b: h = ((r - g) / chroma) + 4; break;
    }
    h = Math.round(h * 60) + (h < 0 ? 360 : 0);
    s = Math.round(chroma / (1 - Math.abs(2 * l - 1)))
  }

  // Set a specified lightness value, depending on the primary color's luminance
  l = (primaryColorLum <= 0.2) ? 1 - offset : offset;

  // Convert the new HSL into RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let newRgb;

  if (h < 60) { newRgb = [c, x, 0]; }
  else if (h < 120) { newRgb = [x, c, 0]; }
  else if (h < 180) { newRgb = [0, c, x]; }
  else if (h < 240) { newRgb = [0, x, c]; }
  else if (h < 300) { newRgb = [x, 0, c]; }
  else { newRgb = [c, 0, x]; }

  return newRgb.map((v) => Math.round((v + m) * 255));
}

// Update adaptive colors
const getColors = ({ img }, previousState, options) => {
  const primaryColor = Thief.getColor(img);
  let secondaryColor, tercaryColor;
  let secondaryContrast = 0, tercaryContrast = 0;
  const primaryColorLum = luminance(primaryColor[0], primaryColor[1], primaryColor[2]);

  // Prioritize colors that aren't "too black" (luminance < .002) nor "too white" (luminance > .9)
  let palette = Thief.getPalette(img).map(swatch => [...swatch, luminance(...swatch)]);
  palette = palette.filter((s) => s[3] >= .002 && s[3] <= .9).concat(palette.filter((s) => s[3] < .002 || s[3] > .9));

  // Find appropriate color choices in palette
  for (const swatch of palette) {
    // Calculate the contrast between the background color and the tested color
    const swatchLum = luminance(swatch[0], swatch[1], swatch[2]);
    const contrastValue = contrast(primaryColorLum, swatchLum);

    // If enough contrast (2.6 is a good number imo, though W3 recommends up to 4.5), use this color
    if (contrastValue >= options.minContrast) {
      if (secondaryContrast < options.minContrast) {    // Secondary color takes priority
        secondaryColor = swatch;
        secondaryContrast = contrastValue;
      } else {    // Tercary color later and break the loop from here
        tercaryColor = swatch;
        tercaryContrast = contrastValue;
        break;
      }
    } else if (contrastValue > secondaryContrast) {     // If contrast is below threshold, save the most contrasting colors just in case
      tercaryColor = secondaryColor;
      tercaryContrast = secondaryContrast;
      secondaryColor = swatch;
      secondaryContrast = contrastValue;
    } else if (contrastValue > tercaryContrast) {       // If contrast is below threshold, save the most contrasting colors just in case
      tercaryColor = swatch;
      tercaryContrast = contrastValue;
    }
  }

  // If colors selected still don't have enough contrast, get a fallback color based on the background color
  // A contrast value below 1.75 seems like a good threshold
  if (secondaryContrast < 1.75) {
    secondaryColor = getFallbackColor(secondaryColor, primaryColorLum, .2);
  }
  if (tercaryContrast < 1.75) {
    tercaryColor = getFallbackColor(tercaryColor, primaryColorLum, .3);
  }

  const { art1, art2, alternate } = previousState.artwork;
  return {
    ...previousState,
    songChange: false,
    primaryColor: rgbToHex(primaryColor[0], primaryColor[1], primaryColor[2]),
    secondaryColor: rgbToHex(secondaryColor[0], secondaryColor[1], secondaryColor[2]),
    tercaryColor: rgbToHex(tercaryColor[0], tercaryColor[1], tercaryColor[2]),
    artwork: {
      art1: alternate ? art1 : img.src,
      art2: !alternate ? art2 : img.src,
      alternate: !alternate
    }
  };
}

export default getColors;
