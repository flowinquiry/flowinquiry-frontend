"use client";

import { ClipboardList } from "lucide-react";
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
          <span>My Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => router.push("/portal/my/tickets")}
        >
          My reported tickets
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => console.log("Navigate to My Open Tickets")}
        >
          My open tickets
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => console.log("Navigate to My Closed Tickets")}
        >
          My closed tickets
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
