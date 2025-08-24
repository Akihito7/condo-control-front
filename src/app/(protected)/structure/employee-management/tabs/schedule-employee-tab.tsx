import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactSelect from "react-select";
import z from "zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Employee } from "@/api/fetch-employees-structure";
import { addHours, format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

interface ScheduleEmployeeTabProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  handleUpdateEmployeeSchedule: (data: any) => Promise<void>;
  scheduleEmployees: any;
  employees: Employee[] | undefined;
}

const scheduleItemSchema = z.object({
  id: z.number(),
  shift: z.string().optional(),
  data: z.array(
    z
      .object({
        workAreaId: z.number().optional().nullable(),
        employeeIds: z
          .array(z.number().optional().nullable())
          .optional()
          .nullable(),
      })
      .optional()
  ),
});

const scheduleSchema = z.object({
  schedule: z.array(scheduleItemSchema),
});

export function ScheduleEmployeeTab({
  date,
  setDate,
  handleUpdateEmployeeSchedule,
  scheduleEmployees,
  employees,
}: ScheduleEmployeeTabProps) {
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(scheduleSchema),
  });

  const [shiftsIncludedToBatchEdit, setShitsIncludedToBatchEdit] = useState<
    Date[]
  >([]);

  const { fields } = useFieldArray({
    control,
    name: "schedule",
  });

  const queryClient = useQueryClient();

  async function onSubmit(data: any) {
    await handleUpdateEmployeeSchedule(data);
    setIsEditingSchedule(false);
    setShitsIncludedToBatchEdit([]);
    queryClient.invalidateQueries({
      queryKey: ["schedule-employees"],
      exact: false,
    });
  }

  useEffect(() => {
    const mapped = scheduleEmployees?.map((schedule: any) => ({
      id: schedule.id,
      shift: schedule.date,
      data: schedule?.data?.map((item: any) => ({
        workAreaId: item.workAreaId,
        employeeIds: item.employeeIds,
      })),
    }));
    reset({ schedule: mapped });
  }, [scheduleEmployees]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:items-end md:flex-row">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Periodo
          </label>
          <DatePicker date={date} setDate={setDate} />
        </div>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Escala de Funcionários
          </h2>
          {isEditingSchedule && (
            <div className="space-x-2">
              <Button
                variant="destructive"
                onClick={() => {
                  setIsEditingSchedule(false);
                  setShitsIncludedToBatchEdit([]);
                  const mapped = scheduleEmployees?.map((schedule: any) => ({
                    id: schedule.id,
                    shift: schedule.date,
                    data: schedule?.data?.map((item: any) => ({
                      workAreaId: item.workAreaId,
                      employeeIds: item.employeeIds,
                    })),
                  }));
                  reset({ schedule: mapped });
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
              >
                Salvar Escala
              </Button>
            </div>
          )}

          {!isEditingSchedule && (
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingSchedule(true);
              }}
            >
              Editar Escala
            </Button>
          )}
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded overflow-x-auto">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Portaria</TableHead>
                <TableHead>Limpeza</TableHead>
                <TableHead>Jardinagem</TableHead>
                <TableHead>Administração</TableHead>
                <TableHead>Manutenção</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const getDataIndexByWorkAreaId = (workAreaId: number) =>
                  field.data?.findIndex(
                    (d: any) => d.workAreaId === workAreaId
                  );

                const ordinanceIndex = getDataIndexByWorkAreaId(1);
                const cleanerIndex = getDataIndexByWorkAreaId(2);
                const maintenanceIndex = getDataIndexByWorkAreaId(3);
                const administrationIndex = getDataIndexByWorkAreaId(4);
                const gardeningIndex = getDataIndexByWorkAreaId(5);
                const start = new Date(field.shift!);
                const localStart = addHours(start, 3);
                const end = addHours(localStart, 1);
                const formattedTime = `${format(
                  localStart,
                  "HH:mm"
                )} - ${format(end, "HH:mm")}`;

                const getOptions = (areaId: number) =>
                  employees
                    ?.filter(
                      (emp) => emp.workAreaId === areaId && emp.statusId !== 2
                    )
                    .map((emp) => ({
                      label: emp.name,
                      value: emp.id,
                    })) || [];

                const renderMultiSelect = (
                  areaId: number,
                  areaIndex: number | undefined
                ) => {
                  if (areaIndex === undefined || areaIndex === -1) return null;
                  return (
                    <Controller
                      control={control}
                      name={`schedule.${index}.data.${areaIndex}.employeeIds`}
                      render={({ field }) => (
                        <ReactSelect
                          isDisabled={!isEditingSchedule}
                          styles={{
                            multiValue: (base) => ({
                              ...base,
                              marginRight: 8,
                              display: "inline-flex",
                              flexWrap: "nowrap",
                              maxWidth: "100%",
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              cursor: "pointer",
                            }),
                            control: (base) => ({
                              ...base,
                              flexWrap: "nowrap",
                              overflowX: "auto",
                              minHeight: "38px",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              display: "flex",
                              flexWrap: "nowrap",
                              overflowX: "auto",
                              gap: "4px",
                            }),
                          }}
                          isMulti
                          className="min-w-[200px] "
                          {...field}
                          value={getOptions(areaId).filter((option: any) =>
                            (field.value || []).includes(option.value)
                          )}
                          onChange={(selectedOptions) => {
                            const shiftIsIncludedInBatchEdit =
                              shiftsIncludedToBatchEdit.some(
                                (shift) =>
                                  shift === (fields[index].shift as any)
                              );
                            if (!shiftIsIncludedInBatchEdit) {
                              field.onChange(
                                selectedOptions.map((opt) => opt.value)
                              );
                            } else {
                              shiftsIncludedToBatchEdit.forEach(
                                (shiftBatchEdit) => {
                                  const indexOnField = fields.findIndex(
                                    (field) =>
                                      field.shift === (shiftBatchEdit as any)
                                  );
                                  if (indexOnField !== -1) {
                                    const fieldToUpdate = fields[indexOnField];
                                    const areaIndexForField =
                                      fieldToUpdate.data?.findIndex(
                                        (d: any) => d.workAreaId === areaId
                                      );

                                    if (
                                      areaIndexForField !== undefined &&
                                      areaIndexForField !== -1
                                    ) {
                                      setValue(
                                        `schedule.${indexOnField}.data.${areaIndexForField}.employeeIds`,
                                        selectedOptions.map((opt) => opt.value)
                                      );
                                    }
                                  }
                                }
                              );
                            }
                          }}
                          placeholder="Selecione..."
                          options={getOptions(areaId)}
                        />
                      )}
                    />
                  );
                };

                return (
                  <TableRow key={field.shift}>
                    <TableCell className="text-center">
                      <input
                        checked={shiftsIncludedToBatchEdit.includes(
                          field.shift as any
                        )}
                        disabled={!isEditingSchedule}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          if (checked) {
                            setShitsIncludedToBatchEdit((prev) => [
                              ...prev,
                              field.shift as any,
                            ]);
                          } else {
                            const newShiftsWithoutCurrent =
                              shiftsIncludedToBatchEdit.filter(
                                (shift) => shift !== (field.shift as any)
                              );
                            setShitsIncludedToBatchEdit(
                              newShiftsWithoutCurrent
                            );
                          }
                        }}
                        type="checkbox"
                        className="h-5 w-5 text-blue-600 transition duration-200 ease-in-out rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>{formattedTime}</TableCell>

                    <TableCell>
                      {renderMultiSelect(1, ordinanceIndex)}
                    </TableCell>
                    <TableCell>{renderMultiSelect(2, cleanerIndex)}</TableCell>
                    <TableCell>
                      {renderMultiSelect(5, gardeningIndex)}
                    </TableCell>
                    <TableCell>
                      {renderMultiSelect(4, administrationIndex)}
                    </TableCell>
                    <TableCell>
                      {renderMultiSelect(3, maintenanceIndex)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
