"use client";

import {
  ChevronUp,
  ChevronDown,
  LayoutDashboard,
  Users,
  Building,
  Settings,
  FileText,
  FileBarChart,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const [showFinanceSubmenu, setShowFinanceSubmenu] = useState(true);

  return (
    <aside className="w-80 min-h-screen bg-white border-r border-gray-200 flex flex-col font-sans text-sm text-gray-800">
      {/* Topo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold tracking-tight">CondoControl</h1>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {/* Finanças */}
        <div>
          <button
            onClick={() => setShowFinanceSubmenu((prev) => !prev)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            <span className="flex items-center">
              <LayoutDashboard className="w-5 h-5" />
              <span className="ml-3 text-lg">Finanças</span>
            </span>
            {showFinanceSubmenu ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showFinanceSubmenu && (
            <div className="ml-7 mt-2 space-y-1">
              <a
                href="transaction-entry"
                className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <FileText className="w-4 h-4" />
                <span className="ml-2">Lançamento de registros</span>
              </a>
              <a
                href="delinquency-control"
                className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <FileBarChart className="w-4 h-4" />
                <span className="ml-2">Gestão de Inadimplência</span>
              </a>
              <a
                href="projection"
                className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <DollarSign className="w-4 h-4" />
                <span className="ml-2">Previsões financeiras</span>
              </a>
            </div>
          )}
        </div>

        {/* Usuários */}
        <a
          href="#usuarios"
          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
        >
          <Users className="w-5 h-5" />
          <span className="ml-3">Usuários</span>
        </a>

        {/* Condomínios */}
        <a
          href="#condominios"
          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
        >
          <Building className="w-5 h-5" />
          <span className="ml-3">Condomínios</span>
        </a>

        {/* Configurações */}
        <a
          href="#configuracoes"
          className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
        >
          <Settings className="w-5 h-5" />
          <span className="ml-3">Configurações</span>
        </a>
      </nav>

      {/* Rodapé com usuário */}
      <div className="p-4 border-t border-gray-200 hover:bg-gray-50 transition">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-700 font-semibold">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>

          <ChevronUp className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </aside>
  );
}
