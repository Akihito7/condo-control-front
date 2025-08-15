'use server'

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers"


interface SetCookiesProps {
  key: string;
  value: string;
  options?: Partial<ResponseCookie>
}

export async function setCookies({ key, value, options }: SetCookiesProps) {
  const cookieStore = await cookies();
  cookieStore.set(key, value, options)
}

export async function getCookies(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function deleteCookies(key: string) {
  const cookieStore = await cookies();
  cookieStore.delete(key)
}