"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { setCookies } from "@/actions/cookies";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    try {
      const { status, data: responseData } = await api.post("/auth/signin", {
        email: data.email,
        password: data.password,
      });

      if (status === 201) {
        await setCookies({
          key: "@smartCondo:token",
          value: responseData.token,
          options: {
            secure: true,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 dia
          },
        });

        router.push("/home");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          E-mail ou Usuário
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-4 text-gray-400">
            <User size={16} />
          </span>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu e-mail ou usuário"
            className="pl-10 h-12"
            {...register("email", { required: "E-mail é obrigatório" })}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">
          Senha
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-4 text-gray-400">
            <Lock size={16} />
          </span>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            className="pl-10 pr-10 h-12"
            {...register("password", { required: "Senha é obrigatória" })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-4 text-gray-400"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember" className="text-gray-700">
            Lembrar-me
          </Label>
        </div>
        <Link
          href="forget-password"
          className="text-sm text-blue-600 font-semibold hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
