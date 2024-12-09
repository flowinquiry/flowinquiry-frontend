import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (!session) {
    console.warn("No authentication. Redirect to the login page ...");
    redirect("/login");
  } else {
    redirect("/portal");
  }
}
