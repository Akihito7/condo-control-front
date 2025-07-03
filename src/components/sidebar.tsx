import {
  ChevronUp,
  LayoutDashboard,
  Users,
  Building,
  Settings,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-80 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          CondoControl
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <a
          href="#"
          className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="ml-3">Dashboard</span>
        </a>

        <a
          href="#"
          className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Users className="w-5 h-5" />
          <span className="ml-3">Usuários</span>
        </a>

        <a
          href="#"
          className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Building className="w-5 h-5" />
          <span className="ml-3">Condomínios</span>
        </a>

        <a
          href="#"
          className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="ml-3">Configurações</span>
        </a>
      </nav>

      <div className="p-4 border-t border-gray-200 hover:bg-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-700 font-semibold">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>

          <ChevronUp size={22} color="gray" />
        </div>
      </div>
    </aside>
  );
}
