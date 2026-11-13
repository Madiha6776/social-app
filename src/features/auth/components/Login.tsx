import { Button, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoPersonOutline, IoKeyOutline } from "react-icons/io5";
import { ImSpinner } from "react-icons/im";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginScheme, type LoginSchemeType } from "../schemas/login.scheme";
import { SignIn } from "../apis/signin.api";
import { inputTheme } from "../../../components/ui/themes";
import { authContext } from "../../../context/AuthContext";
import { getProfile } from "../apis/getProfile.api";

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const context = useContext(authContext);

  if (!context) throw new Error("Auth context is not available");

  const { setLogin, setUser } = context;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemeType>({
    resolver: zodResolver(LoginScheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginSchemeType) {
    setLoading(true);
    try {
      const res = await SignIn(data);
      if (res?.success){ 
         localStorage.setItem("token", res.data.token);
      
        const profile = await getProfile(res.data.token);
        localStorage.setItem("user", JSON.stringify(profile.data.user));

        setLogin(res?.data?.token);
        setUser(profile.data.user); 
        toast.success(res?.message);
        navigate("/feed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900">
        Log in to Route Posts
      </h2>
      <p className="text-sm text-slate-500 mt-1 mb-6">
        Log in and continue your social journey.
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col gap-4"
      >
        <div>
          <TextInput
            {...register("email")}
            theme={inputTheme}
            sizing="md"
            icon={IoPersonOutline}
            id="email"
            type="text"
            placeholder="Email or username"
          />
          {errors.email && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <TextInput
            {...register("password")}
            theme={inputTheme}
            sizing="md"
            icon={IoKeyOutline}
            id="password"
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.password.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          size="md"
          className="w-full cursor-pointer rounded-xl text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b] focus:ring-0"
        >
          {isLoading ? <ImSpinner className="animate-spin" /> : "Log In"}
        </Button>

        <button
          type="button"
          onClick={() => toast.info("This feature is coming soon")}
          className="text-sm text-[#00298d] font-medium hover:underline cursor-pointer"
        >
          Forgot password?
        </button>
      </form>
    </>
  );
}
