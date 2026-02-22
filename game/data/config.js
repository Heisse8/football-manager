const formations = {
  "4-3-3": { attack: 1.08, defense: 0.95 },
  "4-4-2": { attack: 1.00, defense: 1.00 },
  "3-5-2": { attack: 1.05, defense: 1.02 },
  "5-4-1": { attack: 0.90, defense: 1.12 }
};

const styles = {
  possession: { attack: 1.05 },
  pressing: { attack: 1.08 },
  counter: { attack: 0.92 },
  park: { attack: 0.75 }
};

const lineHeights = {
  high: { volume: 1.05 },
  medium: { volume: 1.0 },
  low: { volume: 0.94 }
};

const pressingIntensity = {
  low: { ballWin: 0.92 },
  medium: { ballWin: 1.0 },
  high: { ballWin: 1.1 }
};

module.exports = {
  formations,
  styles,
  lineHeights,
  pressingIntensity
};