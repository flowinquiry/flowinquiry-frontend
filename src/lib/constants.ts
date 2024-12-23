import { env } from "next-runtime-env";

export const API_URL = env("NEXT_PUBLIC_API_URL");
export const BACK_END_URL = process.env.BACK_END_URL;
