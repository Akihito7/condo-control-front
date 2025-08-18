"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import {
  CardSim,
  CreditCard,
  FileDown,
  Pencil,
  TrendingUp,
  Wallet,
} from "lucide-react";
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
import { MonthYearPicker } from "@/components/month-year-select";
import { useMaintenanceBacklog } from "./use-maintenance-backlog";
import { ModalActionIntervention } from "./modal-action-intervation";
import { Intervention } from "@/api/fetch-interventions";
import { Label } from "@radix-ui/react-label";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";

export default function MaintenanceBacklog() {
  const { read, edit } = userPagePermission({ pageId: 4 });

  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }
  const [date, setDate] = useState(new Date());
  const [typeSelected, setTypeSelected] = useState("-1");
  const [statusSelected, setStatusSelected] = useState("-1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] = useState<
    number | undefined
  >();

  const [interventionSelected, setInterventionSelected] =
    useState<Intervention>();

  const [modalTypeAction, setModalTypeAction] = useState<
    "create" | "edit" | "view"
  >("create");

  const [modalActionInvervationIsOpen, setModalActionIntervationIsOpen] =
    useState(false);

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
  } = useMaintenanceBacklog({
    date,
  });

  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Backlog de Manutenções
        </h1>
      </div>

      <div className="flex  flex-col gap-4 md:items-end md:flex-row ">
        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mês e Ano de referência
            </label>
            <MonthYearPicker selectedDate={date} onChange={setDate} />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </Label>
            <Select
              value={typeSelected}
              onValueChange={(value) => setTypeSelected(value)}
            >
              <SelectTrigger
                className="w-full"
                style={{
                  height: 40,
                  width: 200,
                }}
              >
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Todos</SelectItem>
                {maintenancesTypes?.map((type) => (
                  <SelectItem value={String(type.id)}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </Label>
            <Select
              value={statusSelected}
              onValueChange={(value) => setStatusSelected(value)}
            >
              <SelectTrigger
                className="w-full"
                style={{
                  height: 40,
                  width: 200,
                }}
              >
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Todos</SelectItem>
                {maintenancesStatusOptions?.map((type) => (
                  <SelectItem value={String(type.id)}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <CardMaintenance
          amount={interventionsCards?.balance ?? 0}
          title="Saldo Atual"
          icon={<Wallet className="text-blue-400" />}
        />
        <CardMaintenance
          amount={interventionsCards?.approvedImprovementsCost ?? 0}
          title="Custo Melhorias Aprov./Inic."
          icon={<TrendingUp className="text-orange-400" />}
        />
        <CardMaintenance
          amount={interventionsCards?.newMonthlyFixedCosts ?? 0}
          title="Novos Custos Fixos Mensais"
          icon={<CreditCard className="text-green-400" />}
        />
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Backlog de Manutenções
          </h2>

          <ModalActionIntervention
            isOpen={modalActionInvervationIsOpen}
            setIsOpen={setModalActionIntervationIsOpen}
            priorityOptions={priorityOptions}
            paymentMethodsOptions={paymentMethodsOptions}
            areasOptions={areasOptions}
            typesOptions={maintenancesTypes}
            statusOptions={maintenancesStatusOptions}
            interventionSelected={interventionSelected}
            setInterventionSelected={setInterventionSelected}
            type={modalTypeAction}
            setModalTypeAction={setModalTypeAction}
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Prioridade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-left">Valor</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Data de Pagamento</TableHead>
                <TableHead>Conclusão do Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interventions && interventions.length > 0 ? (
                interventions
                  .filter((intervention) => {
                    const statusMatch =
                      statusSelected === "-1"
                        ? true
                        : statusSelected === String(intervention.statusId);
                    const typeMatch =
                      typeSelected === "-1"
                        ? true
                        : typeSelected === String(intervention.typeId);
                    return statusMatch && typeMatch;
                  })
                  .map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span
                            className="px-2 py-1 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: `${item.prioritiesColor}`,
                            }}
                          >
                            {item.prioritiesName}
                          </span>
                        </TableCell>

                        <TableCell>{item.maintenanceTypesName}</TableCell>

                        <TableCell>{item.description}</TableCell>

                        <TableCell>{item.supplier}</TableCell>

                        <TableCell className="text-left">
                          {item.amount.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>

                        <TableCell>{item.paymentMethodsName}</TableCell>

                        <TableCell>
                          {item.paymentDate
                            ? new Date(item.paymentDate).toLocaleDateString(
                                "pt-BR"
                              )
                            : "-"}
                        </TableCell>

                        <TableCell>
                          {item.paymentCompletionDate
                            ? new Date(
                                item.paymentCompletionDate
                              ).toLocaleDateString("pt-BR")
                            : "-"}
                        </TableCell>

                        <TableCell>{item.maintenanceStatusesName}</TableCell>

                        <TableCell className="text-center">
                          <DropdownMenu
                            open={
                              dropdownOpen &&
                              dropdownOpenToThisItem === item.id
                            }
                            onOpenChange={(open) => {
                              if (!open) {
                                setDropdownOpenToThisItem(undefined);
                              } else {
                                setDropdownOpenToThisItem(item.id);
                              }
                              setDropdownOpen(open);
                            }}
                          >
                            <DropdownMenuTrigger
                              asChild
                              className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer"
                            >
                              <Pencil className="w-4 h-4 text-gray-700" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDropdownOpen(false);
                                  setModalTypeAction("edit");
                                  setInterventionSelected(item);
                                  setModalActionIntervationIsOpen(true);
                                }}
                              >
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setDropdownOpen(false);
                                  setModalTypeAction("view");
                                  setInterventionSelected(item);
                                  setModalActionIntervationIsOpen(true);
                                }}
                              >
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  handleDeleteIntervention(item.id);
                                }}
                              >
                                Deletar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-4 text-gray-500"
                  >
                    No interventions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
