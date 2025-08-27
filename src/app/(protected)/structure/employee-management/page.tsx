"use client";
import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { useState } from "react";
import { useEmployeeManagement } from "./use-employee-management";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { userPagePermission } from "@/utils/user-page-permission";
import { useUserContext } from "@/providers/use-user-context";
import { ScheduleEmployeeTab } from "./tabs/schedule-employee-tab";
import { EmployeesTab } from "./tabs/employees-tab";
import { IndicatorsTab } from "./tabs/indicators-tab";

export default function EmployeeManagement() {
  const { read, edit } = userPagePermission({ pageId: 5 });
  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }

  const [date, setDate] = useState(new Date());

  const {
    employeeRoles,
    employeeRolesStatus,
    employeeStatus,
    employeeStatusStatus,
    workAreas,
    workAreasStatus,
    employees,
    scheduleEmployees,
    handleDeleteEmployee,
    handleUpdateEmployeeSchedule,
  } = useEmployeeManagement({ date });

  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6 overflow-x-hidden">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Funcionários
        </h1>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="flex gap-2 bg-muted p-1 rounded-lg w-fit">
          <TabsTrigger
            value="employees"
            className="px-4 py-2 text-sm font-medium rounded-md transition-all
      data-[state=active]:bg-white data-[state=active]:text-primary
      data-[state=active]:shadow-sm hover:bg-white hover:text-primary"
          >
            Funcionários
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="px-4 py-2 text-sm font-medium rounded-md transition-all
      data-[state=active]:bg-white data-[state=active]:text-primary
      data-[state=active]:shadow-sm hover:bg-white hover:text-primary"
          >
            Escala de Funcionários
          </TabsTrigger>

          <TabsTrigger
            value="indicators"
            className="px-4 py-2 text-sm font-medium rounded-md transition-all
      data-[state=active]:bg-white data-[state=active]:text-primary
      data-[state=active]:shadow-sm hover:bg-white hover:text-primary"
          >
            Indicadores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="pt-4 space-y-4">
          <EmployeesTab
            employeeRoles={employeeRoles}
            employeeRolesStatus={employeeRolesStatus}
            employeeStatus={employeeStatus}
            employeeStatusStatus={employeeStatusStatus}
            employees={employees}
            handleDeleteEmployee={handleDeleteEmployee}
            workAreas={workAreas}
            workAreasStatus={workAreasStatus}
          />
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <ScheduleEmployeeTab
            date={date}
            setDate={setDate}
            handleUpdateEmployeeSchedule={handleUpdateEmployeeSchedule}
            scheduleEmployees={scheduleEmployees}
            employees={employees}
          />
        </TabsContent>

        <TabsContent value="indicators" className="pt-4">
          <IndicatorsTab />
        </TabsContent>
      </Tabs>
    </main>
  );
}
