"use client";
import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { NotificationDropdown } from "@/components/notification";
import { useUserContext } from "@/providers/use-user-context";
import {
  Phone,
  Mail,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

export default function HomePage() {
  const { user } = useUserContext();

  return (
    <main className="bg-gray-50 min-h-screen w-full px-2 sm:px-8 flex flex-col overflow-x-auto">

      {/* Header */}
      <div className="space-y-2 pt-8">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Home"]} />
          <div className="ml-auto">
            <NotificationDropdown />
          </div>
        </div>
      </div>

      {/* Seção de boas-vindas ocupa 100vh */}
      <section className="bg-white shadow-sm relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 w-full">

          {/* Texto */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Bem-vindo ao{" "}
              <span className="text-blue-600">
                Portal do Condomínio
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Gerencie seu condomínio de forma prática, rápida e eficiente.
              Acesse informações, registre eventos e acompanhe tudo em tempo real.
            </p>

            <button className="group flex px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition items-center gap-2">
              <ChevronLeft className="w-6 h-6 text-white animate-[bounceLeft_1s_infinite]" />
              Comece agora
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src={
                user.condominiumLogo
                  ? user.condominiumLogo
                  : "ilustration.svg"
              }
              alt="Condomínio"
              className="drop-shadow-lg max-h-[400px] object-contain"
            />
          </div>

        </div>

        {/* Seta animada */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
          <ChevronDown className="w-10 h-10 text-blue-600" />
        </div>
      </section>

      {/* Seção azul (fica totalmente fora da tela inicial) */}
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
              <Phone className="w-5 h-5" />
              (13) 98105-7505
            </a>

            <a
              href="mailto:akihitopro7@gmail.com"
              className="flex items-center gap-3 bg-white text-blue-700 px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              <Mail className="w-5 h-5" />
              akihitopro7@gmail.com
            </a>

          </div>

        </div>
      </section>

    </main>
  );
}
