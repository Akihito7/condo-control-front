"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useAssetReport } from "./use-asset-report";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { NotificationDropdown } from "@/components/notification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatusAssetReport } from "@/api/update-status-asset-report";
import { useRouter } from "next/navigation";

// Tipagens simplificadas
interface Photo {
  id: number;
  url?: string;
  publicUrl: string;
}

interface Report {
  id: number;
  description: string;
  createdAt: string;
  reporterName?: string;
  photos: Photo[];
  status: string;
}

export default function ReportsPage({ params }: any) {
  const { assetId } = React.use(params) as { assetId: string };
  const { assetsWithReports, status } = useAssetReport(assetId);

  const [reports, setReports] = useState<Report[]>([]);
  const [assetName, setAssetName] = useState("");

  // estado do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentPhotos, setCurrentPhotos] = useState<Photo[]>([]);

  const router = useRouter();
  const queryClient = useQueryClient();

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    if (!assetsWithReports || assetsWithReports.length === 0) return;

    const asset = assetsWithReports[0];
    setAssetName(asset.name);

    const mappedReports: Report[] = asset.assetReports.map((r: any) => ({
      id: r.id,
      description: r.description,
      createdAt: r.createdAt,
      reporterName: r.reportedBy?.toString(),
      photos: r.photos || [],
      status: r.status,
    }));

    setReports(mappedReports);
  }, [assetsWithReports]);

  // abre modal com as fotos de um report
  const openModal = (photos: Photo[], index: number) => {
    setCurrentPhotos(photos);
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPhotos([]);
    setCurrentPhotoIndex(0);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === 0 ? currentPhotos.length - 1 : prev - 1
    );
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      prev === currentPhotos.length - 1 ? 0 : prev + 1
    );
  };

  const { mutateAsync: handleUpdateStatusAssetReport } = useMutation({
    mutationFn: ({ reportId, status }: { reportId: number; status: string }) =>
      updateStatusAssetReport({ reportId, status }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["assets", assetId],
      });
    },
  });

  return (
    <main className="bg-gray-50 min-h-screen overflow-auto w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
          <div className="ml-auto">
            <NotificationDropdown />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-100 rounded-md p-2 cursor-pointer">
            <ChevronLeft
              className="text-gray-600"
              size={24}
              onClick={() => router.back()}
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Reports do Patrimônio
          </h1>
        </div>
      </div>

      <section>
        <p className="text-gray-600">
          Patrimônio: <strong>{assetName || "—"}</strong>
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {status === "pending" && (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-pulse"
              >
                {/* Foto */}
                <div className="h-48 w-full bg-gray-200" />

                {/* Conteúdo */}
                <div className="p-4 flex flex-col gap-4">
                  {/* Descrição */}
                  <div className="h-4 bg-gray-300 rounded w-5/6" />

                  {/* Usuário + Data */}
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2">
                    <div className="h-3 bg-gray-200 rounded w-1/5" />
                    <div className="h-9 bg-gray-300 rounded-lg w-full" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <p className="col-span-full text-center text-red-500 py-8">
            Erro ao carregar reports. Tente novamente.
          </p>
        )}

        {/* SUCCESS + SEM REPORTS */}
        {status === "success" && reports.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">
            Nenhum report encontrado
          </p>
        )}

        {/* SUCCESS + LISTA */}
        {status === "success" &&
          reports.map(
            ({ id, description, photos, reporterName, createdAt, status }) => (
              <div
                key={id}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Foto */}
                <div className="relative h-48 w-full bg-gray-100">
                  {photos.length > 0 ? (
                    <>
                      <img
                        key={photos[0].id}
                        src={photos[0].publicUrl}
                        alt={`Foto do report ${id}`}
                        className="object-cover w-full h-full cursor-pointer"
                        onClick={() => openModal(photos, 0)}
                      />
                      {photos.length > 1 && (
                        <div
                          onClick={() => openModal(photos, 0)}
                          className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer"
                        >
                          +{photos.length - 1} fotos
                        </div>
                      )}
                    </>
                  ) : (
                    <img
                      src="/placeholder-image.png"
                      alt="Sem foto"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex flex-col gap-4">
                  {/* Descrição */}
                  <p className="text-gray-800 font-medium text-base leading-snug">
                    {description}
                  </p>

                  {/* Usuário + Data */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{reporterName ?? "Desconhecido"}</span>
                    <span>{formatDate(createdAt)}</span>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-600">
                      Status
                    </label>
                    <Select
                      value={status ? status.toLowerCase() : "-"}
                      onValueChange={(status) => {
                        handleUpdateStatusAssetReport({ reportId: id, status });
                      }}
                    >
                      <SelectTrigger className="w-full rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sem-status">
                          ⚪ Sem Status
                        </SelectItem>
                        <SelectItem value="atuando">🟡 Atuando</SelectItem>
                        <SelectItem value="em-analise">
                          🔵 Em análise
                        </SelectItem>
                        <SelectItem value="finalizado">
                          🟢 Finalizado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )
          )}
      </section>

      {/* Modal de imagens */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={closeModal}
          >
            <X className="w-8 h-8" />
          </button>

          <button className="absolute left-4 text-white" onClick={prevPhoto}>
            <ChevronLeft className="w-10 h-10" />
          </button>

          <img
            src={currentPhotos[currentPhotoIndex].publicUrl}
            alt="Foto ampliada"
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
          />

          <button className="absolute right-4 text-white" onClick={nextPhoto}>
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </main>
  );
}
