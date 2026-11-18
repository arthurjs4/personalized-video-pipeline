// Ajudantes de cor (TS puro: também roda no node, sem React).

export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
};

export const rgbStr = (hex: string) => hexToRgb(hex).join(',');

/** mistura duas cores hex: p = 0 devolve a, p = 1 devolve b */
export const mix = (a: string, b: string, p: number) => {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return '#' + x.map((c, i) => Math.round(c + (y[i] - c) * p).toString(16).padStart(2, '0')).join('').toUpperCase();
};
