import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <Helmet>
        <title>Page not found | Route Posts</title>
      </Helmet>

      <p className="text-8xl font-extrabold text-[#00298d]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">This page isn't available</h1>
      <p className="mt-2 text-slate-500 max-w-md">
        The link may be broken, or the page may have been removed.
      </p>

      <Link
        to="/feed"
        className="mt-6 flex items-center gap-2 bg-[#00298d] hover:bg-[#001f6b] text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        <HiOutlineHome className="text-xl" />
        Go to Feed
      </Link>
    </div>
  );
}