"use client";

import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
              <Button variant="link" className="px-0 text-2xl">
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
            <div>
              Requested User:{" "}
              <Button variant="link" className="px-0">
                <Link
                  href={`/portal/users/${request.requestUserId}`}
                  className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                >
                  {request.requestUserName}
                </Link>
              </Button>
            </div>
            <div>
              Assignee:{" "}
              <Button variant="link" className="px-0">
                <Link
                  href={`/portal/users/${request.assignUserId}`}
                  className="text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"
                >
                  {request.assignUserName}
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TeamRequestDetailSheet;
