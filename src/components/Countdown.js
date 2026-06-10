import { useEffect, useState } from 'react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['800']
});

// Live ticking countdown to race day. Renders placeholders until mounted to
// keep server and client markup identical.
export default function Countdown({ date }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(date).getTime();
  const diff = now === null ? null : Math.max(target - now, 0);
  const units = diff === null
    ? [['days', '--'], ['hrs', '--'], ['min', '--'], ['sec', '--']]
    : [
        ['days', Math.floor(diff / 86400000)],
        ['hrs', Math.floor(diff / 3600000) % 24],
        ['min', Math.floor(diff / 60000) % 60],
        ['sec', Math.floor(diff / 1000) % 60]
      ].map(([label, v]) => [label, String(v).padStart(2, '0')]);

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3" role="timer" aria-label="countdown to race day">
      {units.map(([label, value]) => (
        <div key={label} className="rounded-xl bg-white/10 ring-1 ring-white/15 px-1 py-3 text-center backdrop-blur">
          <div className={`${orbitron.className} text-2xl md:text-4xl text-amber-300`}>{value}</div>
          <div className="uppercase text-[0.6rem] md:text-xs tracking-widest text-slate-400 pt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}
