"use client";

import Link from "next/link";
import { useIsMobile } from "@/lib/use-is-mobile";
import { useSidebarContext } from "@/providers/use-sidebar-context";
import { useUserContext } from "@/providers/use-user-context";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { redirect } from "next/navigation";
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
  Package,
  Shield,
  UserCheck,
  Calendar,
  TrendingUp,
  Wrench,
  MapPin,
  Home,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { deleteCookies } from "@/actions/cookies";
import { Module } from "@/api/fetch-me";

export function Sidebar() {
  const { isOpen, setIsOpen, sidebarRef } = useSidebarContext();
  const { user, userIsLoading } = useUserContext();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<Record<string, boolean>>(
    {},
  );

  const isMobile = useIsMobile();

  async function handleLogout() {
    deleteCookies("@smartCondo:token");
    redirect("/signin");
  }

  useEffect(() => {
    if (!isOpen) setIsSubMenuOpen({});
  }, [isOpen]);

  const toggleSubMenu = (moduleName: string) => {
    setIsSubMenuOpen((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
    if (!isOpen) setIsOpen(true);
  };

  if (userIsLoading) {
    return (
      <aside
        style={{
          position: isMobile ? "fixed" : "static",
          zIndex: isMobile ? 999 : 1,
        }}
        className={clsx(
          "h-screen bg-white border-r border-gray-200 flex flex-col font-sans text-sm text-gray-800 transition-all duration-300 ease-in-out",
          isMobile ? (isOpen ? "w-72" : "hidden") : isOpen ? "w-90" : "w-16",
        )}
      >
        {/* Cabeçalho Skeleton */}
        <div className="p-6 border-b border-gray-200">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Navegação Skeleton */}
        <nav className="flex-1 px-2 py-6 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center px-3 py-2 space-x-3">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              {isOpen && (
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Skeleton */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          {isOpen && (
            <div className="flex-1 space-y-1">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside
      ref={sidebarRef}
      style={{
        position: isMobile ? "fixed" : "static",
        zIndex: isMobile ? 999 : 1,
      }}
      className={clsx(
        "h-screen bg-white border-r border-gray-200 flex flex-col font-sans text-sm text-gray-800 transition-all duration-300 ease-in-out",
        isMobile ? (isOpen ? "w-72" : "hidden") : isOpen ? "w-90" : "w-16",
      )}
    >
      <div className="p-6 border-b border-gray-200">
        <h1
          className={clsx(
            "text-xl font-semibold tracking-tight transition-all duration-300 origin-left",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90",
          )}
        >
          {user.condominiumLogo ? (
            <img className="w-12 h-12 object-fill" src={user.condominiumLogo} />
          ) : (
            "CondoControl"
          )}
        </h1>
      </div>

      <nav className="flex-1 px-2 py-6 space-y-2">
        {/* Home sempre visível */}
        <div>
          <button
            onClick={() => {
              setIsOpen(true);
              redirect("/home");
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            <span className="flex items-center">
              <Home className="w-4 h-4 text-gray-700" />
              {isOpen && (
                <Link
                  href="/home"
                  className="flex items-center px-3 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                  Home
                </Link>
              )}
            </span>
          </button>
        </div>

        {/* Módulos do usuário */}
        {user?.tabStructure?.map((module) => (
          <SidebarSection
            key={module.moduleId}
            label={getModuleLabel(module.moduleName)}
            icon={getModuleIcon(module.moduleName)}
            isOpen={isOpen}
            isSubOpen={!!isSubMenuOpen[module.moduleName]}
            toggle={() => toggleSubMenu(module.moduleName)}
          >
            {renderPages(module, isOpen)}
          </SidebarSection>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 hover:bg-gray-50 transition">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-700 font-semibold">
                {user?.name?.slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 transition-opacity duration-300">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                sideOffset={8}
                className="w-48 bg-white rounded-md shadow-md border border-gray-200 p-1"
              >
                <DropdownMenuItem
                  className="px-2 py-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer flex items-center"
                  onClick={() => handleLogout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Deslogar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <UserCircle className="w-6 h-6" />
        )}
      </div>
    </aside>
  );
}

function SidebarSection({
  label,
  icon,
  isOpen,
  isSubOpen,
  toggle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isSubOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
      >
        <span className="flex items-center">
          {icon}
          {isOpen && <span className="ml-3">{label}</span>}
        </span>
        {isOpen &&
          (isSubOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </button>
      {isSubOpen && isOpen && (
        <div className="ml-7 mt-2 space-y-1">{children}</div>
      )}
    </div>
  );
}

function renderPages(module: Module, isOpen: boolean) {
  return module.modulePages.map((page) => (
    <SidebarItem
      key={page.pageId}
      href={page.pageRoutePath}
      icon={getPageIcon(page.pageIconName)}
      label={page.pageName}
    />
  ));
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
    <Link
      href={href}
      className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
}

// Ícones por módulo
function getModuleIcon(moduleName: string) {
  const icons: Record<string, React.ReactNode> = {
    financial: <LayoutDashboard size={18} />,
    structure: <Wrench size={18} />,
    communication: <MessageSquare size={18} />,
    security: <Shield size={18} />,
    indicators: <TrendingUp size={18} />,
  };
  return icons[moduleName] || <FileText size={18} />;
}

function getModuleLabel(moduleName: string) {
  const labels: Record<string, string> = {
    financial: "Finanças",
    structure: "Estrutura e Operações",
    communication: "Comunicação e Suporte",
    security: "Segurança",
    indicators: "Indicadores",
    backoffice: "Backoffice",
  };
  return labels[moduleName] || moduleName;
}

// Ícones para páginas, recebendo string do backend, fallback FileText
function getPageIcon(iconName?: string) {
  const icons: Record<string, React.ReactNode> = {
    Users: <Users className="w-4 h-4" />,
    Building: <Building className="w-4 h-4" />,
    Settings: <Settings className="w-4 h-4" />,
    FileText: <FileText className="w-4 h-4" />,
    FileBarChart: <FileBarChart className="w-4 h-4" />,
    DollarSign: <DollarSign className="w-4 h-4" />,
    UserCircle: <UserCircle className="w-4 h-4" />,
    MessageSquare: <MessageSquare className="w-4 h-4" />,
    Phone: <Phone className="w-4 h-4" />,
    Package: <Package className="w-4 h-4" />,
    Shield: <Shield className="w-4 h-4" />,
    UserCheck: <UserCheck className="w-4 h-4" />,
    Calendar: <Calendar className="w-4 h-4" />,
    TrendingUp: <TrendingUp className="w-4 h-4" />,
    Wrench: <Wrench className="w-4 h-4" />,
    MapPin: <MapPin className="w-4 h-4" />,
  };
  return icons[iconName || ""] || <FileText className="w-4 h-4" />;
}
