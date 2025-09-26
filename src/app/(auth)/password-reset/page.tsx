"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { resetPassword } from "@/api/reset-password";
import { useRouter } from "next/navigation";

type FormValues = {
  password: string;
  confirmPassword: string;
};

export default function PasswordReset() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const password = watch("password");

  const onSubmit = async (data: FormValues) => {
    if (code.length < 6) {
      alert("Digite o código completo de 6 dígitos");
      return;
    }
    await resetPassword({ code, password: data.password });
    setSubmitted(true);
    router.push("/signin");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Senha redefinida com sucesso!
          </h2>
          <p className="text-gray-600">
            Você já pode fazer login com sua nova senha.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
            <Lock color="white" size={32} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            Redefinir Senha
          </h1>
          <p className="text-sm text-gray-500">
            Digite o código que você recebeu e defina sua nova senha
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Código OTP */}
            <div className="flex flex-col items-center justify-center">
              <Label
                htmlFor="code"
                className="text-lg font-medium text-gray-700"
              >
                Código
              </Label>

              <InputOTP value={code} onChange={setCode} maxLength={6}>
                <InputOTPGroup className="mt-2 flex justify-between gap-2">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-10 h-12 text-center border rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Nova senha */}
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Nova senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua nova senha"
                {...register("password", {
                  required: "A senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter ao menos 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar senha */}
            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirmar senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                {...register("confirmPassword", {
                  required: "Confirme sua senha",
                  validate: (value) =>
                    value === password || "As senhas não coincidem",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700"
            >
              Redefinir senha
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
