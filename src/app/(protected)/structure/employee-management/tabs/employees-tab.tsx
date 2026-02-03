import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModalActionEmployee } from "../modal-action-employee";
import { OptionEmployee } from "@/api/fetch-employee-roles";
import { useState } from "react";
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
import { Pencil } from "lucide-react";
import { Employee } from "@/api/fetch-employees-structure";
import { Option } from "@/api/fetch-work-areas";

interface EmployeesTabProps {
  employeeRoles: OptionEmployee[] | undefined;
  employeeStatusStatus: "error" | "success" | "pending";
  employeeRolesStatus: "error" | "success" | "pending";
  workAreasStatus: "error" | "success" | "pending";
  employees: Employee[] | undefined;
  employeeStatus: Option[] | undefined;
  workAreas: Option[] | undefined;
  handleDeleteEmployee: (id: number) => Promise<void>;
}

export function EmployeesTab({
  employeeRoles,
  employeeStatusStatus,
  employeeRolesStatus,
  workAreasStatus,
  employees,
  employeeStatus,
  workAreas,
  handleDeleteEmployee,
}: EmployeesTabProps) {
  const [employeeStatusSelected, setEmployeeStatusSelected] = useState("1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] =
    useState<number>();
  const [modalActionEmployeeIsOpen, setModalActionEmployeeIsOpen] =
    useState(false);
  const [employeeSelected, setEmployeeSelected] = useState<Employee>();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileDropdownItem, setMobileDropdownItem] = useState<
    number | undefined
  >();

  const canRenderModalActionEmployee =
    employeeRolesStatus === "success" &&
    employeeStatusStatus === "success" &&
    workAreasStatus === "success";

  const filteredEmployees =
    employees?.filter(
      (employee) => String(employee.statusId) === employeeStatusSelected,
    ) ?? [];

  return (
    <>
      {/* filtro */}
      <div className="flex flex-col gap-4 md:items-end md:flex-row">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select
            value={employeeStatusSelected}
            onValueChange={setEmployeeStatusSelected}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {employeeStatus?.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="rounded-xl overflow-hidden border mt-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Funcionários</h2>

          {canRenderModalActionEmployee && (
            <ModalActionEmployee
              isOpen={modalActionEmployeeIsOpen}
              setIsOpen={setModalActionEmployeeIsOpen}
              employeeRoles={employeeRoles}
              employeeStatus={employeeStatus}
              workAreas={workAreas}
              employeeSelected={employeeSelected}
              type={employeeSelected ? "edit" : "create"}
              setEmployeeSelected={setEmployeeSelected}
            />
          )}
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden space-y-4 p-4">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="border rounded-lg p-4 space-y-2 text-sm"
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold">{employee.name}</p>

                <DropdownMenu
                  open={
                    mobileDropdownOpen && mobileDropdownItem === employee.id
                  }
                  onOpenChange={(open) => {
                    if (!open) {
                      setMobileDropdownItem(undefined);
                    } else {
                      setMobileDropdownItem(employee.id);
                    }
                    setMobileDropdownOpen(open);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Pencil className="w-4 h-4 text-gray-700" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setMobileDropdownOpen(false)
                        setEmployeeSelected(employee);
                        setModalActionEmployeeIsOpen(true);
                      }}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p>
                <strong>CPF:</strong> {employee.cpf}
              </p>

              <p>
                <strong>Área:</strong>{" "}
                {workAreas?.find((area) => area.id === employee.workAreaId)
                  ?.name ?? "-"}
              </p>

              <p>
                <strong>Cargo:</strong>{" "}
                {employeeRoles?.find(
                  (role) => role.id === employee.employeeRoleId,
                )?.name ?? "-"}
              </p>

              <p>
                <strong>Salário:</strong> R${" "}
                {Number(employee.salary).toFixed(2).replace(".", ",")}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {employeeStatus?.find(
                  (status) => status.id === employee.statusId,
                )?.name ?? "-"}
              </p>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP / TABLET (INALTERADO) ================= */}
        <div className="hidden md:block max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-left">Salário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.cpf}</TableCell>
                  <TableCell>
                    {workAreas?.find((area) => area.id === employee.workAreaId)
                      ?.name ?? "-"}
                  </TableCell>
                  <TableCell>
                    {employeeRoles?.find(
                      (role) => role.id === employee.employeeRoleId,
                    )?.name ?? "-"}
                  </TableCell>
                  <TableCell className="text-left">
                    R$ {Number(employee.salary).toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell>
                    {employeeStatus?.find(
                      (status) => status.id === employee.statusId,
                    )?.name ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu
                      open={
                        dropdownOpen && dropdownOpenToThisItem === employee.id
                      }
                      onOpenChange={(open) => {
                        if (!open) {
                          setDropdownOpenToThisItem(undefined);
                        } else {
                          setDropdownOpenToThisItem(employee.id);
                        }
                        setDropdownOpen(open);
                      }}
                    >
                      <DropdownMenuTrigger className="cursor-pointer">
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setDropdownOpen(false);
                            setEmployeeSelected(employee);
                            setModalActionEmployeeIsOpen(true);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
