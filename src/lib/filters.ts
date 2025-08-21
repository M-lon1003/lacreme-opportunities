export const DISCIPLINES = [
  'Murals','Public Art','Game Dev','Film','Animation','AR/VR',
  'Illustration','Sound/Music','Writing','Design','Mixed Media','Digital'
];

export const LOCATIONS = [
  'Global','Australia',
  'NSW, Australia','VIC, Australia','QLD, Australia','SA, Australia',
  'WA, Australia','TAS, Australia','NT, Australia','ACT, Australia'
];

export const MIN_AMOUNTS = [0, 1000, 5000, 10000, 20000, 50000, 100000];
export const amountLabel = (n:number) => (n===0 ? 'Any amount' : `${n.toLocaleString()}+`);
