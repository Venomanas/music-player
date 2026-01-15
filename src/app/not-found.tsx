/* eslint-disable @next/next/no-html-link-for-pages */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-gray-500">
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="mt-6 rounded bg-black px-6 py-2 text-white hover:bg-gray-800 transition"
      >
        Go Home
      </a>
    </div>
  );
}
