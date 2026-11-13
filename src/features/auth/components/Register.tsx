import { Button, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IoPersonOutline,
  IoKeyOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { useState } from "react";
import { ImSpinner } from "react-icons/im";
import { toast } from "react-toastify";
import {
  RegisterSchemaObject,
  type RegisterSchema,
} from "../schemas/register(zod)";
import { signUp } from "../apis/signup.api";
import { inputTheme, selectTheme } from "../../../components/ui/themes";

export default function Register() {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(RegisterSchemaObject),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
    },
  });
  async function handleRegister(data: RegisterSchema) {
    setLoading(true);
    try {
      const res = await signUp(data);
      if (res?.success) {
        toast.success(res?.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">
        Create a new account
      </h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">It is quick and easy.</p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col gap-4"
      >
        <div>
          <TextInput
            {...register("name")}
            theme={inputTheme}
            sizing="md"
            icon={IoPersonOutline}
            type="text"
            placeholder="Full name"
          />
          {errors.name && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <TextInput
            {...register("username")}
            theme={inputTheme}
            sizing="md"
            icon={MdAlternateEmail}
            type="text"
            placeholder="Username (optional)"
          />
          {errors.username && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <TextInput
            {...register("email")}
            theme={inputTheme}
            sizing="md"
            icon={MdAlternateEmail}
            type="email"
            placeholder="Email address"
          />
          {errors.email && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <Select
            {...register("gender")}
            theme={selectTheme}
            sizing="md"
            icon={HiOutlineUsers}
            defaultValue=""
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </Select>
          {errors.gender && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.gender.message}
            </span>
          )}
        </div>

        <div>
          <TextInput
            {...register("dateOfBirth")}
            theme={inputTheme}
            sizing="md"
            icon={IoCalendarOutline}
            type="date"
          />
          {errors.dateOfBirth && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.dateOfBirth.message}
            </span>
          )}
        </div>

        <div>
          <TextInput
            {...register("password")}
            theme={inputTheme}
            sizing="md"
            icon={IoKeyOutline}
            type="password"
            placeholder="Password"
          />
          {errors.password && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <TextInput
            {...register("rePassword")}
            theme={inputTheme}
            sizing="md"
            icon={IoKeyOutline}
            type="password"
            placeholder="Confirm password"
          />
          {errors.rePassword && (
            <span className="block mt-1 text-sm text-rose-600">
              {errors.rePassword.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          size="md"
          className="w-full cursor-pointer rounded-xl text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b] focus:ring-0"
        >
          {isLoading ? (
            <ImSpinner className="animate-spin" />
          ) : (
            "Create New Account"
          )}
        </Button>
      </form>
    </>
  );
}
