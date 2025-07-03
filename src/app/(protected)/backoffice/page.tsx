import { Breadcrumb } from "@/components/breadcrumb";
import { ComponentMain } from "./components/component-main";

export default function Backoffice() {
  return (
    <div className="bg-white w-full min-h-screen grid grid-rows-[auto_1fr] p-4">
      <Breadcrumb paths={["home", "backoffice"]} />

      <ComponentMain />
    </div>
  );
}
