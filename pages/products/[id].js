import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useShoppingCart } from '@/hooks/use-shopping-cart';
import Image from 'next/image';
import Head from 'next/head';
import { formatCurrency } from '@/lib/utils';
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/outline';

import products from 'products';

const Product = props => {
  const router = useRouter();
  const { cartCount, addItem } = useShoppingCart();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const toastId = useRef();
  const firstRun = useRef(true);

  const handleOnAddToCart = () => {
    setAdding(true);
    toastId.current = toast.loading(
      `Adding ${qty} item${qty > 1 ? 's' : ''}...`
    );
    addItem(props, qty);
  };

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    setAdding(false);
    toast.success(`${qty} ${props.name} added`, {
      id: toastId.current,
    });
    setQty(1);
  }, [cartCount]);

  return router.isFallback ? (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <p className="py-12 text-lg text-center">Loading...</p>
    </>
  ) : (
    <>
      <Head>
        <title>{props.name} | AlterClass</title>
      </Head>
      <div className="container px-6 py-12 mx-auto lg:max-w-screen-lg">
        <div className="flex flex-col items-center justify-between space-y-8 md:flex-row md:space-y-0 md:space-x-12">
          {/* Product's image */}
          <div>
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <Image
                src={props.image}
                alt={props.name}
                layout="fill"
                objectFit="contain"
              />
            </div>
            {props.description ?? (
              <p className='py-5' dangerouslySetInnerHTML={{ __html: props.description }}></p>
            )
            }
          </div>


          {/* Product's details */}
          <div className="flex-1 max-w-md p-6 border border-opacity-50 rounded-md shadow-lg">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              <Image src={props.category} layout="fill" objectFit="contain" />
            </div>
            <h2 className="text-3xl font-semibold">{props.name}</h2>
            <p>
              <span className="text-gray-500">Availability:</span>{' '}
              <span className="font-semibold">In stock</span>
            </p>

            {/* Price */}
            <div className="pt-4 mt-8 border-t">
              <p className="text-gray-500">Price:</p>
              <p className="text-xl font-semibold">
                {formatCurrency(props.price)}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t">
              {/* Quantity */}
              <p className="text-gray-500">Quantity:</p>
              <div className="flex items-center mt-1 space-x-3">
                <button
                  onClick={() => setQty(prev => prev - 1)}
                  disabled={qty <= 1}
                  className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current hover:bg-rose-100 hover:text-rose-500"
                >
                  <MinusSmIcon className="flex-shrink-0 w-6 h-6" />
                </button>
                <p className="text-xl font-semibold">{qty}</p>
                <button
                  onClick={() => setQty(prev => prev + 1)}
                  className="p-1 rounded-md hover:bg-green-100 hover:text-green-500"
                >
                  <PlusSmIcon className="flex-shrink-0 w-6 h-6 " />
                </button>
              </div>

              {/* Add to cart button */}
              <button
                type="button"
                onClick={handleOnAddToCart}
                disabled={adding}
                className="px-6 py-2 mt-8 text-white transition-colors border rounded bg-rose-500 hover:bg-rose-600 border-rose-500 hover:border-rose-600 focus:ring-4 focus:ring-opacity-50 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to cart ({qty})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  return {
    // Existing posts are rendered to HTML at build time
    paths: Object.keys(products)?.map(id => ({
      params: { id },
    })),
    // Enable statically generating additional pages
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  try {
    const props = products?.find(product => product.id === params.id) ?? {};

    return {
      props,
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every second
      revalidate: 1, // In seconds
    };
  } catch (error) {
    return { notFound: true };
  }
}

export default Product;
