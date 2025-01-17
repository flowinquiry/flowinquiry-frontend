import { env } from "next-runtime-env";

export const BASE_URL = env("NEXT_PUBLIC_BASE_URL");
export const BACK_END_URL = process.env.BACK_END_URL;
export const ENABLE_SOCIAL_LOGIN =
  process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN?.toLowerCase() === "true" ||
  false;
