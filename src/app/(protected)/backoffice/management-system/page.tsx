"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabUsers } from "./tabs/users/tab-users";
import { TabCondominiums } from "./tabs/tab-condominiums";
import { TabTenants } from "./tabs/tab-tenants";
import { TabPlans } from "./tabs/tab-plans";
import { TabPages } from "./tabs/tab-pages";
import { useManagementSystem } from "./use-management-system";

export default function ManagementSystem() {
  const { users, statusUsers, condominiums, statusCondominiums } =
    useManagementSystem();

  console.log("users =>", condominiums);

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["home", "backoffice"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Administrar</h1>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Usuários
          </TabsTrigger>
          <TabsTrigger
            value="condominium"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Condomínios
          </TabsTrigger>

          <TabsTrigger
            value="tenants"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Tenants
          </TabsTrigger>

          <TabsTrigger
            value="plans"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Planos
          </TabsTrigger>

          <TabsTrigger
            value="pages"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Pages
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="users">
            <TabUsers users={users} statusUsers={statusUsers} />
          </TabsContent>

          <TabsContent value="condominium">
            <TabCondominiums condominiums={condominiums} />
          </TabsContent>

          <TabsContent value="tenants">
            <TabTenants />
          </TabsContent>

          <TabsContent value="plans">
            <TabPlans />
          </TabsContent>

          <TabsContent value="pages">
            <TabPages />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
