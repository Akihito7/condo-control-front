import Image from "next/image";
import { LoginForm } from "./login-form";
import { Building2 } from "lucide-react";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center bg-transparent space-y-2">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
            <Building2 color="white" size={32} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-800">
            Condomínio Inteligente
          </h1>
          <p className="text-md text-muted-foreground">
            Sistema de Gestão de Condomínios
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-muted-foreground">
              Faça login para acessar sua conta
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
