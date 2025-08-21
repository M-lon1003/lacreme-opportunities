// src/lib/filters.ts

export const DISCIPLINES = [
  'Visual Arts',
  'Digital Art',
  'Film / Video',
  'Animation',
  'Photography',
  'Sculpture',
  'Painting',
  'Performance',
  'Theatre',
  'Music',
  'Literature',
  'Design',
  'Architecture',
  'Games',
  'XR / AR / VR',
  'New Media',
  'Public Art',
  'Mural',
  'Installation',
  'Sound',
];

export const LOCATIONS = [
  'Global',
  'Remote',
  'United States',
  'Canada',
  'United Kingdom',
  'Europe',
  'Australia',
  'New Zealand',
  'Asia',
  'Africa',
  'Latin America',
];

export const MIN_AMOUNTS = [0, 500, 1000, 2500, 5000, 10000, 20000, 50000];

export const amountLabel = (n: number) =>
  n === 0 ? 'Any amount' : `≥ $${n.toLocaleString()}`;
