"use client";

import { deleteCookies } from "@/actions/cookies";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await deleteCookies("@smartCondo:token");

      setTimeout(() => {
        router.replace("/signin");
      }, 1500);
    }

    logout();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white px-10 py-12 shadow-lg border border-slate-200">
        
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"></div>

        {/* Textos */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-semibold text-slate-800">
            Encerrando sua sessão
          </h1>

          <p className="text-sm text-slate-500 max-w-xs">
            Estamos finalizando seu acesso com segurança ao Condo Control.
          </p>

          <p className="text-xs text-slate-400">
            Você será redirecionado em instantes...
          </p>
        </div>
      </div>
    </div>
  );
}
