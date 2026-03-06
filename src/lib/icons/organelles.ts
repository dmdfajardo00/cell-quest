// Organelle SVG icon functions for CELL QUEST
// Blobby, organic Spore-like aesthetic

export function Cell(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M32 4C18 3 6 14 5 30c-1 16 12 28 27 29s28-10 29-26C62 17 48 5 32 4z" fill="${color}" opacity="0.15" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="24" cy="28" r="3" fill="${color}" opacity="0.5"/>
    <circle cx="38" cy="22" r="2.5" fill="${color}" opacity="0.4"/>
    <circle cx="30" cy="40" r="2" fill="${color}" opacity="0.45"/>
    <circle cx="42" cy="36" r="2.8" fill="${color}" opacity="0.35"/>
    <circle cx="20" cy="38" r="1.8" fill="${color}" opacity="0.4"/>
    <circle cx="34" cy="30" r="6" fill="${color}" opacity="0.25" stroke="${color}" stroke-width="1.5"/>
  </svg>`;
}

export function Nucleus(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M32 6C17 5 6 17 7 32c1 14 13 26 27 26s24-11 24-25C58 18 47 7 32 6z" fill="${color}" opacity="0.12" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M32 10C20 9 10 20 11 32c1 11 11 21 22 21s20-9 20-20C53 21 44 11 32 10z" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.5"/>
    <circle cx="28" cy="28" r="1.5" fill="${color}" opacity="0.5"/>
    <circle cx="36" cy="26" r="1.2" fill="${color}" opacity="0.45"/>
    <circle cx="32" cy="34" r="1.8" fill="${color}" opacity="0.4"/>
    <circle cx="26" cy="36" r="1" fill="${color}" opacity="0.5"/>
    <circle cx="38" cy="34" r="1.3" fill="${color}" opacity="0.35"/>
    <path d="M25 30c3-4 8-5 14-2" stroke="${color}" stroke-width="1" opacity="0.3" stroke-linecap="round"/>
  </svg>`;
}

export function CellMembrane(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M10 32c0-14 8-24 22-24s22 10 22 24-8 24-22 24S10 46 10 32z" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    <path d="M13 32c0-12 7-21 19-21s19 9 19 21-7 21-19 21S13 44 13 32z" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <circle cx="14" cy="22" r="2.5" fill="${color}" opacity="0.5"/>
    <circle cx="48" cy="26" r="2.5" fill="${color}" opacity="0.5"/>
    <circle cx="18" cy="44" r="2.2" fill="${color}" opacity="0.45"/>
    <circle cx="46" cy="40" r="2.3" fill="${color}" opacity="0.45"/>
    <circle cx="26" cy="10" r="2" fill="${color}" opacity="0.5"/>
    <circle cx="38" cy="53" r="2.2" fill="${color}" opacity="0.45"/>
    <circle cx="11" cy="34" r="1.8" fill="${color}" opacity="0.4"/>
  </svg>`;
}

export function Mitochondrion(size = 32, color = 'currentColor'): string {
  const warmColor = color === 'currentColor' ? '#e06040' : color;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M12 32c0-10 8-18 20-18s20 8 20 18-8 18-20 18S12 42 12 32z" fill="${warmColor}" opacity="0.15" stroke="${warmColor}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M18 26c4-6 10-4 12 0s6 8 12 4" stroke="${warmColor}" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
    <path d="M16 34c5-5 9-2 12 2s7 6 14 2" stroke="${warmColor}" stroke-width="1.8" stroke-linecap="round" opacity="0.45"/>
    <path d="M20 40c3-4 7-2 10 1s6 4 10 1" stroke="${warmColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
    <path d="M22 22c2-2 5-1 7 1s5 3 8 0" stroke="${warmColor}" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>
  </svg>`;
}

