"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { AssetsMaintenance } from "./tabs/assets-maintenance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {useState } from "react";
import { Maintenances } from "./tabs/maintenances";
import { Indicators } from "./tabs/indicators";
import { CalendarMaintenance } from "./tabs/calendar-maintenance";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function MaintenanceManagement() {
  const [tabSelected, setTabSelected] = useState("asset-maintenance");
  const [date, setDate] = useState(new Date());

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChangeTab(tab: string) {
    setTabSelected(tab);

    const currentTabInUrl = searchParams.get("tab");
    const params = new URLSearchParams(searchParams.toString());

    if (!currentTabInUrl) {
      params.set("tab", "");
    }

    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  }

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

      <Tabs value={tabSelected} onValueChange={handleChangeTab}>
        <TabsList className="bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <TabsTrigger
            value="asset-maintenance"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Ativos
          </TabsTrigger>

          <TabsTrigger
            value="maintenances"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Manutenções
          </TabsTrigger>

          <TabsTrigger
            value="calendar-maintenance"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Calendário
          </TabsTrigger>

          <TabsTrigger
            value="indicators"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Indicadores
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-6" value="asset-maintenance">
          <AssetsMaintenance />
        </TabsContent>

        <TabsContent className="mt-6" value="maintenances">
          <Maintenances date={date} setDate={setDate} />
        </TabsContent>

        <TabsContent className="mt-6" value="calendar-maintenance">
          <CalendarMaintenance
            date={date}
            setDate={setDate}
            setTabSelected={setTabSelected}
          />
        </TabsContent>

        <TabsContent className="mt-6" value="indicators">
          <Indicators />
        </TabsContent>
      </Tabs>
    </main>
  );
}
