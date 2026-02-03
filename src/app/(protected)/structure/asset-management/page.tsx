"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileDown,
  ImageOff,
  Paperclip,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
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
import { NotificationDropdown } from "@/components/notification";
import { ModalReport } from "./modal-report";
import Link from "next/link";

function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
    </div>
  );
}

export default function AssetManagement() {
  const {
    assetSelected,
    setAssetSelected,
    modalAssetIsOpen,
    setModalAssetIsOpen,
    categoriesOptions,
    areasOptions,
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
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileDropdownItem, setMobileDropdownItem] = useState<
    number | undefined
  >();
  const [updatingImage, setUpdatingImaged] = useState(false);

  const [areaSelected, setAreaSelected] = useState("-1");
  const [codeSearch, setCodeSearch] = useState("");
  const [modalReportIsOpen, setModalReportIsOpen] = useState(false);

  useEffect(() => {
    if (newPhoto) {
      const url = URL.createObjectURL(newPhoto);
      setPreviewPhoto(url);
    } else {
      setPreviewPhoto(null);
    }
  }, [newPhoto]);

  const filteredAssets = assets?.filter((asset) => {
    const matchArea =
      areaSelected === "-1" || String(asset.areaId) === areaSelected;
    const matchCode =
      codeSearch.trim() === "" ||
      asset.codeItem.toLowerCase().includes(codeSearch.toLowerCase());
    return matchArea && matchCode;
  });

  function applyStylesIfHasReportNotFinished(hasReportNotFinished: boolean) {
    if (!hasReportNotFinished) return "";
    return "border-red-500 text-red-500 bg-red-50";
  }

  return (
    // Removido overflow-auto e min-h-screen travado para permitir scroll natural no mobile
    <main className="bg-gray-50 w-full p-4 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-4 sm:mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
          <div className="ml-auto">
            <NotificationDropdown />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Gestão de Patrimônio
        </h1>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 md:items-end md:flex-row">
        <div className="flex flex-col gap-4 md:flex-row md:items-end w-full">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área
            </label>
            <Select value={areaSelected} onValueChange={setAreaSelected}>
              <SelectTrigger className="w-full md:w-[250px]">
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

          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Busca por Código
            </label>
            <Input
              placeholder="Ex: CAD-001"
              className="w-full md:w-[250px]"
              value={codeSearch}
              onChange={(e) => setCodeSearch(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 w-full md:w-auto"
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <section className="rounded-xl border bg-white">
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

        {/* 📱 VIEW MOBILE - Sem travas de scroll interno */}
        <div className="md:hidden p-4 space-y-4">
          {statusAssets === "pending" ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : filteredAssets?.length ? (
            filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <div
                    className="flex gap-4 items-center"
                    onClick={() => {
                      setAssetSelected(asset);
                      setModalPhotoIsOpen(true);
                    }}
                  >
                    {asset.publicUrl ? (
                      <img
                        src={asset.publicUrl}
                        className="w-14 h-14 rounded-lg object-cover"
                        alt="foto"
                      />
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                        <ImageOff className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">
                        {asset.name}
                      </p>
                      <span className="text-xs font-medium text-gray-500">
                        {asset.codeItem}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu
                    open={mobileDropdownOpen && mobileDropdownItem === asset.id}
                    onOpenChange={(open) => {
                      setMobileDropdownItem(open ? asset.id : undefined);
                      setMobileDropdownOpen(open);
                    }}
                  >
                    <DropdownMenuTrigger className="p-2 outline-none">
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setMobileDropdownOpen(false);
                          setAssetSelected(asset);
                          setModalReportIsOpen(true);
                        }}
                      >
                        Reportar Problema
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setMobileDropdownOpen(false);
                          setAssetSelected(asset);
                          setModalAssetIsOpen(true);
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteAsset(asset.id)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-3">
                  <InfoField label="Área" value={asset.condominiumAreasName} />
                  <InfoField
                    label="Categoria"
                    value={asset.assetCategoriesName}
                  />
                  <InfoField label="Status" value={asset.assetStatusName} />
                  <InfoField
                    label="Reports"
                    value={`${asset.reportCount ?? 0} registros`}
                  />
                </div>

                <Link
                  href={`asset-management/${asset.id}`}
                  className={`flex items-center justify-center w-full py-3 rounded-lg border font-medium text-sm transition ${applyStylesIfHasReportNotFinished(asset.hasReportNotFinished)} bg-gray-50 border-gray-200 text-gray-700`}
                >
                  Ver Histórico
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Nenhum patrimônio encontrado
            </div>
          )}
        </div>

        {/* 📋 VIEW DESKTOP - Mantido scroll interno de 70vh */}
        <div className="hidden md:block">
          <div className="max-h-[70vh] overflow-y-auto border-gray-300">
            <Table className="min-w-full border-collapse">
              <TableHeader className="sticky top-0 bg-white shadow-md z-10">
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead className="text-left">Categoria</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-left">Reports</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusAssets === "pending" ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))
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
                      <TableCell>
                        <Link
                          href={`asset-management/${asset.id}`}
                          className={`flex items-center justify-center gap-1 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition w-12 h-12 ${applyStylesIfHasReportNotFinished(asset.hasReportNotFinished)}`}
                        >
                          <Paperclip
                            className={`w-4 h-4 ${asset.hasReportNotFinished ? "text-red-400" : "text-gray-700 "}`}
                          />
                          <span>{asset.reportCount ?? 0}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu
                          open={
                            dropdownOpen && dropdownOpenToThisItem === asset.id
                          }
                          onOpenChange={(open) => {
                            setDropdownOpenToThisItem(
                              open ? asset.id : undefined,
                            );
                            setDropdownOpen(open);
                          }}
                        >
                          <DropdownMenuTrigger className="outline-none ring-0 cursor-pointer">
                            <Pencil className="w-4 h-4 text-gray-700" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setDropdownOpen(false);
                                setAssetSelected(asset);
                                setModalReportIsOpen(true);
                              }}
                            >
                              Reportar Problema
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDropdownOpen(false);
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
                      colSpan={8}
                      className="text-center py-6 text-gray-500"
                    >
                      Nenhum patrimônio encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Modais (Mantidos conforme original) */}
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
                alt="foto"
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
          {previewPhoto && (
            <img
              src={previewPhoto}
              alt="preview"
              className="mt-4 rounded-lg mx-auto max-h-40"
            />
          )}
          <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600 mt-4">
            <Paperclip /> Clique para adicionar uma nova foto
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              onChange={(e) => {
                const f = e.target.files;
                if (f && f.length > 0) setNewPhoto(f[0]);
              }}
            />
          </label>
          {newPhoto && (
            <div className="flex w-full gap-4 mt-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setPreviewPhoto(null);
                  setNewPhoto(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
              >
                Voltar
              </Button>
              <Button
                disabled={updatingImage}
                className="flex-1"
                onClick={async () => {
                  setUpdatingImaged(true);
                  const fd = new FormData();
                  fd.append("photo", newPhoto);
                  await handleChangeAssetImage({
                    assetId: assetSelected!.id,
                    formData: fd,
                  });
                  setNewPhoto(undefined);
                  setPreviewPhoto(undefined);
                  setModalPhotoIsOpen(false);
                  setAssetSelected(undefined);
                  setUpdatingImaged(false);
                }}
              >
                Confirmar troca
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ModalReport
        isOpen={modalReportIsOpen}
        setIsOpen={setModalReportIsOpen}
        assetSelected={assetSelected}
        setAssetSelected={setAssetSelected}
      />
    </main>
  );
}