export function Chloroplast(size = 32, color = 'currentColor'): string {
  const greenColor = color === 'currentColor' ? '#4a9e4a' : color;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <ellipse cx="32" cy="32" rx="24" ry="14" fill="${greenColor}" opacity="0.15" stroke="${greenColor}" stroke-width="2.5" transform="rotate(-8 32 32)"/>
    <rect x="18" y="24" width="10" height="3" rx="1.5" fill="${greenColor}" opacity="0.4" transform="rotate(-8 23 25.5)"/>
    <rect x="20" y="29" width="12" height="3" rx="1.5" fill="${greenColor}" opacity="0.35" transform="rotate(-8 26 30.5)"/>
    <rect x="22" y="34" width="10" height="3" rx="1.5" fill="${greenColor}" opacity="0.4" transform="rotate(-8 27 35.5)"/>
    <rect x="34" y="24" width="10" height="3" rx="1.5" fill="${greenColor}" opacity="0.35" transform="rotate(-8 39 25.5)"/>
    <rect x="32" y="29" width="12" height="3" rx="1.5" fill="${greenColor}" opacity="0.4" transform="rotate(-8 38 30.5)"/>
    <rect x="34" y="34" width="10" height="3" rx="1.5" fill="${greenColor}" opacity="0.35" transform="rotate(-8 39 35.5)"/>
    <circle cx="28" cy="30" r="1" fill="${greenColor}" opacity="0.6"/>
    <circle cx="38" cy="28" r="1" fill="${greenColor}" opacity="0.6"/>
  </svg>`;
}

export function CellWall(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <rect x="4" y="4" width="56" height="56" rx="4" fill="${color}" opacity="0.08" stroke="${color}" stroke-width="2.5"/>
    <line x1="4" y1="18" x2="60" y2="18" stroke="${color}" stroke-width="1.5" opacity="0.4"/>
    <line x1="4" y1="32" x2="60" y2="32" stroke="${color}" stroke-width="1.5" opacity="0.4"/>
    <line x1="4" y1="46" x2="60" y2="46" stroke="${color}" stroke-width="1.5" opacity="0.4"/>
    <line x1="20" y1="4" x2="20" y2="18" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="44" y1="4" x2="44" y2="18" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="12" y1="18" x2="12" y2="32" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="36" y1="18" x2="36" y2="32" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="52" y1="18" x2="52" y2="32" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="20" y1="32" x2="20" y2="46" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="44" y1="32" x2="44" y2="46" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="12" y1="46" x2="12" y2="60" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="36" y1="46" x2="36" y2="60" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <line x1="52" y1="46" x2="52" y2="60" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
  </svg>`;
}

export function Vacuole(size = 32, color = 'currentColor'): string {
  const blueColor = color === 'currentColor' ? '#6cb4e8' : color;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M32 5C16 4 4 16 5 33c1 16 14 27 28 26s25-13 25-28C58 16 48 6 32 5z" fill="${blueColor}" opacity="0.18" stroke="${blueColor}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M32 12C21 11 11 21 12 33c1 11 10 19 20 19s19-9 19-20C51 21 43 13 32 12z" fill="${blueColor}" opacity="0.1"/>
    <ellipse cx="26" cy="24" rx="6" ry="3" fill="white" opacity="0.35" transform="rotate(-30 26 24)"/>
    <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.3"/>
  </svg>`;
}

export function Ribosome(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <circle cx="28" cy="36" r="14" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="2.5"/>
    <circle cx="38" cy="24" r="10" fill="${color}" opacity="0.15" stroke="${color}" stroke-width="2" stroke-dasharray="3 2"/>
    <circle cx="28" cy="36" r="3" fill="${color}" opacity="0.35"/>
    <circle cx="38" cy="24" r="2" fill="${color}" opacity="0.3"/>
    <path d="M33 30c1-1 2-2 3-3" stroke="${color}" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>
  </svg>`;
}

export function Cytoplasm(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M32 4C18 3 6 14 5 30c-1 16 12 28 27 29s28-10 29-26C62 17 48 5 32 4z" fill="${color}" opacity="0.08" stroke="${color}" stroke-width="2" stroke-dasharray="5 3" stroke-linecap="round"/>
    <circle cx="18" cy="26" r="1.5" fill="${color}" opacity="0.3"/>
    <circle cx="28" cy="18" r="1" fill="${color}" opacity="0.25"/>
    <circle cx="42" cy="22" r="1.3" fill="${color}" opacity="0.28"/>
    <circle cx="38" cy="40" r="1.5" fill="${color}" opacity="0.3"/>
    <circle cx="22" cy="42" r="1.2" fill="${color}" opacity="0.25"/>
    <circle cx="46" cy="34" r="1" fill="${color}" opacity="0.22"/>
    <circle cx="16" cy="36" r="0.8" fill="${color}" opacity="0.2"/>
    <circle cx="34" cy="30" r="1.1" fill="${color}" opacity="0.26"/>
    <circle cx="26" cy="34" r="0.9" fill="${color}" opacity="0.22"/>
    <circle cx="40" cy="28" r="0.7" fill="${color}" opacity="0.2"/>
  </svg>`;
}
