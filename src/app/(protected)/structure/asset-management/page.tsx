"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, ImageOff, Paperclip, Pencil } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAssetManagement } from "./use-asset-management";
import { ModalActionAsset } from "./modal-action-asset";
import { TableRowSkeleton } from "@/components/table-row-skeleton";
import { useEffect, useRef, useState } from "react";

export default function AssetManagement() {
  const {
    assetSelected,
    setAssetSelected,
    modalAssetIsOpen,
    setModalAssetIsOpen,
    categoriesOptions,
    categoriesOptionsStatus,
    areasOptions,
    areasOptionsStatus,
    statusOptionsStatus,
    statusOptions,
    assets,
    statusAssets,
    handleDeleteAsset,
    handleChangeAssetImage,
    handleDeleteAssetImage,
  } = useAssetManagement();

  const [modalPhotoIsOpen, setModalPhotoIsOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState<any>(undefined);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenToThisItem, setDropdownOpenToThisItem] = useState<
    number | undefined
  >();
  const [updatingImage, setUpdatingImaged] = useState(false);

  // Filtros
  const [areaSelected, setAreaSelected] = useState("-1");
  const [codeSearch, setCodeSearch] = useState("");

  useEffect(() => {
    if (newPhoto) {
      const url = URL.createObjectURL(newPhoto);
      setPreviewPhoto(url);
    } else {
      setPreviewPhoto(null);
    }
  }, [newPhoto]);

  // Aplica os filtros
  const filteredAssets = assets?.filter((asset) => {
    const matchArea =
      areaSelected === "-1" || String(asset.areaId) === areaSelected;

    const matchCode =
      codeSearch.trim() === "" ||
      asset.codeItem.toLowerCase().includes(codeSearch.toLowerCase());

    return matchArea && matchCode;
  });

  return (
    <main className="bg-gray-50 min-h-screen overflow-auto w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Patrimônio
        </h1>
      </div>

      <div className="flex flex-col gap-4 md:items-end md:flex-row">
        <div className="flex gap-2">
          {/* Filtro área */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área
            </label>
            <Select
              value={areaSelected}
              onValueChange={(value) => {
                setAreaSelected(value);
              }}
            >
              <SelectTrigger className="col-span-3 w-[250px]">
                <SelectValue placeholder="Selecione a area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Todas</SelectItem>
                {areasOptions?.map((area) => (
                  <SelectItem key={area.id} value={String(area.id)}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Busca por Código
            </label>
            <Input
              placeholder="Ex: CAD-001"
              className="w-[250px]"
              value={codeSearch}
              onChange={(e) => setCodeSearch(e.target.value)}
            />
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

      <section className="rounded-xl border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Patrimônios</h2>

          <ModalActionAsset
            assetSelected={assetSelected}
            setAssetSelected={setAssetSelected as any}
            isOpen={modalAssetIsOpen}
            setIsOpen={setModalAssetIsOpen}
            categoriasOptions={categoriesOptions}
            areasOptions={areasOptions}
            statusOptions={statusOptions}
            type={assetSelected ? "edit" : "create"}
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Área</TableHead>
                <TableHead className="text-left">Categoria</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusAssets === "pending" ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRowSkeleton className="h-18" key={index} />
                  ))}
                </>
              ) : filteredAssets?.length ? (
                filteredAssets.map((asset, index) => (
                  <TableRow key={index}>
                    <TableCell
                      onClick={() => {
                        setAssetSelected(asset);
                        setModalPhotoIsOpen(true);
                      }}
                    >
                      {asset.publicUrl ? (
                        <img
                          src={asset.publicUrl}
                          alt="foto do item"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                          <ImageOff className="w-6 h-6" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.codeItem}</TableCell>
                    <TableCell>{asset.condominiumAreasName}</TableCell>
                    <TableCell>{asset.assetCategoriesName}</TableCell>
                    <TableCell className="text-center">
                      {asset.assetStatusName}
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
                        <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                          <Pencil className="w-4 h-4 text-gray-700" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setDropdownOpen(false);
                              setDropdownOpenToThisItem(undefined);
                            }}
                          >
                            Reportar Problema
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDropdownOpen(false);
                              setDropdownOpenToThisItem(undefined);
                              setAssetSelected(asset);
                              setModalAssetIsOpen(true);
                            }}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await handleDeleteAsset(asset.id);
                            }}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    Nenhum patrimônio encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <Dialog
        open={modalPhotoIsOpen && !!assetSelected?.id}
        onOpenChange={(open) => {
          if (!open) {
            setNewPhoto(undefined);
            setPreviewPhoto(undefined);
            setModalPhotoIsOpen(false);
            setAssetSelected(undefined);
          }
          setModalPhotoIsOpen(open);
        }}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Foto</DialogTitle>
          </DialogHeader>

          {!newPhoto && assetSelected?.publicUrl ? (
            <>
              <img
                src={assetSelected?.publicUrl}
                alt="foto do item"
                className="w-32 h-32 rounded-lg object-cover mx-auto"
              />
              <div className="flex w-full gap-4 mt-4">
                <Button
                  onClick={async () => {
                    await handleDeleteAssetImage(assetSelected!.id);
                    setModalPhotoIsOpen(false);
                    setAssetSelected(undefined);
                  }}
                  className="flex-1"
                  variant="destructive"
                >
                  Remover foto atual
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 gap-2">
              <span>Este item ainda não possui foto</span>
              <span className="text-sm">
                Você pode adicionar uma nova imagem agora.
              </span>
            </div>
          )}

          {previewPhoto && <img src={previewPhoto} alt="preview new Image" />}
          <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600">
            <Paperclip />
            Clique para adicionar uma nova foto
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              onChange={(event) => {
                const files = event.target.files;
                if (files && files.length > 0) {
                  setNewPhoto(files[0]);
                } else {
                  setPreviewPhoto(null);
                  setNewPhoto(null);
                }
              }}
            />
          </label>

          {newPhoto && (
            <div className="flex w-full gap-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setPreviewPhoto(null);
                  setNewPhoto(null);
                  if (inputRef && inputRef.current) {
                    inputRef.current.value = "";
                  }
                }}
              >
                Voltar
              </Button>
              <Button
                disabled={updatingImage}
                onClick={async () => {
                  setUpdatingImaged(true);
                  const formData = new FormData();
                  formData.append("photo", newPhoto);
                  await handleChangeAssetImage({
                    assetId: assetSelected!.id,
                    formData,
                  });
                  setNewPhoto(undefined);
                  setPreviewPhoto(undefined);
                  setModalPhotoIsOpen(false);
                  setAssetSelected(undefined);
                  setUpdatingImaged(false);
                }}
                className="flex-1"
              >
                Confirmar troca de foto
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
