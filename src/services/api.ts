import { getCookies } from "@/actions/cookies";
import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APIURL,
});

api.interceptors.request.use(async (config) => {
  const token = await getCookies("@smartCondo:token")
  config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => {
  return Promise.reject(error)
})

