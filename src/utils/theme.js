// StageCase Mobile Theme — aligned with Web design system (Dark Jade & Gold)
export const COLORS = {
  // Backgrounds
  background: '#0D1117',      // Primary dark backdrop
  bgSecondary: '#161B22',     // Secondary dark backdrop
  card: '#1C2128',            // Elevated card
  surface: '#22272E',         // Surface panels

  // Primary Brand: Dark Jade & Antique Gold
  primary: '#2D6F73',         // Brand Jade
  primaryHover: '#357E82',    // Jade Hover
  primarySubtle: 'rgba(45, 111, 115, 0.15)',

  accent: '#B89B5E',          // Brand Gold Accent
  gold: '#B89B5E',
  goldHover: '#C6A96C',
  goldSubtle: 'rgba(184, 155, 94, 0.15)',

  // Legacy/Semantic aliases
  jade: '#2D6F73',
  darkJade: '#23585B',
  lightJade: '#479599',
  bronze: '#B89B5E',
  amber: '#D29922',

  // Typography
  ivory: '#F3F4F6',           // Text Primary
  textPrimary: '#F3F4F6',     
  textSecondary: '#B6BDC8',   // Secondary Text
  textMuted: '#7D8590',       // Muted Text
  white: '#FFFFFF',

  // Borders & Dividers
  border: '#30363D',          // Primary Border
  borderSubtle: 'rgba(48, 54, 61, 0.6)',
  borderLight: 'rgba(243, 244, 246, 0.12)',

  // Status
  success: '#3FB950',
  warning: '#D29922',
  error: '#F85149',
  danger: '#F85149',
};

// Band Specific Visual Identity Mapping
export const BAND_COLORS = {
  'Crayon Case':  { primary: '#2D6F73', accent: '#D6B46B' },
  'Reality Club': { primary: '#5D4E89', accent: '#D8C5A2' },
  'The Milo':     { primary: '#6E8B6B', accent: '#C9A46A' },
  'Wave to Earth':{ primary: '#4F6D8C', accent: '#BFCFD7' },
};

export function getBandColor(artistName) {
  if (!artistName) return BAND_COLORS['Crayon Case'];
  const foundKey = Object.keys(BAND_COLORS).find(k => 
    artistName.toLowerCase().includes(k.toLowerCase())
  );
  return foundKey ? BAND_COLORS[foundKey] : BAND_COLORS['Crayon Case'];
}

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  mono: 'Courier New',
};

