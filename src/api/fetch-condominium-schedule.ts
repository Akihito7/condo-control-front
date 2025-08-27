import { api } from "@/services/api";

interface FetchCondominiumScheduleProps {
  date: string;
  condominiumId: number;
}

interface Event {
  id: number;
  title: string;
  description: string | null;
  condominiumId: number;
  eventTypeId: number | null;
  startTime: string;   
  endTime: string;     
  createdAt: string;   
  updatedAt: string | null;
  createdBy: string | null;
}

export interface DaySchedule {
  date : string;
  dayName: string;
  dayNumber: number;  
  events: Event[];
}


export async function fetchCondominiumSchedule({
  condominiumId,
  date
}: FetchCondominiumScheduleProps): Promise<DaySchedule[]> {
  const response = await api.get(`communication/schedule/${condominiumId}/${date}`);
  return response.data;
}