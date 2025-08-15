"use client";
import { useQuery } from "@tanstack/react-query";
import { Building, Users, Bell, ClipboardList } from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-x-auto">
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Bem-vindo ao{" "}
              <span className="text-blue-600">Portal do Condomínio</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Gerencie seu condomínio de forma prática, rápida e eficiente.
              Acesse informações, registre eventos e acompanhe tudo em tempo
              real.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
              Começar agora
            </button>
          </div>
          <div className="flex-1">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
              alt="Condomínio"
              width={450}
              height={450}
              className="drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Principais Funcionalidades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <Building className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gestão de Áreas</h3>
            <p className="text-gray-600">
              Reserve áreas comuns como salão de festas, churrasqueira e piscina
              com facilidade.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <Users className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comunicação</h3>
            <p className="text-gray-600">
              Envie avisos, mensagens e atualizações importantes para todos os
              moradores.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <ClipboardList className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Controle de Visitas</h3>
            <p className="text-gray-600">
              Registre e monitore visitantes e prestadores de serviço de forma
              segura.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <Bell className="w-20 h-20 text-blue-600" />
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Receba notificações instantâneas
            </h3>
            <p className="text-gray-600">
              Fique por dentro de tudo que acontece no condomínio com alertas e
              lembretes em tempo real.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
