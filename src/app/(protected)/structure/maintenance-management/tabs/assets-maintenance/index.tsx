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
import { MoreHorizontal, Paperclip } from "lucide-react";
import { ModalCreateAsset } from "./modal-create-asset";
import { useAssetsMaintenance } from "./use-assets-maintenance";
import { Asset } from "@/api/fetch-maintenance-management-assets";
import { ModalAttachments } from "./modal-attachments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMaintenanceAsset } from "@/api/delete-maintenance-asset";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModalViewAsset } from "./modal-view-asset";
import { AssetMaintenanceReport } from "@/api/get-asset-maintenances-details";
import { ModalEditAsset } from "./modal-edit-asset";

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

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
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] =
    useState<number>();
  const [isOpenModalView, setIsOpenModalView] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [assetDetailsSelected, setAssetDetailsSelected] =
    useState<AssetMaintenanceReport | null>(null);

  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileDropdownItem, setMobileDropdownItem] = useState<
    number | undefined
  >();

  const { assetsTypes, assets, assetDetails } = useAssetsMaintenance();

  const getType = (typeId: number): string =>
    assetsTypes?.find((asset) => asset.id === typeId)?.name ?? "";

  const { mutateAsync: handleDeleteMaintenanceAsset } = useMutation({
    mutationFn: (assetId: number) => deleteMaintenanceAsset(assetId),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["assets"], exact: false });
    },
  });

  const filteredAssets =
    assets?.filter((asset) => {
      const normalize = (str: string) =>
        str.trim().toLowerCase().replace(/-/g, "");

      const matchesType =
        typeSelected === "-1" || String(asset.type) === typeSelected;

      const matchesCode =
        !code ||
        normalize(asset.code).includes(normalize(code)) ||
        asset.code.toLowerCase().includes(normalize(code));

      const remainingYears = Number(asset.remainingUsefulLife.split(" ")?.[0]);

      const matchesUsefulLife =
        usefulLifeLessThanTwoYears === "2" || remainingYears < 2;

      return matchesType && matchesCode && matchesUsefulLife;
    }) ?? [];

  return (
    <div className="space-y-6">
      {/* filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end w-full">
        <div className="w-[250px] space-y-2">
          <Label>Busca por Código</Label>
          <Input
            placeholder="Ex: ELV-001"
            onChange={(event) => setCode(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de ativo</Label>
          <Select value={typeSelected} onValueChange={setTypeSelected}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Selecione o tipo do ativo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">Todos</SelectItem>
              {assetsTypes?.map((assetType) => (
                <SelectItem key={assetType.id} value={String(assetType.id)}>
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
            onValueChange={setUsefulLifeLessThanTwoYears}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Sim</SelectItem>
              <SelectItem value="2">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MOBILE */}

      <section className="rounded-xl border overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Ativos</h2>

          <ModalCreateAsset assetsTypes={assetsTypes} />
        </div>

        <div className="md:hidden space-y-4">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="rounded-xl border p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">{asset.code}</p>
                </div>

                <DropdownMenu
                  open={mobileDropdownOpen && mobileDropdownItem === asset.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setMobileDropdownItem(undefined);
                    } else {
                      setMobileDropdownItem(asset.id);
                    }
                    setMobileDropdownOpen(open);
                  }}
                >
                  <DropdownMenuTrigger>
                    <MoreHorizontal className="w-5 h-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        const details = assetDetails?.find(
                          (a) => a.asset_id === asset.id,
                        );
                        if (!details) return;
                        setMobileDropdownOpen(false);
                        setAssetDetailsSelected(details);
                        setIsOpenModalView(true);
                      }}
                    >
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAssetToDelete(asset)}>
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Info label="Tipo" value={getType(asset.type)} />
                <Info label="Fornecedor" value={asset.supplier} />
                <Info label="Contato" value={asset.contact} />
                <Info label="Instalação" value={asset.installationDate} />
                <Info label="Frequência" value={asset.maintenanceFrequency} />
                <Info
                  label="Vida útil estimada"
                  value={asset.estimatedUsefulLife}
                />
                <Info
                  label="Vida útil restante"
                  value={asset.remainingUsefulLife}
                />
              </div>

              <Button
                variant="outline"
                className="w-full flex gap-2"
                onClick={() => {
                  setAssetSelected(asset);
                  setModalAttchamentIsOpen(true);
                }}
              >
                <Paperclip className="w-4 h-4" />
                Anexos
              </Button>
            </div>
          ))}
        </div>

        <div className="hidden md:block max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
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
                    asset.remainingUsefulLife.split(" ")?.[0],
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
                          dropdownOpen && dropdownOpenToThisItem === asset.id
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
                          <DropdownMenuItem
                            onClick={() => {
                              const findAssetDetails = assetDetails?.find(
                                (a) => a.asset_id === asset.id,
                              );
                              if (!findAssetDetails) return;
                              setDropdownOpen(false);
                              setDropdownOpenToThisItem(undefined);
                              setIsOpenModalView(true);
                              setAssetDetailsSelected(findAssetDetails);
                            }}
                          >
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setAssetSelected(asset);
                              setDropdownOpen(false);
                              setDropdownOpenToThisItem(undefined);
                              setIsOpenModalEdit(true);
                            }}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDropdownOpen(false);
                              setAssetToDelete(asset);
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

      {/* modais */}
      <ModalAttachments
        assetSelected={assetSelected}
        setAssetSelected={setAssetSelected}
        isOpen={modalAttchamentIsOpen}
        setIsOpen={setModalAttchamentIsOpen}
      />

      <Dialog
        open={!!assetToDelete}
        onOpenChange={() => setAssetToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <strong>{assetToDelete?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssetToDelete(null)}>
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

      <ModalViewAsset
        assetSelected={assetDetailsSelected}
        isOpen={isOpenModalView && !!assetDetailsSelected}
        setIsOpen={setIsOpenModalView}
      />

      <ModalEditAsset
        assetsTypes={assetsTypes}
        assetSelected={assetSelected!!}
        setIsOpen={setIsOpenModalEdit}
        isOpen={isOpenModalEdit && !!assetSelected}
      />
    </div>
  );
}
