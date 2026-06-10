export default function SectionHeader({ text, emoji }) {
  return (
    <div className="flex items-center gap-3 pt-14 pb-2 text-slate-900 dark:text-white">
      <span className="h-7 w-1.5 rounded-full bg-gradient-to-b from-orange-500 to-amber-400" aria-hidden="true" />
      <h2 className="text-2xl md:text-3xl font-medium tracking-tight whitespace-nowrap">
        {emoji && <span className="pr-1" aria-hidden="true">{emoji}</span>}
        {text}
      </h2>
      <span className="hidden sm:block flex-1 border-t border-dashed border-slate-300 dark:border-slate-700" aria-hidden="true" />
    </div>
  );
}
