"use client";

import React, { use, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/date-picker";
import { Check, TrashIcon } from "lucide-react";
import { Apartment } from "@/api/fetch-apartaments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUnitWorks } from "@/api/create-unit-works";
import { WorkUnit } from "@/api/fetch-unit-works";
import { fetchEmployesUnitWorks } from "@/api/fetch-employees-unit-works";
import { addEmployeeUnitWork } from "@/api/add-employee-unit-work";
import { deleteEmployeeUnitWorks } from "@/api/delete-employee.unit-work";
import { updateGenericRegister } from "@/api/update-generic.register";

const workOrderSchema = z.object({
  apartment_id: z.string().min(1, "Selecione o apartamento"),
  status_id: z.string().min(1, "Selecione o status"),
  forecast_date: z.date(),
  description: z.string().min(1, "Descrição obrigatória"),
  has_art_rrt: z.boolean(),
  observations: z.string().optional(),
  attachments: z.any().optional(),

  employees: z.array(
    z.object({
      employeeId: z.number().optional().nullable(),
      full_name: z.string().min(1, "Nome obrigatório"),
      cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
    })
  ),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;

export type WorkDataFormDataUpdate = Omit<
  WorkOrderFormData,
  "employees" | "apartment_id"
> & {
  apartament_id: string;
};

export function ModalActionMaintenance({
  apartments,
  statusOptions,
  work,
  children,
  isOpen,
  setModalIsOpen,
  setWork,
}: {
  apartments?: Apartment[];
  statusOptions?: { id: number; name: string }[];
  work?: WorkUnit;
  children?: React.ReactNode;
  isOpen: boolean;
  setWork?: React.Dispatch<React.SetStateAction<WorkUnit | undefined>>;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      has_art_rrt: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const employees = watch("employees");

  const queryClient = useQueryClient();

  const title = work ? "Editar Solicitação" : "Criar Solicitação";

  const { data: emplooyesQuery } = useQuery({
    queryKey: ["emplooyes", work?.id, "form"],
    queryFn: () => fetchEmployesUnitWorks(work!.id),
    enabled: !!work?.id,
  });

  const { mutateAsync: handleCreateUnitWorks } = useMutation({
    mutationFn: (form: FormData) => createUnitWorks({ form }),
  });

  const { mutateAsync: handleCreateEmployee } = useMutation({
    mutationFn: addEmployeeUnitWork,
  });

  const { mutateAsync: handleDeleteEmployee } = useMutation({
    mutationFn: deleteEmployeeUnitWorks,
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["emplooyes", work?.id, "form"],
      });
    },
  });

  const { mutateAsync: handleUpdateRegister } = useMutation({
    mutationFn: updateGenericRegister<WorkDataFormDataUpdate>,
  });

  async function onSubmit(data: WorkOrderFormData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "employees") {
        formData.append("employees", JSON.stringify(value));
        return;
      }

      if (key === "attachments" && value?.length) {
        Array.from(value).forEach((file: any) =>
          formData.append("attachments", file)
        );
        return;
      }

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });

    const actionType = work ? "edit" : "create";
    if (actionType === "edit") {
      console.log("entrei aqui");

      const apartament_id = data.apartment_id;
      delete data.employees;
      delete data.apartment_id;
      delete data.attachments;
      await handleUpdateRegister({
        registerId: work!.id,
        tableName: "works_units",
        data: {
          ...data,
          apartament_id,
        },
      });
    } else {
      await handleCreateUnitWorks(formData);
    }
    closeRef.current?.click();
    reset();
    setSelectedFiles([]);
    queryClient.invalidateQueries({
      exact: false,
      queryKey: ["works"],
    });
  }

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);

    if (filesArray.length + selectedFiles.length > 5) {
      alert("Máximo de 5 arquivos permitidos");
      return;
    }

    const updatedFiles = [...selectedFiles, ...filesArray];
    setSelectedFiles(updatedFiles);

    setValue("attachments", updatedFiles as any);
  }

  function setInitialValues(workUnit: WorkUnit) {
    setValue("apartment_id", workUnit.apartamentId.toString());
    setValue("description", workUnit.description.toString());
    setValue("forecast_date", new Date(workUnit.forecastDate));
    setValue("has_art_rrt", workUnit.hasArtRrt);
    setValue("observations", workUnit.observations);
    setValue("status_id", workUnit.statusId.toString());
    setValue("employees", []);
  }

  useEffect(() => {
    if (work) {
      setInitialValues(work);
    } else {
      setValue("employees", [{ employeeId: null, full_name: "", cpf: "" }]);
    }
  }, [work?.id]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (work) {
      const emplooyesAlreadyInMemory = getValues("employees").filter(
        ({ employeeId }) => !employeeId
      );
      setValue("employees", [
        ...emplooyesQuery?.map((employee: any) => ({
          ...employee,
          employeeId: employee.id,
        })),
        ...emplooyesAlreadyInMemory,
      ]);
    }
  }, [emplooyesQuery]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setModalIsOpen(open);
        reset({
          apartment_id: "",
          description: "",
          status_id: "",
          has_art_rrt: false,
          observations: "",
          forecast_date: new Date(),
          attachments: [],
          employees: [{ employeeId: null, full_name: "", cpf: "" }],
        });
        setWork?.(undefined);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[750px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>Preencha os dados abaixo</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Apartamento */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Apartamento</Label>
            <div className="col-span-3">
              <Controller
                name="apartment_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {apartments?.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.apartmentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <div className="col-span-3">
              <Controller
                name="status_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions?.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Data prevista */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data prevista</Label>
            <div className="col-span-3">
              <Controller
                name="forecast_date"
                control={control}
                render={({ field }) => (
                  <DatePicker date={field.value} setDate={field.onChange} />
                )}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Descrição</Label>
            <Textarea {...register("description")} className="col-span-3" />
          </div>

          {/* ART / RRT */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">ART/RRT</Label>
            <Controller
              name="has_art_rrt"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Observações */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Observações</Label>
            <Textarea {...register("observations")} className="col-span-3" />
          </div>

          {/* Funcionários */}
          <fieldset className="border rounded-xl p-4 space-y-4">
            <legend className="px-2 text-sm font-semibold">Funcionários</legend>

            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-11 gap-2 items-end"
                >
                  <Input
                    placeholder="Nome completo"
                    {...register(`employees.${index}.full_name`)}
                    className="col-span-5"
                  />
                  <Input
                    placeholder="CPF"
                    {...register(`employees.${index}.cpf`)}
                    className="col-span-4"
                  />

                  {work?.id && !field.employeeId && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={async () => {
                        const fullName = getValues(
                          `employees.${index}.full_name`
                        );
                        const cpf = getValues(`employees.${index}.cpf`);
                        await handleCreateEmployee({
                          fullName,
                          cpf,
                          workId: work.id,
                        });
                        remove(index);
                        queryClient.invalidateQueries({
                          queryKey: ["emplooyes", work?.id, "form"],
                        });
                      }}
                    >
                      <Check className="text-green-500" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={async () => {
                      const modalType = work ? "edit" : "create";

                      if (modalType === "create") {
                        const canRemove = employees.length > 1;
                        if (!canRemove) return;
                        remove(index);
                      }

                      if (modalType === "edit") {
                        const canRemove =
                          employees.filter((employee) => employee.employeeId)
                            .length > 1;

                        const isInMemoryEmployee = employees[index].employeeId
                          ? false
                          : true;

                        if (isInMemoryEmployee) {
                          remove(index);
                          return;
                        }

                        if (canRemove) {
                          await handleDeleteEmployee(field.employeeId!);
                          remove(index);
                        }
                      }
                    }}
                  >
                    <TrashIcon className="text-red-500" />
                  </Button>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ full_name: "", cpf: "" })}
            >
              + Adicionar funcionário
            </Button>
          </fieldset>

          {/* Anexos */}
          {!work?.id && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Documentos</Label>

              <div className="col-span-3 space-y-2">
                {/* Área clicável */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-md h-[90px] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition"
                >
                  <span className="text-xl">📎</span>
                  <span className="text-sm text-muted-foreground">
                    Clique para selecionar documentos (máx. 5)
                  </span>
                </div>

                {/* Input escondido */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                />

                {/* Lista de arquivos */}
                {selectedFiles.length > 0 && (
                  <ul className="text-sm space-y-1">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-muted px-3 py-1 rounded"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          className="text-red-500 text-xs"
                          onClick={() => {
                            const updated = selectedFiles.filter(
                              (_, i) => i !== index
                            );
                            setSelectedFiles(updated);
                            setValue("attachments", updated as any);
                          }}
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button ref={closeRef} variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
