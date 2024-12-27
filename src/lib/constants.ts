import { env } from "next-runtime-env";

export const BASE_URL = env("NEXT_PUBLIC_BASE_URL");
export const BACK_END_URL = process.env.BACK_END_URL;
