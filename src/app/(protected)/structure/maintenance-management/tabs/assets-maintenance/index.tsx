"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Paperclip, Pencil } from "lucide-react";
import { ModalCreateAsset } from "./modal-create-asset";
import { useAssetsMaintenance } from "./use-assets-maintenance";
import { Asset } from "@/api/fetch-maintenance-management-assets";
import { ModalAttachments } from "./modal-attachments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaintenanceAsset } from "@/api/delete-maintenance-asset";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AssetsMaintenance() {
  const query = useQueryClient();
  const [code, setCode] = useState<string>();
  const [typeSelected, setTypeSelected] = useState("-1");
  const [assetSelected, setAssetSelected] = useState<Asset | null>(null);
  const [modalAttchamentIsOpen, setModalAttchamentIsOpen] = useState(false);
  const [usefulLifeLessThanTwoYears, setUsefulLifeLessThanTwoYears] =
    useState("2");
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] = useState<
    number | undefined
  >();

  const { assetsTypes, assetsTypesStatus, assets, assetsStatus } =
    useAssetsMaintenance();

  const getType = (typeId: number): string => {
    const type = assetsTypes?.find((asset) => asset.id === typeId);
    return type?.name ?? "";
  };

  const { mutateAsync: handleDeleteMaintenanceAsset } = useMutation({
    mutationFn: (assetId: number) => deleteMaintenanceAsset(assetId),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["assets"],
        exact: false,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <div className="w-[250px] space-y-2">
          <Label>Busca por Código</Label>
          <Input
            placeholder="Ex: ELV-001"
            onChange={(event) => {
              const code = event.target.value;
              setCode(code);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de ativo</Label>
          <Select
            value={typeSelected}
            onValueChange={(value) => setTypeSelected(value)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Selecione o tipo do ativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Todos</SelectItem>
              {assetsTypes?.map((assetType) => (
                <SelectItem value={String(assetType.id)}>
                  {assetType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[250px] space-y-2">
          <Label>Apenas vida útil menor que 2 anos</Label>
          <Select
            value={usefulLifeLessThanTwoYears}
            onValueChange={(choice) => setUsefulLifeLessThanTwoYears(choice)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Sim/Não" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Sim</SelectItem>
              <SelectItem value="2">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Ativos</h2>

          <ModalCreateAsset assetsTypes={assetsTypes} />
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-left">Contato</TableHead>
                <TableHead className="text-center">Data Instalação</TableHead>
                <TableHead className="text-left">Frequência</TableHead>
                <TableHead>Vida Útil Estimada</TableHead>
                <TableHead>Vida Útil Restante</TableHead>
                <TableHead className="text-left">Anexos</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets
                ?.filter((asset) => {
                  const normalize = (str: string) =>
                    str.trim().toLowerCase().replace(/-/g, "");

                  const matchesType =
                    typeSelected === "-1" ||
                    String(asset.type) === typeSelected;

                  const normalizedAssetCode = normalize(asset.code);
                  const normalizedSearchCode = normalize(code || "");

                  const matchesCode =
                    !code ||
                    normalizedAssetCode.includes(normalizedSearchCode) ||
                    asset.code.toLowerCase().includes(normalizedSearchCode);

                  const remainingYears = Number(
                    asset.remainingUsefulLife.split(" ")?.[0]
                  );
                  const matchesUsefulLife =
                    usefulLifeLessThanTwoYears === "2" || remainingYears < 2;

                  return matchesType && matchesCode && matchesUsefulLife;
                })
                .map((asset) => (
                  <TableRow key={asset.code}>
                    <TableCell>{asset.code}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{getType(asset.type)}</TableCell>
                    <TableCell>{asset.supplier}</TableCell>
                    <TableCell>{asset.contact}</TableCell>
                    <TableCell className="text-center">
                      {asset.installationDate}
                    </TableCell>
                    <TableCell>{asset.maintenanceFrequency}</TableCell>
                    <TableCell>{asset.estimatedUsefulLife}</TableCell>
                    <TableCell>{asset.remainingUsefulLife}</TableCell>
                    <TableCell
                      onClick={() => {
                        setAssetSelected(asset);
                        setModalAttchamentIsOpen(true);
                      }}
                    >
                      <div className="cursor-pointer flex items-center justify-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition w-12 h-12">
                        <Paperclip className="w-4 h-4 text-gray-700" />
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu
                          open={
                            dropdownOpen &&
                            dropdownOpenToThisItem === asset.id
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setDropdownOpenToThisItem(undefined);
                            } else {
                              setDropdownOpenToThisItem(asset.id);
                            }
                            setDropdownOpen(open);
                          }}
                      > 
                        <DropdownMenuTrigger className="outline-none">
                          <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-600" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDropdownOpen(false)
                              setAssetToDelete(asset)
                            }}
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

      <ModalAttachments
        assetSelected={assetSelected}
        setAssetSelected={setAssetSelected}
        isOpen={modalAttchamentIsOpen}
        setIsOpen={setModalAttchamentIsOpen}
      />

      <Dialog open={!!assetToDelete} onOpenChange={(open) => {if(!open) setAssetToDelete(null)}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o ativo{" "}
              <strong>{assetToDelete?.name}</strong>? <br />
              Esta ação não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
            variant="outline"
              onClick={() => setAssetToDelete(null)}
            >
              Cancelar
            </Button> 

            <Button
            variant="destructive"
              onClick={async () => {
                if (!assetToDelete) return;
                await handleDeleteMaintenanceAsset(assetToDelete.id);
                setAssetToDelete(null);
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}
