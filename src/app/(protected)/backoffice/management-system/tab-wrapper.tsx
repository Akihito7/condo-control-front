"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabCondominiums } from "./tabs/tab-condominiums";
import { TabTenants } from "./tabs/tab-tenants";
import { TabPlans } from "./tabs/tab-plans";
import { TabPages } from "./tabs/tab-pages";
import { TabUsers } from "./tabs/tab-users";
import { useRouter } from "next/navigation";
import { use } from "react";

export function TabsWrapper({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const currentParams = use(searchParams);
  const currentTab = currentParams.tab ?? "users";
  const router = useRouter();

  function handleTabChange(value: string) {
    const params = new URLSearchParams(`tab=${currentParams.tab}`);
    params.set("tab", value);
    router.push(`?${params.toString()}`);
  }

  return (
    <Tabs defaultValue={currentTab} onValueChange={handleTabChange}>
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
          <TabUsers />
        </TabsContent>

        <TabsContent value="condominium">
          <TabCondominiums />
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
  );
}
