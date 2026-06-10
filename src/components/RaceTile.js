import { Orbitron } from 'next/font/google';
import { TYPE_LABELS, formatPace, raceMiles } from '../helpers/race';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['800']
});

const TYPE_STYLES = {
  marathon: {
    bar: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/30'
  },
  half: {
    bar: 'from-sky-500 to-blue-600',
    badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 ring-sky-500/30'
  },
  tenk: {
    bar: 'from-violet-500 to-purple-600',
    badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 ring-violet-500/30'
  },
  fivek: {
    bar: 'from-emerald-500 to-green-600',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/30'
  },
  default: {
    bar: 'from-slate-400 to-slate-600',
    badge: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 ring-slate-500/30'
  }
};

export default function RaceTile({ data = {}, isPR = false }) {
  const style = TYPE_STYLES[data.race_type] || TYPE_STYLES.default;
  const finishTime = data.race_stats.finish_time;
  const finished = finishTime.epoch > 0;
  const pace = formatPace(finishTime.epoch, raceMiles(data.race_type));
  const raceDate = new Date(data.date);
  const daysUntil = Math.ceil((raceDate - new Date()) / 86400000);

  const links = [
    finished && data.race_stats.results_url && { href: data.race_stats.results_url, label: 'Official results ↗' },
    data.event_url && { href: data.event_url, label: `${data.event_url_text || 'Event site'} ↗` },
    data.recap_video && { href: data.recap_video, label: '📼 Recap video' }
  ].filter(Boolean);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-black/50">
      <div className={`h-1.5 bg-gradient-to-r ${style.bar}`} aria-hidden="true" />
      <div className="flex flex-col flex-1 p-4 md:p-5">
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-widest ring-1 ${style.badge}`}>
            {TYPE_LABELS[data.race_type] || data.distance_string}
          </span>
          <time className="text-xs text-slate-400 whitespace-nowrap pt-0.5">
            {raceDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          </time>
        </div>
        <h3 className="pt-2.5 text-lg font-medium leading-snug">
          {isPR && <span title="Personal record">🏆 </span>}
          {data.name}
        </h3>
        <p className="pt-1 text-sm font-light text-slate-500 dark:text-slate-400">
          📍 {data.location.city}{data.location.state && `, ${data.location.state}`} • {data.distance_string}
        </p>

        {finished ? (
          <dl className="grid grid-cols-3 gap-2 pt-4 text-center">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 py-2">
              <dd className={`${orbitron.className} text-base md:text-lg`}>
                {finishTime.hour}:{finishTime.minutes}:{finishTime.sec}
              </dd>
              <dt className="text-[0.6rem] uppercase tracking-widest text-slate-400 pt-0.5">finish</dt>
            </div>
            {pace && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 py-2">
                <dd className={`${orbitron.className} text-base md:text-lg`}>{pace}</dd>
                <dt className="text-[0.6rem] uppercase tracking-widest text-slate-400 pt-0.5">min/mi</dt>
              </div>
            )}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 py-2">
              <dd className={`${orbitron.className} text-base md:text-lg`}>{data.race_stats.bib || 'virtual'}</dd>
              <dt className="text-[0.6rem] uppercase tracking-widest text-slate-400 pt-0.5">bib</dt>
            </div>
          </dl>
        ) : daysUntil > 0 && (
          <p className="pt-4">
            <span className="inline-flex items-center gap-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-2 text-sm font-medium">
              ⏳ {daysUntil} day{daysUntil === 1 ? '' : 's'} to go
            </span>
          </p>
        )}

        {links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
