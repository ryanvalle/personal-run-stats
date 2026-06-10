import Link from 'next/link';

export default function PostCard({ post }) {
  const { slug, title, date, excerpt, tags = [], cover } = post;
  const postDate = date ? new Date(date) : null;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-black/50"
    >
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="aspect-[2/1] w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-4 md:p-5">
        {postDate && (
          <time dateTime={date} className="text-xs text-slate-400">
            {postDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          </time>
        )}
        <h3 className="pt-1.5 text-lg font-medium leading-snug transition-colors group-hover:text-orange-500">
          {title}
        </h3>
        {excerpt && (
          <p className="line-clamp-3 pt-2 text-sm font-light text-slate-500 dark:text-slate-400">
            {excerpt}
          </p>
        )}
        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-widest text-orange-600 dark:text-orange-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
