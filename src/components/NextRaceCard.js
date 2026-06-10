import Countdown from './Countdown';
import { TYPE_LABELS } from '../helpers/race';

export default function NextRaceCard({ race }) {
  const raceDate = new Date(race.date);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 md:p-10 mt-3">
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-500/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-flex rounded-full bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/40 px-3 py-1 text-xs font-medium uppercase tracking-widest">
            {TYPE_LABELS[race.race_type] || 'Race'} • {race.distance_string}
          </span>
          <h3 className="pt-4 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{race.name}</h3>
          <p className="pt-3 text-slate-300 font-light md:text-lg">
            📍 {race.location.city}{race.location.state && `, ${race.location.state}`}
            <span className="px-2 text-slate-600">|</span>
            📅 {raceDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
          {race.event_url && (
            <a
              href={race.event_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/25 transition-transform hover:scale-105"
            >
              {race.event_url_text || 'Event details'} →
            </a>
          )}
        </div>
        <div>
          <p className="pb-3 text-center uppercase text-xs tracking-[0.3em] text-slate-400">race day countdown</p>
          <Countdown date={race.date} />
        </div>
      </div>
    </section>
  );
}
