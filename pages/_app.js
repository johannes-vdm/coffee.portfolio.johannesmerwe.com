import 'tailwindcss/tailwind.css';
import Head from 'next/head';
import { CartProvider } from '@/hooks/use-shopping-cart';
import { Header } from '@/components/index';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>
          E-commerce store built with Next.js and Stripe checkout | AlterClass
        </title>
        <meta
          name="description"
          content="E-commerce store built with Next.js and Stripe checkout by AlterClass.io"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
        </div>
      </CartProvider>
      <Toaster />
    </>
  );
}

export default MyApp;
