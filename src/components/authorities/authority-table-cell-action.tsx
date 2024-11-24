"use client";
// import { AlertModal } from '@/components/modal/alert-modal';
import { Row } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { obfuscate } from "@/lib/endecode";
import { AuthorityDTO } from "@/types/authorities";

export function AuthorityTableRowActions({ row }: { row: Row<AuthorityDTO> }) {
  const router = useRouter();

  const authority = row.original;
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            className={
              authority.systemRole
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : ""
            }
            onClick={
              !authority.systemRole
                ? () =>
                    router.push(
                      `/portal/settings/authorities/${obfuscate(row.original.name!)}/edit`,
                    )
                : undefined
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className={
              authority.systemRole
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : ""
            }
            onClick={
              !authority.systemRole ? () => console.log("Open menu") : undefined
            }
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
