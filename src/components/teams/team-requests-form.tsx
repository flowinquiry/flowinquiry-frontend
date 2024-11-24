"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormProps } from "@/components/ui/ext-form";
import { TeamRequestDTO, TeamRequestDTOSchema } from "@/types/teams";

export const TeamRequestForm = ({ initialData }: FormProps<TeamRequestDTO>) => {
  const router = useRouter();

  const form = useForm<TeamRequestDTO>({
    resolver: zodResolver(TeamRequestDTOSchema),
    defaultValues: initialData,
  });

  return <div>Team Request form</div>;
};
