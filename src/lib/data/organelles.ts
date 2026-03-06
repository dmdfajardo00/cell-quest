export interface OrganelleInfo {
  name: string;
  color: string;
  description: string;
}

export const organelles: Record<string, OrganelleInfo> = {
  'Cell': {
    name: 'Cell',
    color: '#7C3AED',
    description: 'The basic unit of life',
  },
  'Nucleus': {
    name: 'Nucleus',
    color: '#8B5CF6',
    description: 'Control center containing DNA',
  },
  'Cell Membrane': {
    name: 'Cell Membrane',
    color: '#A78BFA',
    description: 'Regulates what enters and exits',
  },
  'Mitochondrion': {
    name: 'Mitochondrion',
    color: '#FF6B6B',
    description: 'Powerhouse that produces energy',
  },
  'Chloroplast': {
    name: 'Chloroplast',
    color: '#4ADE80',
    description: 'Captures sunlight for photosynthesis',
  },
  'Cell Wall': {
    name: 'Cell Wall',
    color: '#FFB938',
    description: 'Rigid structure for support and shape',
  },
  'Vacuole': {
    name: 'Vacuole',
    color: '#4EA8DE',
    description: 'Stores water and nutrients',
  },
  'Ribosome': {
    name: 'Ribosome',
    color: '#F472B6',
    description: 'Builds proteins for the cell',
  },
  'Cytoplasm': {
    name: 'Cytoplasm',
    color: '#C4B5FD',
    description: 'Gel-like fluid filling the cell',
  },
};
