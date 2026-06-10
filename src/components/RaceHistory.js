import { useMemo, useState } from 'react';
import RaceTile from './RaceTile';
import { TYPE_LABELS } from '../helpers/race';

// Filterable race archive, grouped by year (expects races sorted newest first)
export default function RaceHistory({ races, prIds = [] }) {
  const [filter, setFilter] = useState('all');

  const counts = useMemo(() => races.reduce((acc, r) => {
    acc[r.race_type] = (acc[r.race_type] || 0) + 1;
    return acc;
  }, {}), [races]);

  const known = Object.keys(TYPE_LABELS).filter((t) => counts[t]);
  const otherCount = races.filter((r) => !TYPE_LABELS[r.race_type]).length;
  const filters = ['all', ...known, ...(otherCount ? ['other'] : [])];

  const filtered = filter === 'all'
    ? races
    : filter === 'other'
      ? races.filter((r) => !TYPE_LABELS[r.race_type])
      : races.filter((r) => r.race_type === filter);

  const byYear = [];
  filtered.forEach((race) => {
    const year = new Date(race.date).getFullYear();
    const bucket = byYear[byYear.length - 1];
    if (bucket && bucket.year === year) bucket.races.push(race);
    else byYear.push({ year, races: [race] });
  });

  const labelFor = (f) => {
    if (f === 'all') return 'All';
    if (f === 'other') return 'Other';
    return TYPE_LABELS[f];
  };
  const countFor = (f) => {
    if (f === 'all') return races.length;
    if (f === 'other') return otherCount;
    return counts[f];
  };

  return (
    <div className="pt-3">
      <div className="flex flex-wrap gap-2 pb-2" role="tablist" aria-label="filter races by distance">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-orange-500 text-white shadow'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-orange-400'
            }`}
          >
            {labelFor(f)} <span className={filter === f ? 'text-orange-100' : 'text-slate-400'}>({countFor(f)})</span>
          </button>
        ))}
      </div>
      {byYear.map(({ year, races: items }) => (
        <section key={year}>
          <div className="flex items-center gap-3 pt-4 pb-3">
            <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500">{year}</h3>
            <span className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-800" aria-hidden="true" />
            <span className="text-xs text-slate-400">{items.length} race{items.length === 1 ? '' : 's'}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {items.map((race) => (
              <RaceTile key={race.id} data={race} isPR={prIds.includes(race.id)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
