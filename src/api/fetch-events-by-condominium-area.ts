import { api } from "@/services/api"

interface FetchEventsByCondominiumAreaProps {
  condominiumAreaIdSelected: string,
  date: string;
}


export interface DayWithEvents {
  "dayNumber": number
  "dayName": string
  "date": string
  "events": Event[]
}

export type Event = {
  "id": number
  "eventDate": string
  "startTime": string
  "endTime": string
  "apartmentId": number
  "condominiumAreaId": number
  "createdAt": Date
  spaceEventGuests: {
    id: number;
    name: string;
    cpf: string;
  }[]
}



export async function fetchEventsByCondominiumArea({
  condominiumAreaIdSelected,
  date
}: FetchEventsByCondominiumAreaProps): Promise<DayWithEvents[]> {
  const response = await api.get(`structure/management-spaces/events/${condominiumAreaIdSelected}/${date}`)
  return response.data;
}