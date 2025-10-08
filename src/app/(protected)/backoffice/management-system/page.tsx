import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";

export default function ManagementSystem() {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["home", "backoffice"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Administrar</h1>
      </div>
    </>
  );
}
