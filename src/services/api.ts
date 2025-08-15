import { getCookies } from "@/actions/cookies";
import axios from "axios"

export const api = axios.create({
  baseURL: 'http://localhost:3030',
});

api.interceptors.request.use(async (config) => {
  const token = await getCookies("@smartCondo:token")
  config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => {
  return Promise.reject(error)
})

