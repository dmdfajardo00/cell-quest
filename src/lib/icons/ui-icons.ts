// UI SVG icon functions for CELL QUEST
// Clean, rounded aesthetic matching the organic game style

export function checkmark(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M14 34l12 12 24-28" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

export function cross(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M16 16l32 32M48 16l-32 32" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

export function lightbulb(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M32 6C21 6 14 14 14 24c0 7 4 12 8 16v6c0 2 1 3 3 3h14c2 0 3-1 3-3v-6c4-4 8-9 8-16 0-10-7-18-18-18z" fill="${color}" opacity="0.12" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="25" y1="49" x2="39" y2="49" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <line x1="27" y1="53" x2="37" y2="53" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <path d="M28 40v-6c-3-2-6-5-6-10a10 10 0 0120 0c0 5-3 8-6 10v6" stroke="${color}" stroke-width="1.5" opacity="0.4" stroke-linecap="round"/>
  </svg>`;
}

export function star(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M32 6l8 16 18 3-13 13 3 18-16-8-16 8 3-18L6 25l18-3z" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

export function starFilled(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M32 6l8 16 18 3-13 13 3 18-16-8-16 8 3-18L6 25l18-3z" fill="${color}" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

export function hint(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M32 8C22 8 16 16 16 25c0 6 3 11 7 14v5c0 2 1 3 3 3h12c2 0 3-1 3-3v-5c4-3 7-8 7-14 0-9-6-17-16-17z" fill="${color}" opacity="0.12" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="26" y1="50" x2="38" y2="50" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <line x1="28" y1="54" x2="36" y2="54" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <line x1="32" y1="2" x2="32" y2="6" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <line x1="50" y1="10" x2="47" y2="13" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <line x1="14" y1="10" x2="17" y2="13" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <line x1="56" y1="25" x2="52" y2="25" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <line x1="8" y1="25" x2="12" y2="25" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  </svg>`;
}

export function book(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M8 12c0-2 2-4 6-5 6-1 14 1 18 4 4-3 12-5 18-4 4 1 6 3 6 5v34c0 2-2 3-6 3-6 0-13 1-18 5-5-4-12-5-18-5-4 0-6-1-6-3V12z" fill="${color}" opacity="0.08" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32 11v38" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    <path d="M16 16c4-1 8-1 12 1" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M16 22c4-1 8-1 12 1" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M16 28c4-1 8-1 12 1" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M36 17c4-2 8-2 12-1" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M36 23c4-2 8-2 12-1" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M36 29c4-2 8-2 12-1" stroke="${color}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>
  </svg>`;
}

export function trophy(size = 32, color = 'currentColor'): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
    <path d="M18 8h28v18c0 10-6 16-14 16S18 36 18 26V8z" fill="${color}" opacity="0.12" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 14H10c-2 0-3 1-3 3v4c0 5 4 9 9 9h2" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <path d="M46 14h8c2 0 3 1 3 3v4c0 5-4 9-9 9h-2" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <line x1="32" y1="42" x2="32" y2="50" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M22 50h20c1 0 2 1 2 2v2H20v-2c0-1 1-2 2-2z" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28 18l2 4 4 0-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="${color}" opacity="0.3"/>
  </svg>`;
}
