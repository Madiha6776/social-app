import { useState } from "react";
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import { Helmet } from "react-helmet-async";

const stats = [
  { number: "2012", label: "Founded" },
  { number: "40K+", label: "Graduates" },
  { number: "50+", label: "Partner Companies" },
  { number: "5", label: "Branches" },
  { number: "20", label: "Diplomas Available" },
];

export default function Home() {
  const [active, setActive] = useState(true);

  return (
    <div className="bg-[#f0f2f5] min-h-screen px-4">
      <Helmet>
        <title>Login | Route Posts</title>
        <meta
          name="description"
          content="Sign in to Route Posts and connect with your friends"
        />
      </Helmet>
      <div className="flex flex-wrap max-w-6xl mx-auto min-h-screen justify-between items-center py-10">
        {/* ========== Left ========== */}
        <div className="md:w-[50%] w-full">
          <h1 className="hidden text-5xl font-extrabold tracking-tight text-[#00298d] sm:text-6xl lg:block">
            Route Posts
          </h1>
          <p className="hidden mt-4 text-2xl font-medium leading-snug text-slate-800 lg:block">
            Connect with friends and the world around you on Route Posts.
          </p>

          <div className="border my-10 shadow-sm bg-white/80 rounded-2xl p-6 border-[#dbe3f5]">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#00298d]">
              About Route Academy
            </p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              Egypt's Leading IT Training Center Since 2012
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Route Academy is the premier IT training center in Egypt,
              established in 2012. We specialize in delivering high-quality
              training courses in programming, web development, and application
              development. We've identified the unique challenges people may
              face when learning new technology and made efforts to provide
              strategies to overcome them.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#c9d5ff] bg-[#f2f6ff] px-3 py-2"
                >
                  <p className="text-base font-extrabold text-[#00298d]">
                    {item.number}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== Right ========== */}
        <div className="md:w-[40%] w-full max-w-md">
          <div className="shadow-sm bg-white rounded-2xl p-6">
            {/* Tabs */}
            <div className="flex text-center items-center font-bold bg-[#f0f2f5] p-1 rounded-xl">
              <div className="w-1/2 cursor-pointer">
                <span
                  onClick={() => setActive(true)}
                  className={`block py-2 rounded-lg ${active ? "bg-white shadow text-[#00298d]" : "text-slate-600"}`}
                >
                  Login
                </span>
              </div>
              <div className="w-1/2 cursor-pointer">
                <span
                  onClick={() => setActive(false)}
                  className={`block py-2 rounded-lg ${!active ? "bg-white shadow text-[#00298d]" : "text-slate-600"}`}
                >
                  Register
                </span>
              </div>
            </div>

            <div className="mt-6">
              {active ? <Login></Login> : <Register></Register>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
