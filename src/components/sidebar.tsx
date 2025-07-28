"use client";

import { useIsMobile } from "@/lib/use-is-mobile";
import { useSidebarContext } from "@/providers/use-sidebar-context";
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
  UserCircle,
  MessageSquare,
  Phone,
  Box,
  Package,
  Shield,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export function Sidebar() {
  const { isOpen, setIsOpen } = useSidebarContext();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({
    finance: false,
    communication: false,
    security: false,
  });
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsSubMenuOpen({
        finance: false,
        communication: false,
        security: false,
      });
    }
  }, [isOpen]);

  return (
    <aside
      ref={sidebarRef}
      style={{
        position: isMobile ? "fixed" : "static",
        zIndex: isMobile ? 999 : 1,
      }}
      className={clsx(
        "h-screen bg-white border-r border-gray-200 flex flex-col font-sans text-sm text-gray-800 transition-all duration-300 ease-in-out",
        isMobile ? (isOpen ? "w-72" : "hidden") : isOpen ? "w-90" : "w-16"
      )}
    >
      {/* Topo */}
      <div className="p-6 border-b border-gray-200">
        <h1
          className={clsx(
            "text-xl font-semibold tracking-tight transition-all duration-300 origin-left",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}
        >
          CondoControl
        </h1>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-2 py-6 space-y-2">
        {/* Finanças */}
        <div>
          <button
            onClick={() => {
              if (!isOpen) setIsOpen(true);
              setIsSubMenuOpen((prev) => ({
                ...prev,
                finance: !prev.finance,
              }));
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            <span className="flex items-center">
              <LayoutDashboard className="w-5 h-5" size={18} />
              {isOpen && <span className="ml-3">Finanças</span>}
            </span>
            {isOpen &&
              (isSubMenuOpen.finance ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>

          {isSubMenuOpen.finance && isOpen && (
            <div className="ml-7 mt-2 space-y-1">
              <SidebarItem
                href="/finance/transaction-entry"
                icon={<FileText className="w-4 h-4" />}
                label="Lançamento de registros"
              />
              <SidebarItem
                href="/finance/delinquency-control"
                icon={<FileBarChart className="w-4 h-4" />}
                label="Gestão de Inadimplência"
              />
              <SidebarItem
                href="/finance/projection"
                icon={<DollarSign className="w-4 h-4" />}
                label="Previsões financeiras"
              />
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => {
              if (!isOpen) setIsOpen(true);
              setIsSubMenuOpen((prev) => ({
                ...prev,
                communication: !prev.communication,
              }));
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            <span className="flex items-center">
              <MessageSquare size={18} />
              {isOpen && <span className="ml-3">Comunicação e Suporte</span>}
            </span>
            {isOpen &&
              (isSubMenuOpen.communication ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>

          {isSubMenuOpen.communication && isOpen && (
            <div className="ml-7 mt-2 space-y-1">
              <SidebarItem
                href="/communication/opening-of-calls"
                icon={<Phone className="w-4 h-4" />}
                label="Abertura de chamados"
              />

              <SidebarItem
                href="/communication/ordering-management"
                icon={<Package className="w-4 h-4" />}
                label="Gestão de Encomendas"
              />
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => {
              if (!isOpen) setIsOpen(true);
              setIsSubMenuOpen((prev) => ({
                ...prev,
                security: !prev.security,
              }));
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            <span className="flex items-center">
              <Shield size={18} />
              {isOpen && <span className="ml-3">Segurança</span>}
            </span>
            {isOpen &&
              (isSubMenuOpen.security ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              ))}
          </button>

          {isSubMenuOpen.security && isOpen && (
            <div className="ml-7 mt-2 space-y-1">
              <SidebarItem
                href="/security/visitor-registration"
                icon={<UserCheck className="w-4 h-4" />}
                label="Registro de Visitantes"
              />
            </div>
          )}
        </div>

        <SidebarLink
          href="#condominios"
          icon={<Building size={18} />}
          label="Condomínios"
          isOpen={isOpen}
        />
        <SidebarLink
          href="#configuracoes"
          icon={<Settings size={18} />}
          label="Configurações"
          isOpen={isOpen}
        />
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-gray-200 hover:bg-gray-50 transition">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-700 font-semibold">AD</span>
            </div>
            <div className="flex-1 transition-opacity duration-300">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        ) : (
          <UserCircle className="w-6 h-6" />
        )}
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  isOpen,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}) {
  return (
    <a
      href={href}
      className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
    >
      <div className="w-5 h-5">{icon}</div>
      {isOpen && <span className="ml-3">{label}</span>}
    </a>
  );
}

function SidebarItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </a>
  );
}
