export const DISTANCES = {
  marathon: 26.2,
  half: 13.1,
  tenk: 6.21,
  fivek: 3.1
};

export const TYPE_LABELS = {
  marathon: 'Marathon',
  half: 'Half Marathon',
  tenk: '10K',
  fivek: '5K'
};

// Race types outside the known set are stored as a raw mileage value in Notion
export function raceMiles(raceType) {
  if (DISTANCES[raceType]) return DISTANCES[raceType];
  const parsed = parseFloat(raceType);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatPace(epochSeconds, miles) {
  if (!epochSeconds || !miles) return null;
  const secPerMile = Math.round(epochSeconds / miles);
  const m = Math.floor(secPerMile / 60);
  const s = secPerMile % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDuration(epochSeconds) {
  if (!epochSeconds || epochSeconds <= 0) return null;
  const total = Math.round(epochSeconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
