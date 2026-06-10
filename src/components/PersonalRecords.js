import { useMemo, useState } from 'react';
import { Orbitron } from 'next/font/google';
import SectionSubHeader from './SectionSubHeader';
import { TYPE_LABELS, raceMiles, formatPace } from '../helpers/race';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['800']
});

const RANGES = [
  { key: 'all', label: 'All Time' },
  { key: 'ytd', label: 'Year to Date' },
  { key: '2y', label: 'Last 2 Years', years: 2 },
  { key: '5y', label: 'Last 5 Years', years: 5 }
];

function rangeStart(range) {
  const now = new Date();
  if (range.key === 'ytd') return new Date(now.getFullYear(), 0, 1);
  if (range.years) {
    const start = new Date(now);
    start.setFullYear(start.getFullYear() - range.years);
    return start;
  }
  return null;
}

// Fastest finish per distance, filterable by time range (skips races without a recorded time)
export default function PersonalRecords({ races }) {
  const [range, setRange] = useState('all');

  const records = useMemo(() => {
    const start = rangeStart(RANGES.find((r) => r.key === range));
    const eligible = races.filter((race) =>
      race.race_stats.finish_time.epoch > 0 && (!start || new Date(race.date) >= start)
    );
    return Object.keys(TYPE_LABELS).map((type) =>
      eligible
        .filter((race) => race.race_type === type)
        .sort((a, b) => a.race_stats.finish_time.epoch - b.race_stats.finish_time.epoch)[0]
    ).filter(Boolean);
  }, [races, range]);

  if (!races.some((race) => race.race_stats.finish_time.epoch > 0)) return null;

  return (
    <>
      <SectionSubHeader text="Personal Records" />
      <div className="flex flex-wrap gap-2 pt-3" role="tablist" aria-label="filter records by time range">
        {RANGES.map((r) => (
          <button
            key={r.key}
            role="tab"
            aria-selected={range === r.key}
            onClick={() => setRange(r.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              range === r.key
                ? 'bg-orange-500 text-white shadow'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-400'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      {records.length > 0 ? (
        <ul className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 pt-3">
          {records.map((record) => {
            const finishTime = record.race_stats.finish_time;
            const raceDate = new Date(record.date);
            return (
              <li
                key={record.id}
                className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-50 to-white dark:from-amber-500/10 dark:to-slate-900 p-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="absolute right-3 top-3 text-2xl" aria-hidden="true">🏆</span>
                <span className="uppercase text-xs tracking-widest text-amber-600 dark:text-amber-400 font-medium">
                  {TYPE_LABELS[record.race_type] || record.distance_string}
                </span>
                <div className={`${orbitron.className} text-3xl pt-1`}>
                  {finishTime.hour}:{finishTime.minutes}:{finishTime.sec}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                  {formatPace(finishTime.epoch, raceMiles(record.race_type))} /mi pace
                </p>
                <p className="text-sm font-light italic pt-1">
                  {record.name} • {raceDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400 pt-3">
          No races with recorded finish times in this range.
        </p>
      )}
    </>
  );
}
