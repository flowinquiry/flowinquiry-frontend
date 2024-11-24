"use client";
// import { AlertModal } from '@/components/modal/alert-modal';
import { Row } from "@tanstack/react-table";
import { Edit, MoreHorizontal } from "lucide-react";
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
import { ConTactDTO } from "@/types/contacts";

export function DataTableRowActions({ row }: { row: Row<ConTactDTO> }) {
  const router = useRouter();

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
            onClick={() =>
              router.push(`/portal/contacts/${obfuscate(row.original.id)}/edit`)
            }
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          {/*<DropdownMenuItem onClick={() => setOpen(true)}>*/}
          {/*  <Trash className="mr-2 h-4 w-4" /> Delete*/}
          {/*</DropdownMenuItem>*/}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
