"use client";

import { ArrowDownAZ, ArrowUpAZ, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import LoadingPlaceholder from "@/components/shared/loading-place-holder";
import PaginationExt from "@/components/shared/pagination-ext";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { usePagePermission } from "@/hooks/use-page-permission";
import { searchWorkflows } from "@/lib/actions/workflows.action";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { WorkflowDTO } from "@/types/workflows";

export function WorkflowsView() {
  const [items, setItems] = useState<Array<WorkflowDTO>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [workflowSearchTerm, setWorkflowSearchTerm] = useState<
    string | undefined
  >(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const permissionLevel = usePagePermission();

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const fetchData = useCallback(async () => {
    setLoading(true);

    const query: QueryDTO = {
      filters: workflowSearchTerm
        ? [
            {
              field: "name",
              operator: "lk",
              value: workflowSearchTerm,
            },
          ]
        : [],
    };

    searchWorkflows(query, {
      page: currentPage,
      size: 10,
      sort: [
        {
          field: "name",
          direction: sortDirection,
        },
      ],
    })
      .then((pageResult) => {
        setItems(pageResult.content);
        setTotalElements(pageResult.totalElements);
        setTotalPages(pageResult.totalPages);
      })
      .finally(() => setLoading(false));
  }, [
    workflowSearchTerm,
    currentPage,
    sortDirection,
    setLoading,
    setItems,
    setTotalElements,
    setTotalPages,
  ]);

  const handleSearchTeams = useDebouncedCallback((userName: string) => {
    const params = new URLSearchParams(searchParams);
    if (userName) {
      params.set("name", userName);
    } else {
      params.delete("name");
    }
    setWorkflowSearchTerm(userName);
    replace(`${pathname}?${params.toString()}`);
  }, 2000);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getWorkflowViewRoute = (workflow: WorkflowDTO) => {
    if (workflow.ownerId === null) {
      return `/portal/settings/workflows/${obfuscate(workflow.id)}`;
    }
    return `/portal/teams/${obfuscate(workflow.ownerId)}/workflows/${obfuscate(workflow.id)}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between">
        <Heading
          title={`Workflows (${totalElements})`}
          description="Centralize and manage all workflows effortlessly with clear visibility, ticket types, and descriptions at a glance."
        />

        <div className="flex space-x-4">
          <Input
            className="w-[18rem]"
            placeholder="Search workflow names ..."
            onChange={(e) => {
              handleSearchTeams(e.target.value);
            }}
            defaultValue={searchParams.get("name")?.toString()}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={toggleSortDirection}>
                {sortDirection === "asc" ? <ArrowDownAZ /> : <ArrowUpAZ />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sortDirection === "asc"
                ? "Sort workflow names A → Z"
                : "Sort workflow names Z → A"}
            </TooltipContent>
          </Tooltip>
          {PermissionUtils.canWrite(permissionLevel) && (
            <Link
              href={"/portal/settings/workflows/new/edit"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> New workflow
            </Link>
          )}
        </div>
      </div>
      <Separator />
      {loading ? (
        <LoadingPlaceholder
          message="Loading workflows..."
          skeletonCount={3}
          skeletonWidth="28rem"
        />
      ) : (
        <div className="flex flex-row flex-wrap gap-4 content-around">
          {items?.map((workflow) => (
            <div
              key={workflow.id}
              className="w-[28rem] flex flex-col gap-4 border border-gray-200 px-4 py-4 rounded-2xl relative"
            >
              {/* Ribbon for visibility */}
              {workflow.visibility === "PUBLIC" && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-tr-2xl rounded-bl-md shadow-md">
                  PUBLIC
                </div>
              )}
              {workflow.visibility === "PRIVATE" && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-tr-2xl rounded-bl-md shadow-md">
                  PRIVATE
                </div>
              )}
              {workflow.visibility === "TEAM" && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-tr-2xl rounded-bl-md shadow-md">
                  TEAM
                </div>
              )}

              <div>
                <Link
                  href={`${getWorkflowViewRoute(workflow)}`}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "w-full text-left block px-0",
                  )}
                >
                  {workflow.name}
                </Link>
              </div>
              <div className="text-sm">
                Ticket type:{" "}
                <Badge variant="secondary">{workflow.requestName}</Badge>
              </div>
              <div className="text-sm">{workflow.description}</div>
            </div>
          ))}
        </div>
      )}
      <PaginationExt
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default WorkflowsView;