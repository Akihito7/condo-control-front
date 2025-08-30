"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Paperclip, Pencil } from "lucide-react";
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
  } = useAssetManagement();

  const [modalPhotoIsOpen, setModalPhotoIsOpen] = useState(false);
  const [newPhoto, setNewPhoto] = useState<any>(undefined);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newPhoto) {
      const url = URL.createObjectURL(newPhoto);
      setPreviewPhoto(url);
    } else {
      setPreviewPhoto(null);
    }
  }, [newPhoto]);

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

      <div className="flex  flex-col gap-4 md:items-end md:flex-row ">
        <div className="flex gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área
            </label>
            <Input />
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
              ) : (
                assets?.map((asset, index) => (
                  <TableRow key={index}>
                    <TableCell
                      onClick={() => {
                        setAssetSelected(asset);
                        setModalPhotoIsOpen(true);
                      }}
                    >
                      <img
                        src={asset.publicUrl}
                        alt="foto do item"
                        className="w-16 h-16 rounded-lg"
                      />
                    </TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.codeItem}</TableCell>
                    <TableCell>{asset.condominiumAreasName}</TableCell>
                    <TableCell>{asset.assetCategoriesName}</TableCell>
                    <TableCell className="text-center">
                      {asset.assetStatusName}
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                          <Pencil className="w-4 h-4 text-gray-700" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Reportar Problema</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
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
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <Dialog open={modalPhotoIsOpen} onOpenChange={setModalPhotoIsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Foto</DialogTitle>
          </DialogHeader>

          {!newPhoto && (
            <>
              <img src={assetSelected?.publicUrl} alt="foto do item" />
              <div className="flex w-full gap-4">
                <Button className="flex-1" variant="destructive">
                  Exluir foto atual
                </Button>
              </div>
            </>
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
              <Button className="flex-1">Confirmar troca de foto</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
