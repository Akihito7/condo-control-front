"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { forgetPassword } from "@/api/forget-email";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgetPassword({ email });
    router.push("/password-reset");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
            <Mail color="white" size={32} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-800">
            Redefinir Senha
          </h1>
          <p className="text-md text-muted-foreground">
            Digite seu email para receber o link de redefinição
          </p>
        </div>

        {/* Card do formulário */}
        <div className="rounded-lg bg-white p-6 shadow-lg space-y-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Enviar Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
