import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { trpc } from '../trpc/react';
import { env } from '../env';

export function Hero() {
  const [count, setCount] = useState(0);
  const [params] = useSearchParams();
  const greeting = trpc.hello.useQuery();

  return (
    <div className="overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-24 lg:gap-y-20">
        <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
          <h1 className="text-4xl font-medium tracking-tight text-gray-900">
            Hello {params.get('name') ?? 'world'}!
          </h1>
          <p className="mt-6 text-lg text-gray-600">Count: {count}</p>
          <p className="mt-6 text-lg text-gray-600">{greeting.data}</p>
          <p className="mt-6 text-lg text-gray-600">
            thing: {env.VITE_APP_URL}
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="mt-4 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Increment
          </button>
          <Link
            to="/about"
            className="mt-4 rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            about
          </Link>
        </div>
        <div className="relative flex items-center justify-center pt-24 lg:col-span-5"></div>
      </div>
    </div>
  );
}
