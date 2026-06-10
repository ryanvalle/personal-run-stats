import { Orbitron } from 'next/font/google';
import StatCounter from './StatCounter';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['800']
});

export default function Hero({ stats = {} }) {
  const chips = [
    { label: 'races finished', value: stats.totalRaces, decimals: 0 },
    { label: 'miles raced', value: stats.totalMiles, decimals: 1 },
    { label: 'cities', value: stats.totalCities, decimals: 0 },
    { label: 'years running', value: stats.yearsRunning, decimals: 0 }
  ];

  return (
    <header className="relative overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden="true" />
      <div className="relative max-w-7xl w-[90%] mx-auto pt-14 pb-12 md:pt-20 md:pb-16">
        <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-orange-400 font-medium pb-3">
          est. 2015 • race stats &amp; recaps
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">running</span>
          <span className="font-thin">with</span>
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">ryan</span>
          <span aria-hidden="true"> 🏃‍♂️</span>
        </h1>
        <p className="pt-4 text-slate-400 text-lg md:text-xl font-light max-w-xl">
          Chasing finish lines one start corral at a time — every race, record, and mile along the way.
        </p>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-10">
          {chips.map((chip) => (
            <div
              key={chip.label}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3 transition-colors hover:bg-white/10"
            >
              <dd className={`${orbitron.className} text-2xl md:text-3xl text-amber-300`}>
                <StatCounter value={chip.value || 0} decimals={chip.decimals} />
              </dd>
              <dt className="uppercase text-[0.65rem] tracking-widest text-slate-400 pt-1">{chip.label}</dt>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative h-10 border-t border-dashed border-white/20" aria-hidden="true">
        <span className="runner absolute top-1 text-2xl">🏃‍♂️</span>
      </div>
    </header>
  );
}
