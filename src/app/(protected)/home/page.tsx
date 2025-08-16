"use client";
import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { useUserContext } from "@/providers/use-user-context";
import {
  Building,
  Users,
  ClipboardList,
  Phone,
  Mail,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useUserContext();
  useEffect(() => {
    console.log("HOME USER => ", user);
  }, [user]);
  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-x-auto">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Home"]} />
        </div>
      </div>

      {/* Seção de boas-vindas */}
      <section className="bg-white shadow-sm relative">
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
            <button className="group flex px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition items-center gap-2">
              <ChevronLeft className="w-6 h-6 text-white animate-[bounceLeft_1s_infinite]" />
              Comece agora
            </button>
          </div>
          <div className="flex-1">
            <img
              src="ilustration.svg"
              alt="Condomínio"
              className="drop-shadow-lg"
            />
          </div>
        </div>

        {/* Seta animada para baixo */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
          <ChevronDown className="w-10 h-10 text-blue-600" />
        </div>
      </section>

      {/* Funcionalidades */}
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

      {/* Contato mais atrativo */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            🚀 Vamos transformar sua ideia em realidade!
          </h3>
          <p className="text-lg mb-8">
            Se você tem um projeto ou ideia inovadora, entre em contato e vamos
            conversar sobre como podemos desenvolvê-lo juntos.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <a
              href="tel:13981057505"
              className="flex items-center gap-3 bg-white text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              <Phone className="w-5 h-5" /> (13) 98105-7505
            </a>
            <a
              href="mailto:akihitopro7@gmail.com"
              className="flex items-center gap-3 bg-white text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              <Mail className="w-5 h-5" /> akihitopro7@gmail.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
