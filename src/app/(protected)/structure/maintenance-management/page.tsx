"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { AssetsMaintenance } from "./tabs/assets-maintenance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function MaintenanceManagement() {
  const [tabSelected, setTabSelected] = useState("assetMaintenance");
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

      <Tabs value={tabSelected} onValueChange={(tab) => setTabSelected(tab)}>
        <TabsList>
          <TabsTrigger value="assetMaintenance">Ativos</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-6" value="assetMaintenance">
          <AssetsMaintenance />
        </TabsContent>
      </Tabs>
    </main>
  );
}
