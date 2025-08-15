"use client";

import Link from "next/link";
import { useIsMobile } from "@/lib/use-is-mobile";
import { useSidebarContext } from "@/providers/use-sidebar-context";
import { useUserContext } from "@/providers/use-user-context";
import { userModulePermission } from "@/utils/user-module-permission";
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
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { deleteCookies, setCookies } from "@/actions/cookies";
import { useRouter } from "next/router";

export function Sidebar() {
  const { isOpen, setIsOpen } = useSidebarContext();
  const { user } = useUserContext();
  const [userModulesCanRead, setUserModulesCanRead] = useState({
    finance: false,
    structure: false,
    indicators: false,
    communication: false,
    security: false,
  });
  const [isSubMenuOpen, setIsSubMenuOpen] = useState({
    finance: false,
    structure: false,
    communication: false,
    security: false,
    indicators: false,
  });

  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    deleteCookies("@smartCondo:token");
    redirect("/signin");
  }

  // Atualiza permissões
  useEffect(() => {
    if (user) {
      setUserModulesCanRead({
        finance: userModulePermission({
          moduleId: 1,
          modules: user.modulesWithPermissionByRole,
        }),
        structure: userModulePermission({
          moduleId: 2,
          modules: user.modulesWithPermissionByRole,
        }),
        indicators: userModulePermission({
          moduleId: 3,
          modules: user.modulesWithPermissionByRole,
        }),
        communication: userModulePermission({
          moduleId: 4,
          modules: user.modulesWithPermissionByRole,
        }),
        security: userModulePermission({
          moduleId: 5,
          modules: user.modulesWithPermissionByRole,
        }),
      });
    }
  }, [user]);

  // Fecha sidebar ao clicar fora no mobile
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

  // Fecha submenus se sidebar fechar
  useEffect(() => {
    if (!isOpen) {
      setIsSubMenuOpen({
        finance: false,
        structure: false,
        communication: false,
        security: false,
        indicators: false,
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

      <nav className="flex-1 px-2 py-6 space-y-2">
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

        {userModulesCanRead.finance && (
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
        )}
        {userModulesCanRead.structure && (
          <SidebarSection
            label="Estrutura e Operações"
            icon={<Wrench size={18} />}
            isOpen={isOpen}
            isSubOpen={isSubMenuOpen.structure}
            toggle={() => {
              if (!isOpen) setIsOpen(true);
              setIsSubMenuOpen((prev) => ({
                ...prev,
                structure: !prev.structure,
              }));
            }}
          >
            <SidebarItem
              href="/structure/maintenance-backlog"
              icon={<Wrench className="w-4 h-4" />}
              label="Backlog de manutenções"
            />
            <SidebarItem
              href="/structure/employee-management"
              icon={<Users className="w-4 h-4" />}
              label="Gestão de Funcionários"
            />
            <SidebarItem
              href="/structure/management-of-common-spaces"
              icon={<MapPin className="w-4 h-4" />}
              label="Gestão de Espaços Comuns"
            />
          </SidebarSection>
        )}
        {userModulesCanRead.communication && (
          <SidebarSection
            label="Comunicação e Suporte"
            icon={<MessageSquare size={18} />}
            isOpen={isOpen}
            isSubOpen={isSubMenuOpen.communication}
            toggle={() => {
              if (!isOpen) setIsOpen(true);
              setIsSubMenuOpen((prev) => ({
                ...prev,
                communication: !prev.communication,
              }));
            }}
          >
            <SidebarItem
              href="/communication/opening-of-calls"
              icon={<Phone className="w-4 h-4" />}
              label="Abertura de chamados"
            />
            <SidebarItem
              href="/communication/condominium-schedule"
              icon={<Calendar className="w-4 h-4" />}
              label="Agenda do Condomínio"
            />
            <SidebarItem
              href="/communication/ordering-management"
              icon={<Package className="w-4 h-4" />}
              label="Gestão de Encomendas"
            />
            <SidebarItem
              href="/communication/virtual-assembly"
              icon={<Package className="w-4 h-4" />}
              label="Assembleia Digital"
            />
          </SidebarSection>
        )}
        {userModulesCanRead.security && (
          <SidebarSection
            label="Segurança"
            icon={<Shield size={18} />}
            isOpen={isOpen}
            isSubOpen={isSubMenuOpen.security}
            toggle={() => {
              if (!isOpen) setIsOpen(true);
              setIsSubMenuOpen((prev) => ({
                ...prev,
                security: !prev.security,
              }));
            }}
          >
            <SidebarItem
              href="/security/visitor-registration"
              icon={<UserCheck className="w-4 h-4" />}
              label="Registro de Visitantes"
            />
          </SidebarSection>
        )}
        {userModulesCanRead.indicators && (
          <SidebarSection
            label="Indicadores"
            icon={<TrendingUp size={18} />}
            isOpen={isOpen}
            isSubOpen={isSubMenuOpen.indicators}
            toggle={() => {
              if (!isOpen) setIsOpen(true);
              setIsSubMenuOpen((prev) => ({
                ...prev,
                indicators: !prev.indicators,
              }));
            }}
          >
            <SidebarItem
              href="/indicators/financial-summary"
              icon={<DollarSign className="w-4 h-4" />}
              label="Resumo financeiro"
            />
          </SidebarSection>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 hover:bg-gray-50 transition">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-700 font-semibold">
                {user.name.slice(0, 2)}
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
    <Link
      href={href}
      className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
    >
      <div className="w-5 h-5">{icon}</div>
      {isOpen && <span className="ml-3">{label}</span>}
    </Link>
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
    <Link
      href={href}
      className="flex items-center px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Link>
  );
}
