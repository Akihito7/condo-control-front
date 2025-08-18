"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { DatePickRange } from "@/components/date-pick-ranger";
import { Button } from "@/components/ui/button";
import { FileDown, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrderingManagement } from "./use-ordering-management";
import { format, parseISO } from "date-fns";
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import { Input } from "@/components/ui/input";
import { PackageModalAction } from "./package-modal-action";
import { ModalGallery } from "./modal-gallery";
import { Delivery } from "@/api/fetch-deliveries";
import { markAsDelivered } from "@/api/mark-as-delivered";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDelivery } from "@/api/delete-delivery";
import { userPagePermission } from "@/utils/user-page-permission";
import { redirect } from "next/navigation";
import { useUserContext } from "@/providers/use-user-context";

export default function OrderingManagement() {
  const { read, edit } = userPagePermission({ pageId: 10 });

  const { userIsLoading } = useUserContext();

  if (!read && !userIsLoading) {
    redirect("/home");
  }
  const [rangeDate, setRangeDate] = useState({
    from: new Date(),
    to: new Date(),
  });
  const {
    deliveries,
    deliveriesStatus,
    statusOptions,
    apartaments,
    apartamentsStatus,
  } = useOrderingManagement({
    startDate: rangeDate.from,
    endDate: rangeDate.to,
  });

  const [statusSelected, setStatusSelected] = useState<string>("-1");
  const [packageModalIsOpen, setPackageModalIsOpen] = useState(false);
  const [modalGalleryIsOpen, setModalGalleryIsOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] = useState<
    number | undefined
  >();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [photosUrls, setPhotosUrl] = useState<string[]>([]);
  const [deliverySelected, setDeliverySelected] = useState<
    Delivery | undefined
  >();
  const [searchApartament, setSearchApartament] = useState<string>();

  const queryClient = useQueryClient();

  const { mutateAsync: handleMarkAsDeliverd } = useMutation({
    mutationFn: async (deliveryId: number) => markAsDelivered({ deliveryId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["deliveries"],
        exact: false,
      });
    },
  });

  const { mutateAsync: handleDeleteDelivery } = useMutation({
    mutationFn: async (deliveryId: number) => deleteDelivery({ deliveryId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["deliveries"],
        exact: false,
      });
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen w-full p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Comunicação"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Encomendas
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intervalo de Datas
          </label>
          <DatePickRange range={rangeDate} setRange={setRangeDate} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select
            defaultValue={statusSelected}
            onValueChange={(value) => {
              setStatusSelected(value);
            }}
          >
            <SelectTrigger className="bg-white w-[260px] min-h-[40px]">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Todos</SelectItem>
              {statusOptions?.map((option, index: number) => (
                <SelectItem key={index} value={String(option.id)}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apartamento
          </label>
          <Input
            placeholder="Ex : 101"
            className="h-10 bg-white"
            onChange={(event) => {
              const value = event.target.value;
              setSearchApartament(value);
            }}
          />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Encomendas</h2>

          <PackageModalAction
            isOpen={packageModalIsOpen}
            setIsOpen={setPackageModalIsOpen}
            apartaments={apartaments}
            deliverySelected={deliverySelected}
            setDeliverySelected={setDeliverySelected}
            type={deliverySelected ? "edit" : "create"}
          />
        </div>
        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Data Recebimento</TableHead>
                <TableHead>Apartamento</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead>Data Entrega</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveriesStatus === "pending" ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </>
              ) : (
                deliveries!
                  .filter((delivery) => {
                    const apartamentIsMatch = !searchApartament
                      ? true
                      : searchApartament.toLocaleLowerCase() ===
                        String(
                          delivery.apartmentApartmentNumber
                        ).toLocaleLowerCase()
                      ? true
                      : false;
                    const statusIsMatch =
                      statusSelected === "-1"
                        ? true
                        : statusSelected === String(delivery.status);

                    return apartamentIsMatch && statusIsMatch;
                  })
                  .map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        {delivery.receivedAt
                          ? format(
                              parseISO(delivery.receivedAt),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {delivery.apartmentApartmentNumber ?? "-"}
                      </TableCell>
                      <TableCell>{delivery.description ?? "-"}</TableCell>
                      <TableCell>
                        {delivery.status === 1 ? "Pendente" : "Entregue"}
                      </TableCell>
                      <TableCell>
                        {delivery.pickedUpAt
                          ? format(
                              parseISO(delivery.pickedUpAt),
                              "dd/MM/yyyy HH:mm"
                            )
                          : "-"}
                      </TableCell>

                      <TableCell className="text-center">
                        <DropdownMenu
                          open={
                            dropdownOpen &&
                            dropdownOpenToThisItem === delivery.id
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setDropdownOpenToThisItem(undefined);
                            } else {
                              setDropdownOpenToThisItem(delivery.id);
                            }
                            setDropdownOpen(open);
                          }}
                        >
                          <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                            <Pencil className="w-4 h-4 text-gray-700" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {!delivery.pickedUpAt && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleMarkAsDeliverd(delivery.id)
                                }
                              >
                                Marcar como entregue
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              onClick={() => {
                                setDropdownOpen(false);
                                setDeliverySelected(delivery);
                                setPackageModalIsOpen(true);
                              }}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteDelivery(delivery.id)}
                            >
                              Excluir
                            </DropdownMenuItem>
                            {delivery.attachments &&
                              delivery.attachments.length > 0 && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setModalGalleryIsOpen(true);
                                    setPhotosUrl(
                                      delivery.attachments!.map(
                                        (attachment) => attachment.path
                                      )
                                    );
                                  }}
                                >
                                  Ver Fotos
                                </DropdownMenuItem>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      {modalGalleryIsOpen && (
        <ModalGallery
          isOpen={modalGalleryIsOpen}
          setIsOpen={setModalGalleryIsOpen}
          imageUrls={photosUrls}
        />
      )}
    </div>
  );
}
