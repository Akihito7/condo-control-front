"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAssetManagement } from "./use-asset-management";
import { ModalActionAsset } from "./modal-action-asset";

const MOCKDATA = [
  {
    photo: "https://example.com/photo1.jpg",
    item: "Item 1",
    codigo: "COD0001",
    area: "Centro",
    categoria: "Alimentos",
    status: "Indisponível",
  },
  {
    photo: "https://example.com/photo2.jpg",
    item: "Item 2",
    codigo: "COD0002",
    area: "Oeste",
    categoria: "Alimentos",
    status: "Em Estoque",
  },
  {
    photo: "https://example.com/photo3.jpg",
    item: "Item 3",
    codigo: "COD0003",
    area: "Norte",
    categoria: "Eletrônicos",
    status: "Em Estoque",
  },
  {
    photo: "https://example.com/photo4.jpg",
    item: "Item 4",
    codigo: "COD0004",
    area: "Oeste",
    categoria: "Eletrônicos",
    status: "Disponível",
  },
  {
    photo: "https://example.com/photo5.jpg",
    item: "Item 5",
    codigo: "COD0005",
    area: "Centro",
    categoria: "Brinquedos",
    status: "Em Estoque",
  },
  {
    photo: "https://example.com/photo6.jpg",
    item: "Item 6",
    codigo: "COD0006",
    area: "Sul",
    categoria: "Eletrônicos",
    status: "Disponível",
  },
  {
    photo: "https://example.com/photo7.jpg",
    item: "Item 7",
    codigo: "COD0007",
    area: "Leste",
    categoria: "Eletrônicos",
    status: "Em Estoque",
  },
  {
    photo: "https://example.com/photo8.jpg",
    item: "Item 8",
    codigo: "COD0008",
    area: "Oeste",
    categoria: "Alimentos",
    status: "Disponível",
  },
  {
    photo: "https://example.com/photo9.jpg",
    item: "Item 9",
    codigo: "COD0009",
    area: "Norte",
    categoria: "Brinquedos",
    status: "Esgotado",
  },
];

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
  } = useAssetManagement();

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
              {MOCKDATA.map((data) => (
                <TableRow>
                  <TableCell>
                    <img
                      src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300"
                      alt="foto do item"
                      className="w-16 h-16 rounded-lg"
                    />
                  </TableCell>
                  <TableCell>{data.item}</TableCell>
                  <TableCell>{data.codigo}</TableCell>
                  <TableCell>{data.area}</TableCell>
                  <TableCell>{data.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
