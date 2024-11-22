"use client";

import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TeamRequestType } from "@/types/teams";

type RequestDetailsProps = {
  open: boolean;
  onClose: () => void;
  request: TeamRequestType;
};

const TeamRequestDetailSheet: React.FC<RequestDetailsProps> = ({
  open,
  onClose,
  request,
}) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[50rem] h-full">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>
              <Button variant="link" className="px-0">
                <Link href="">{request.requestTitle}</Link>
              </Button>
            </SheetTitle>
            <SheetDescription>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: request.requestDescription!,
                }}
              />
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Requested User
              </Label>
              <Label className="col-span-3">
                <Button variant="link" className="px-0">
                  <Link
                    href={`/portal/users/${request.requestUserId}`}
                    className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                  >
                    {request.requestUserName}
                  </Link>
                </Button>
              </Label>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Assignee
              </Label>
              <Label className="col-span-3">
                <Button variant="link" className="px-0">
                  <Link
                    href={`/portal/users/${request.assignUserId}`}
                    className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                  >
                    {request.assignUserName}
                  </Link>
                </Button>
              </Label>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TeamRequestDetailSheet;
