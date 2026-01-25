"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { useState } from "react";

import { useMaintenanceBacklog } from "./use-maintenance-backlog";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Interventions } from "./tabs/interventions";
import { Indicators } from "./tabs/indicators";

export default function MaintenanceBacklog() {
  const { read } = userPagePermission({ pageId: 4 });

  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const {
    areasOptions,
    paymentMethodsOptions,
    priorityOptions,
    maintenancesStatusOptions,
    maintenancesTypes,
    interventions,
    interventionsCards,
    handleDeleteIntervention,
    resumeIndicators,
    chartImprovementsByArea,
    chartMonthlyExpensesSummary,
  } = useMaintenanceBacklog({
    year,
  });

  return (
    <main className="bg-gray-50 overflow-x-hidden min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Obras
        </h1>
      </div>
      <Tabs defaultValue="interventions" className="p-4">
        <TabsList className="bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <TabsTrigger
            value="interventions"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Obras
          </TabsTrigger>
          <TabsTrigger
            value="indicators"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Indicadores
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="interventions">
            <Interventions
              areasOptions={areasOptions}
              interventions={interventions}
              interventionsCards={interventionsCards}
              maintenancesStatusOptions={maintenancesStatusOptions}
              maintenancesTypes={maintenancesTypes}
              paymentMethodsOptions={paymentMethodsOptions}
              priorityOptions={priorityOptions}
              setYear={setYear}
              year={year}
              handleDeleteIntervention={handleDeleteIntervention}
            />
          </TabsContent>

          <TabsContent value="indicators">
            <Indicators
              setYear={setYear}
              year={year}
              indicatorsResume={resumeIndicators}
              chartImprovementsByArea={chartImprovementsByArea}
              chartMonthlyExpensesSummary={chartMonthlyExpensesSummary}
            />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
