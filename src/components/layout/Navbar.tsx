import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineBars3,
} from "react-icons/hi2";
import { authContext } from "../../context/AuthContext";
import { getUnreadCount } from "../../features/notifications/apis/notifications.api";

export function NavbarCom() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const context = useContext(authContext);

  if (!context) throw new Error("Auth context is not available");

  const { setLogin, setUser, user } = context;

  // ===== Unread count =====
  const { data: countData } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: getUnreadCount,
    enabled: !!user,
    refetchInterval: 30000,
  });
  const unreadCount = countData?.data?.unreadCount ?? 0;

  const isDefaultPhoto = !user?.photo || user.photo.includes("default-profile");
  const avatar = isDefaultPhoto
    ? user?.gender === "female"
      ? "/img/female.png"
      : "/img/male.png"
    : user?.photo;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLogin(null);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  }

  function linkClass(path: string) {
    return `flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${
      pathname === path
        ? "bg-white text-[#00298d] shadow-sm"
        : "text-slate-600 hover:text-slate-900"
    }`;
  }

  return (
    <Navbar fluid className="bg-white! border-b border-slate-200 py-3">
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center">
        {/* اللوجو */}
        <Link to={user ? "/feed" : "/"} className="flex items-center gap-3">
          <img
            src="/imgi_1_route.png"
            className="h-11 w-11 rounded-xl object-cover"
            alt="Route Academy Logo"
          />
          <span className="text-2xl font-extrabold text-slate-900">
            Route Posts
          </span>
        </Link>

        {/* login الأفاتار لو عاملة، Log in لو لأ */}
        <div className="flex items-center gap-2 md:order-2">
          {user ? (
            <>
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <div className="flex items-center gap-3 border border-slate-200 rounded-full py-1.5 pl-1.5 pr-4 hover:bg-slate-50 transition">
                    <img
                      src={avatar}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-semibold text-slate-800 hidden sm:block">
                      {user.name}
                    </span>
                    <HiOutlineBars3 className="text-xl text-slate-500" />
                  </div>
                }
              >
                <DropdownHeader>
                  <span className="block text-sm">{user.name}</span>
                  <span className="block truncate text-sm font-medium">
                    {user.email}
                  </span>
                </DropdownHeader>
                <DropdownItem onClick={() => navigate("/profile")}>
                  Profile
                </DropdownItem>
                <DropdownItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownItem>{" "}
                <DropdownDivider />
                <DropdownItem onClick={handleLogout} className="text-rose-600">
                  Log out
                </DropdownItem>
              </Dropdown>
              <NavbarToggle />
            </>
          ) : (
            <Link
              to="/"
              className="bg-[#00298d] hover:bg-[#001f6b] text-white font-semibold px-5 py-2.5 rounded-full transition"
            >
              Log in
            </Link>
          )}
        </div>

        {/* loginاللينكات: بس لو عاملة  */}
        {user && (
          <NavbarCollapse
            theme={{
              list: "mt-4 flex flex-col gap-1 md:mt-0 md:flex-row bg-slate-50 border border-slate-200 rounded-2xl p-1.5",
            }}
          >
            <Link to="/feed" className={linkClass("/feed")}>
              <HiOutlineHome className="text-2xl" />
              Feed
            </Link>
            <Link to="/profile" className={linkClass("/profile")}>
              <HiOutlineUser className="text-2xl" />
              Profile
            </Link>
            <Link to="/notifications" className={linkClass("/notifications")}>
              <span className="relative">
                <HiOutlineBell className="text-2xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              Notifications
            </Link>
          </NavbarCollapse>
        )}
      </div>
    </Navbar>
  );
}
