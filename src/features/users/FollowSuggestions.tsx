import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getSuggestions } from "./apis/users.api";
import { getAvatar } from "../../utilitis/get-avatar";
import type { Suggestion } from "../../interfaces/suggestion.interface";
import FollowButton from "./FollowButton";

export default function FollowSuggestions() {
  const { data, isLoading } = useQuery({
    queryKey: ["suggestions"],
    queryFn: getSuggestions,
  });

  const suggestions: Suggestion[] = data?.data?.suggestions ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-6 overflow-hidden">
      <h2 className="px-5 pt-5 pb-3 font-bold text-slate-900">People you may know</h2>

      {isLoading ? (
        <p className="px-5 pb-5 text-sm text-slate-400">Loading...</p>
      ) : suggestions.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-slate-400">No suggestions right now</p>
      ) : (
        <ul className="pb-2">
          {suggestions.map((user) => (
            <li
              key={user._id}
              className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition"
            >
              <Link to={`/profile/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={getAvatar(user)}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate hover:underline">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.followersCount} followers
                  </p>
                </div>
              </Link>
              <FollowButton userId={user._id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}