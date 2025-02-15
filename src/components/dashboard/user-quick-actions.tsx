"use client";

import { CheckCircle, ClipboardList, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserQuickAction() {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 cursor-pointer"
        >
          <ClipboardList className="w-5 h-5" />
          <span>My Tickets</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onSelect={() => router.push("/portal/my/tickets?ticketType=reported")}
        >
          <FileText className="w-4 h-4" /> My Reported Tickets
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onSelect={() => router.push("/portal/my/tickets?ticketType=assigned")}
        >
          <CheckCircle className="w-4 h-4" /> My Assigned Tickets
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
