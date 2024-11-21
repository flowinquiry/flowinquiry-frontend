import Link from "next/link";
import React, { useEffect, useState } from "react";

import PaginationExt from "@/components/shared/pagination-ext";
import TruncatedHtmlLabel from "@/components/shared/truncate-html-label";
import { Button } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { searchTeamRequests } from "@/lib/actions/teams-request.action";
import { obfuscate } from "@/lib/endecode";
import { TeamRequestType, TeamType } from "@/types/teams";

const TeamRequestsStatusView = ({ entity: team }: ViewProps<TeamType>) => {
  const [requests, setRequests] = useState<TeamRequestType[]>([]);
  const [openRequestView, setOpenRequestView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchData = async () => {
    setLoading(true);
    try {
      const pageResult = await searchTeamRequests([], {
        page: currentPage,
        size: 10,
      });
      setRequests(pageResult.content);
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1">
      <div>
        {requests.map((request) => (
          <div className="odd:bg-gray-100 even:bg-blue-100 p-4 hover:bg-blue-300">
            <Button
              variant="link"
              className="px-0"
              onClick={() => setOpenRequestView(true)}
            >
              {request.requestTitle}
            </Button>
            <TruncatedHtmlLabel
              htmlContent={request.requestDescription!}
              wordLimit={400}
            />
            <Sheet
              open={openRequestView}
              onOpenChange={() => setOpenRequestView(false)}
            >
              <SheetContent className="w-[50rem] sm:w-full">
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
                          href={`/portal/users/${obfuscate(request.requestUserId)}`}
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
                          href={`/portal/users/${obfuscate(request.assignUserId)}`}
                        >
                          {request.assignUserName}
                        </Link>
                      </Button>
                    </Label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ))}
      </div>
      <PaginationExt
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </div>
  );
};

export default TeamRequestsStatusView;
