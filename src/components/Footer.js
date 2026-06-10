import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-dashed border-slate-300 dark:border-slate-800 py-8 text-center text-sm text-slate-500">
      <Link href="/" className="transition-colors hover:text-orange-500">
        <span className="font-medium">running</span>with<span className="font-medium">ryan</span> 🏃‍♂️ • est. 2015
      </Link>
      <span className="px-2" aria-hidden="true">•</span>
      <Link href="/blog" className="underline-offset-4 transition-colors hover:text-orange-500 hover:underline">
        blog
      </Link>
    </footer>
  );
}
