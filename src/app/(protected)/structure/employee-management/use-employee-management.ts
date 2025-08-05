import { deleteEmployeeStructure } from "@/api/delete-employee-structure";
import { fetchEmployeeRoles } from "@/api/fetch-employee-roles";
import { fetchEmployeeSchedule } from "@/api/fetch-employee-schedule";
import { fetchEmployeeStatus } from "@/api/fetch-employee-status";
import { fetchEmployeesStructure } from "@/api/fetch-employees-structure";
import { fetchWorkAreas } from "@/api/fetch-work-areas";
import { updateEmployeeSchedule } from "@/api/update-employee-schedule";
import { useUserContext } from "@/providers/use-user-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns"

interface UseEmployeeManagementProps {
  date: Date
}
export function useEmployeeManagement({ date }: UseEmployeeManagementProps) {
  const {
    user
  } = useUserContext();

  const condominiumId = user.condominiumId;
  const dateFormatted = format(date, 'dd-MM-yyyy')
  const queryClient = useQueryClient();


  const { data: employeeRoles, status: employeeRolesStatus } = useQuery({
    queryKey: ['employee-roles'],
    queryFn: fetchEmployeeRoles
  })

  const { data: employeeStatus, status: employeeStatusStatus } = useQuery({
    queryKey: ['employee-status'],
    queryFn: fetchEmployeeStatus
  })

  const { data: workAreas, status: workAreasStatus } = useQuery({
    queryKey: ['work-areas'],
    queryFn: fetchWorkAreas
  })

  const { data: employees, status: employeesStatus } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => fetchEmployeesStructure({ condominiumId }),
    enabled: !!condominiumId
  })

  const { data: scheduleEmployees, status: scheduleEmployeesStatus } = useQuery({
    queryKey: ['schedule-employees', dateFormatted],
    queryFn: async () => fetchEmployeeSchedule({ condominiumId, date: dateFormatted }),
    enabled: !!condominiumId
  })

  const { mutateAsync: handleDeleteEmployee } = useMutation({
    mutationFn: async (employeeId: number) => deleteEmployeeStructure(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['employees']
      })
    }
  })

  const {
    mutateAsync: handleUpdateEmployeeSchedule
  } = useMutation({
    mutationFn: (data: any) => updateEmployeeSchedule(data, condominiumId)
  })

  return {
    employeeRoles,
    employeeRolesStatus,
    employeeStatus,
    employeeStatusStatus,
    workAreas,
    workAreasStatus,
    employees,
    employeesStatus,
    handleDeleteEmployee,
    scheduleEmployees,
    handleUpdateEmployeeSchedule
  }
}