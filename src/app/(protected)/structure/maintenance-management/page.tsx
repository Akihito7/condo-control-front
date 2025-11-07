import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { AssetsMaintenance } from "./tabs/assets-maintenance";

export default function MaintenanceManagement() {
  return (
    <main className="bg-gray-50 overflow-x-hidden min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Manutenções
        </h1>
      </div>
      <AssetsMaintenance />
    </main>
  );
}
