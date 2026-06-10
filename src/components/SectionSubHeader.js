export default function SectionSubHeader({ text }) {
  return (
    <div className="flex items-center gap-3 pt-8 pb-1">
      <h3 className="text-base md:text-lg font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {text}
      </h3>
      <span className="flex-1 border-t border-dashed border-slate-200 dark:border-slate-800" aria-hidden="true" />
    </div>
  );
}
