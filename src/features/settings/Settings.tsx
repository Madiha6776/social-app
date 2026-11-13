import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2";
import { changePassword } from "./apis/changePassword.api";
import {
  changePasswordScheme,
  type ChangePasswordSchemeType,
} from "../auth/schemas/changePassword.schema";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const context = useContext(authContext);
  if (!context) throw new Error();
  const { setLogin, setUser } = context;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchemeType>({
    resolver: zodResolver(changePasswordScheme),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      if (data?.data?.token) {
        // السيرفر رجع توكن جديد > نحفظه ونكمّل عادي
        localStorage.setItem("token", data.data.token);
        setLogin(data.data.token);
        toast.success("Password changed successfully");
        reset();
      } else {
        // loginمفيش توكن جديد > القديم بطل > لازم
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLogin(null);
        setUser(null);
        toast.success("Password changed, please log in again");
        navigate("/");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  function handleChangePassword(data: ChangePasswordSchemeType) {
    mutate({ password: data.password, newPassword: data.newPassword });
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <Helmet>
        <title>Settings | Route Posts</title>
      </Helmet>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* الهيدر */}
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-blue-50 text-[#00298d] p-3 rounded-xl">
            <HiOutlineLockClosed className="text-2xl" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Change password
            </h1>
            <p className="text-sm text-slate-500">
              Use a strong password you don't use elsewhere
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="flex flex-col gap-4"
        >
          {/* الباسورد القديم */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Current password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter current password"
              {...register("password")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none placeholder:text-slate-400 focus:bg-white focus:border-[#00298d] focus:ring-2 focus:ring-blue-100"
            />
            {errors.password && (
              <p className="text-sm text-rose-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* الباسورد الجديد */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              New password
            </label>
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              {...register("newPassword")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none placeholder:text-slate-400 focus:bg-white focus:border-[#00298d] focus:ring-2 focus:ring-blue-100"
            />
            {errors.newPassword && (
              <p className="text-sm text-rose-600 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* تأكيد الباسورد */}
          <div>
            <label
              htmlFor="rePassword"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Confirm new password
            </label>
            <input
              id="rePassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              {...register("rePassword")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none placeholder:text-slate-400 focus:bg-white focus:border-[#00298d] focus:ring-2 focus:ring-blue-100"
            />
            {errors.rePassword && (
              <p className="text-sm text-rose-600 mt-1">
                {errors.rePassword.message}
              </p>
            )}
          </div>

          {/* إظهار الباسورد */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 w-fit cursor-pointer"
          >
            {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
            {showPassword ? "Hide passwords" : "Show passwords"}
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 bg-[#00298d] hover:bg-[#001f6b] text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Saving..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
