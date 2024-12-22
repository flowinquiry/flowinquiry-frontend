"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Ellipsis,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import { EntitiesDeleteDialog } from "@/components/shared/entity-delete-dialog";
import LoadingPlaceHolder from "@/components/shared/loading-place-holder";
import PaginationExt from "@/components/shared/pagination-ext";
import DefaultTeamLogo from "@/components/teams/team-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { usePagePermission } from "@/hooks/use-page-permission";
import { deleteTeams, searchTeams } from "@/lib/actions/teams.action";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { useError } from "@/providers/error-provider";
import { Filter, QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { TeamDTO } from "@/types/teams";

export const TeamList = () => {
  const router = useRouter();
  const { setError } = useError();
  const { data: session } = useSession();
  const [items, setItems] = useState<Array<TeamDTO>>([]);
  const [teamSearchTerm, setTeamSearchTerm] = useState<string | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterUserTeamsOnly, setFilterUserTeamsOnly] = useState(true);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamDTO | null>(null);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const permissionLevel = usePagePermission();

  const fetchData = async () => {
    setLoading(true);
    try {
      const filters: Filter[] = [];
      if (teamSearchTerm) {
        filters.push({
          field: "name",
          operator: "lk",
          value: teamSearchTerm,
        });
      }
      if (filterUserTeamsOnly) {
        filters.push({
          field: "users.id",
          operator: "eq",
          value: Number(session?.user?.id!),
        });
      }

      const query: QueryDTO = {
        filters,
      };

      const pageResult = await searchTeams(
        query,
        {
          page: currentPage,
          size: 10,
          sort: [
            {
              field: "name",
              direction: sortDirection,
            },
          ],
        },
        setError,
      );
      if (pageResult) {
        setItems(pageResult.content);
        setTotalElements(pageResult.totalElements);
        setTotalPages(pageResult.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTeams = useDebouncedCallback((teamName: string) => {
    const params = new URLSearchParams(searchParams);
    if (teamName) {
      params.set("name", teamName);
    } else {
      params.delete("name");
    }
    setTeamSearchTerm(teamName);
    replace(`${pathname}?${params.toString()}`);
  }, 2000);

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    fetchData();
  }, [teamSearchTerm, currentPage, sortDirection, filterUserTeamsOnly]);

  const showDeleteTeamConfirmationDialog = (team: TeamDTO) => {
    setSelectedTeam(team);
    setDialogOpen(true);
  };

  const deleteTeam = async (ids: number[]) => {
    await deleteTeams(ids, setError);
    fetchData();
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between items-center">
        <Heading
          title={`Teams (${totalElements})`}
          description="Manage teams"
        />
        <div className="flex space-x-4">
          <Input
            className="w-[18rem]"
            placeholder="Search teams ..."
            onChange={(e) => {
              handleSearchTeams(e.target.value);
            }}
            defaultValue={searchParams.get("name")?.toString()}
          />
          <Button variant="outline" onClick={toggleSortDirection}>
            {sortDirection === "asc" ? <ArrowDownAZ /> : <ArrowUpAZ />}
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="user-teams-only"
              checked={filterUserTeamsOnly}
              onCheckedChange={(checked) => setFilterUserTeamsOnly(!!checked)}
            />
            <label htmlFor="user-teams-only" className="text-sm">
              My Teams Only
            </label>
          </div>
          {PermissionUtils.canWrite(permissionLevel) && (
            <Link
              href={"/portal/teams/new/edit"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> New Team
            </Link>
          )}
        </div>
      </div>
      <Separator />
      {loading ? (
        <div className="flex justify-center py-4">
          <LoadingPlaceHolder message="Loading teams ..." />
        </div>
      ) : (
        <>
          <div className="flex flex-row flex-wrap gap-4">
            {items?.map((team) => (
              <div
                key={team.id}
                className="relative w-[24rem] flex flex-row gap-4 border border-gray-200 rounded-2xl"
              >
                <div className="px-4 py-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="size-24 cursor-pointer">
                          <AvatarImage
                            src={
                              team.logoUrl
                                ? `/api/files/${team.logoUrl}`
                                : undefined
                            }
                            alt="@flowinquiry"
                          />
                          <AvatarFallback>
                            <DefaultTeamLogo />
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>{team.slogan}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div>
                  <Button variant="link" asChild className="px-0">
                    <Link href={`/portal/teams/${obfuscate(team.id)}`}>
                      {team.name} ({team.usersCount})
                    </Link>
                  </Button>
                  <div>{team.description}</div>
                </div>
                {PermissionUtils.canWrite(permissionLevel) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Ellipsis className="cursor-pointer absolute top-2 right-2 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[14rem]">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/portal/teams/${obfuscate(team.id)}/edit`,
                          )
                        }
                      >
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      {PermissionUtils.canAccess(permissionLevel) && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => showDeleteTeamConfirmationDialog(team)}
                        >
                          <Trash /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
        </>
      )}
      {isDialogOpen && selectedTeam && (
        <EntitiesDeleteDialog
          entities={[selectedTeam]}
          entityName="Team"
          deleteEntitiesFn={deleteTeam}
          isOpen={isDialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => {
            setDialogOpen(false);
          }}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};
