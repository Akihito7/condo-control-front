import { getCookies } from "@/actions/cookies";
import axios from "axios"

import { cookies } from "next/headers";

export const api = axios.create({
  baseURL: 'https://backend-condo-control-x2yd.vercel.app',
});

api.interceptors.request.use(async (config) => {
  const token = await getCookies("@smartCondo:token")
  config.headers.Authorization = `Bearer ${token}`
  return config
}, (error) => {
  return Promise.reject(error)
})

