import Link from 'next/link';

const Logo = () => (
  <Link href="/">
    <a className="flex items-center space-x-2">
      <span className="hidden text-3xl font-extrabold text-gray-700 sm:inline-block">
        ☕ Coffee Co.
      </span>
    </a>
  </Link>
);

export default Logo;
