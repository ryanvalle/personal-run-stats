import Link from 'next/link';
import { Roboto } from 'next/font/google';
import MetaHead from '@/components/MetaHead.js';
import SectionHeader from '@/components/SectionHeader.js';
import PostCard from '@/components/PostCard.js';
import Footer from '@/components/Footer.js';
import { getPublishedPosts } from '@/helpers/blog';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '500', '700']
});

export default function Blog({ posts }) {
  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${roboto.className}`}>
      <MetaHead data={{ primary: 'Blog', secondary: 'Training notes, race recaps, and everything in between.' }} />
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl w-[90%] mx-auto pt-14 pb-12 md:pt-16 md:pb-12">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-orange-400">
            <span aria-hidden="true">←</span>
            <span><span className="font-medium">running</span>with<span className="font-medium">ryan</span></span>
          </Link>
          <h1 className="pt-4 text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
            Blog
          </h1>
          <p className="pt-3 max-w-xl text-lg font-light text-slate-400 md:text-xl">
            Training notes, race recaps, and everything in between.
          </p>
        </div>
      </header>
      <div className="max-w-7xl w-[90%] mx-auto pb-16">
        <SectionHeader emoji="📝" text="Latest Posts" />
        {posts.length === 0 ? (
          <p className="pt-6 text-slate-500">No posts yet — check back soon.</p>
        ) : (
          <div className="grid gap-4 pt-3 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export async function getServerSideProps(ctx) {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate'
  );

  const posts = await getPublishedPosts();

  return {
    props: { posts }
  };
}
