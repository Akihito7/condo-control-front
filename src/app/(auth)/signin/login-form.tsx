"use client";

import { setCookies } from "@/actions/cookies";
import { Button } from "@/components/button";
import { CustomInput } from "@/components/input";
import { api } from "@/services/api";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  async function login(data: LoginFormData) {
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
            maxAge: 60 * 60 * 24,
          },
        });

        router.push("finance/transaction-entry");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(login)} className="space-y-4" noValidate>
      <CustomInput.Root>
        <CustomInput.Input
          placeholder="Email"
          type="email"
          {...register("email", { required: "Email é obrigatório" })}
        />
        <CustomInput.Icon>
          <User size={18} />
        </CustomInput.Icon>
      </CustomInput.Root>
      {errors.email && (
        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
      )}

      <CustomInput.Root>
        <CustomInput.Input
          type="password"
          placeholder="Senha"
          {...register("password", { required: "Senha é obrigatória" })}
        />
        <CustomInput.Icon>
          <Lock size={18} />
        </CustomInput.Icon>
      </CustomInput.Root>
      {errors.password && (
        <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Iniciar sessão"}
      </Button>
    </form>
  );
}
