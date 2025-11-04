import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Oops!</h1>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Sorry, an unexpected error has occurred.
          </h2>
          <p className="text-gray-500 text-lg">
            {error.statusText || error.message || "Something went wrong"}
          </p>
        </div>
        <div>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}
