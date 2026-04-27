'use client';

import { useEffect } from 'react';
import logger from '@/utils/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our custom logger
    logger.error('Global UI Error:', error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          The application encountered an unexpected error. We have logged the details and are working to fix it.
        </p>
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-[#72B76A] text-white rounded-xl font-bold hover:bg-[#5e9b55] transition shadow-lg shadow-green-100"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
