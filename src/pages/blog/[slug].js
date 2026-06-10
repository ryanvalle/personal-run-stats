import Link from 'next/link';
import { Roboto } from 'next/font/google';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import readingTime from 'reading-time';
import MetaHead from '@/components/MetaHead.js';
import Footer from '@/components/Footer.js';
import { getPostBySlug, logBlogError } from '@/helpers/blog';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700']
});

export default function BlogPost({ post }) {
  const { title, date, excerpt, tags, cover, content } = post;
  const postDate = date ? new Date(date) : null;
  const stats = readingTime(content || '');

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${roboto.className}`}>
      <MetaHead data={{ primary: title, secondary: excerpt }} image={cover} />
      <article className="max-w-3xl w-[90%] mx-auto pb-16 pt-10 md:pt-14">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-orange-500">
          <span aria-hidden="true">←</span> All posts
        </Link>

        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="mt-6 aspect-[2/1] w-full rounded-2xl object-cover" />
        )}

        <h1 className="pt-6 text-3xl font-medium tracking-tight md:text-5xl">{title}</h1>

        <div className="flex flex-wrap items-center gap-3 pt-3 text-sm text-slate-500 dark:text-slate-400">
          {postDate && (
            <time dateTime={date}>
              {postDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          )}
          <span aria-hidden="true">•</span>
          <span>{stats.text}</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-widest text-orange-600 dark:text-orange-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-slate dark:prose-invert prose-a:text-orange-500 prose-headings:font-medium max-w-none pt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
      <Footer />
    </main>
  );
}

export async function getServerSideProps(ctx) {
  let post = null;

  try {
    post = await getPostBySlug(ctx.params.slug);
  } catch (error) {
    logBlogError(`getPostBySlug(${ctx.params.slug})`, error);
  }

  if (!post) {
    return { notFound: true };
  }

  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate'
  );

  return {
    props: { post }
  };
}
