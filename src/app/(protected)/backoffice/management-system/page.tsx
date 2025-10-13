import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Suspense, use } from "react";
import { TabsWrapper } from "./tab-wrapper";

export default function ManagementSystem({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const isLoading = () => {
    return <span>Loading...</span>;
  };

  return (
    <Suspense fallback={isLoading()}>
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["home", "backoffice"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Administrar</h1>
      </div>

      <TabsWrapper searchParams={searchParams} />
    </Suspense>
  );
}
