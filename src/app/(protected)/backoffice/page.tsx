import { Breadcrumb } from "@/components/breadcrumb";
import { ComponentMain } from "./components/component-main";

export default function Backoffice() {
  return (
    <div className="layout-base">
      <Breadcrumb paths={["home", "backoffice"]} />

      <ComponentMain />
    </div>
  );
}
