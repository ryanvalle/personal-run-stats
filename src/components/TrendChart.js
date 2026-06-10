import { useMemo, useState } from 'react';
import { Orbitron } from 'next/font/google';
import { TYPE_LABELS, formatDuration, formatPace, raceMiles } from '../helpers/race';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['800']
});

const W = 860;
const H = 330;
const PAD = { top: 28, right: 30, bottom: 42, left: 78 };

// Finish times plotted over the years, one line per race distance.
// Faster finishes sit higher on the chart; hovering/tapping a point shows details.
export default function TrendChart({ races }) {
  const byType = useMemo(() => {
    const out = {};
    Object.keys(TYPE_LABELS).forEach((type) => {
      const runs = races
        .filter((r) => r.race_type === type && r.race_stats.finish_time.epoch > 0)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      if (runs.length >= 2) out[type] = runs;
    });
    return out;
  }, [races]);

  const types = Object.keys(byType);
  const [selected, setSelected] = useState(null);
  const [tip, setTip] = useState(null);

  if (!types.length) return null;

  const active = selected && byType[selected] ? selected : types[0];
  const data = byType[active];

  const epochs = data.map((r) => r.race_stats.finish_time.epoch);
  const fastest = Math.min(...epochs);
  const slowest = Math.max(...epochs);
  const span = slowest - fastest || fastest * 0.05 || 1;
  const lo = fastest - span * 0.18;
  const hi = slowest + span * 0.18;

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (i / (data.length - 1)) * plotW;
  const y = (v) => PAD.top + ((v - lo) / (hi - lo)) * plotH;

  const points = data.map((race, i) => ({
    race,
    cx: x(i),
    cy: y(race.race_stats.finish_time.epoch)
  }));
  const line = points.map((p) => `${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(' ');
  const area = `${PAD.left},${PAD.top + plotH} ${line} ${PAD.left + plotW},${PAD.top + plotH}`;

  const ticks = [0, 1, 2, 3].map((i) => lo + ((hi - lo) * i) / 3);

  let prevYear = null;
  const yearLabels = points.map((p) => {
    const yr = new Date(p.race.date).getFullYear();
    const label = yr !== prevYear ? yr : null;
    prevYear = yr;
    return label;
  });

  const showTip = (p) => setTip({ xPct: (p.cx / W) * 100, yPct: (p.cy / H) * 100, race: p.race });

  return (
    <div className="pt-3">
      <div className="flex flex-wrap gap-2 pb-3" role="tablist" aria-label="chart race distance">
        {types.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={active === t}
            onClick={() => { setSelected(t); setTip(null); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === t
                ? 'bg-orange-500 text-white shadow'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-400'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 md:p-4">
        <div className="relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            onMouseLeave={() => setTip(null)}
            role="img"
            aria-label={`${TYPE_LABELS[active]} finish times over time`}
          >
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y(t)}
                  y2={y(t)}
                  className="stroke-slate-200 dark:stroke-slate-700"
                  strokeDasharray="4 6"
                  strokeWidth="1"
                />
                <text x={PAD.left - 10} y={y(t) + 4} textAnchor="end" fontSize="13" className="fill-slate-400">
                  {formatDuration(t)}
                </text>
              </g>
            ))}
            <polygon points={area} fill="url(#trend-fill)" />
            <polyline
              points={line}
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.map((p, i) => {
              const isPR = p.race.race_stats.finish_time.epoch === fastest;
              return (
                <g key={p.race.id} className="cursor-pointer" onMouseEnter={() => showTip(p)} onClick={() => showTip(p)}>
                  <circle cx={p.cx} cy={p.cy} r="16" fill="transparent" />
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r={isPR ? 7 : 5}
                    fill={isPR ? '#fbbf24' : '#f97316'}
                    className="stroke-white dark:stroke-slate-900"
                    strokeWidth="2"
                  />
                  {isPR && <text x={p.cx} y={p.cy - 14} textAnchor="middle" fontSize="16">⭐</text>}
                  {yearLabels[i] && (
                    <text x={p.cx} y={H - 12} textAnchor="middle" fontSize="13" className="fill-slate-400">
                      {yearLabels[i]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          {tip && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[115%] rounded-xl bg-slate-900 text-white text-xs px-3 py-2 shadow-xl ring-1 ring-white/10 max-w-[16rem] whitespace-nowrap"
              style={{ left: `${tip.xPct}%`, top: `${tip.yPct}%` }}
            >
              <p className="font-bold pb-0.5">{tip.race.name}</p>
              <p className={`${orbitron.className} text-base text-amber-300`}>
                {formatDuration(tip.race.race_stats.finish_time.epoch)}
              </p>
              <p className="text-slate-300 pt-0.5">
                {formatPace(tip.race.race_stats.finish_time.epoch, raceMiles(tip.race.race_type))} /mi •{' '}
                {new Date(tip.race.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-slate-400 pt-1">
          Higher = faster finish • ⭐ personal record • hover or tap a point for details
        </p>
      </div>
    </div>
  );
}
