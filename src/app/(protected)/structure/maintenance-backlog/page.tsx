"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import { CreditCard, FileDown, Pencil, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import { CardMaintenance } from "./card-maintenance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMaintenanceBacklog } from "./use-maintenance-backlog";
import { ModalActionIntervention } from "./modal-action-intervation";
import { Intervention } from "@/api/fetch-interventions";
import { Label } from "@radix-ui/react-label";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";
import { format } from "date-fns";
import { YearSelect } from "@/components/year-select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Interventions } from "./tabs/interventions";
import { Indicators } from "./tabs/indicators";
import { PagesRouteModule } from "next/dist/server/route-modules/pages/module.compiled";

export default function MaintenanceBacklog() {
  const { read, edit } = userPagePermission({ pageId: 4 });

  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }
  const [date, setDate] = useState(new Date());
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const {
    areasOptions,
    areasOptionsStatus,
    paymentMethodsOptions,
    paymentMethodsOptionsStatus,
    priorityOptions,
    priorityOptionsStatus,
    maintenancesStatusOptions,
    maintenancesStatusOptionsStatus,
    maintenancesTypes,
    maintenancesTypesStatus,
    interventions,
    interventionsCards,
    interventionsCardsStatus,
    interventionsStatus,
    handleDeleteIntervention,
    resumeIndicators,
    resumeIndicatorsStatus,
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
          Backlog de Manutenções
        </h1>
      </div>
      <Tabs defaultValue="interventions" className="p-4">
        <TabsList className="bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <TabsTrigger
            value="interventions"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Intervenções
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
            />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
