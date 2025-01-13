"use client";

import { CircleUserRound, Info, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import AppLogo from "@/components/app-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BASE_URL } from "@/lib/constants";
import { UserAvatar } from "@/components/shared/avatar-display";

export function UserNav() {
  const { data: session } = useSession();

  return (
    <Dialog>
      <DropdownMenu>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="relative h-8 w-8 rounded-full"
                >
                  <UserAvatar
                    imageUrl={session?.user?.imageUrl}
                    size="h-8 w-8"
                  />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {session?.user?.firstName} {session?.user?.lastName}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session?.user?.firstName} {session?.user?.lastName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/portal/profile" className="flex items-center">
                <CircleUserRound className="w-4 h-4 mr-3 text-muted-foreground" />
                Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DialogTrigger asChild>
              <DropdownMenuItem className="hover:cursor-pointer">
                <Info className="w-4 h-4 mr-3 text-muted-foreground" />
                About
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => signOut({ redirectTo: BASE_URL, redirect: true })}
          >
            <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader className="flex items-center space-x-4">
          <div>
            <AppLogo size={100} />
          </div>

          <div>
            <DialogTitle className="text-2xl font-bold">
              FlowInquiry
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              FlowInquiry is a powerful request management solution for teams.
              It empowers organizations to track, manage, and customize customer
              inquiries through flexible workflows, enhancing collaboration and
              productivity.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Footer */}
        <div className="mt-2 flex justify-between items-center border-t pt-2">
          {/* Copyright and Year */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} FlowInquiry. All rights reserved.
          </div>

          {/* Website Link */}
          <a
            href="https://www.flowinquiry.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            flowinquiry.io
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
