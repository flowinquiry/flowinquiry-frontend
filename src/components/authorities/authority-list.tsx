"use client";

import { Ellipsis, Plus, Shield, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import PaginationExt from "@/components/shared/pagination-ext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  deleteAuthority,
  getAuthorities,
} from "@/lib/actions/authorities.action";
import { obfuscate } from "@/lib/endecode";
import { AuthorityDTO } from "@/types/authorities";
import { PermissionUtils } from "@/types/resources";

export function AuthoritiesView() {
  const router = useRouter();
  const permissionLevel = usePagePermission();

  const [authorities, setAuthorities] = useState<Array<AuthorityDTO>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedAuthority, setSelectedAuthority] =
    useState<AuthorityDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchAuthorities = async () => {
    getAuthorities(currentPage).then((pageableResult) => {
      setAuthorities(pageableResult.content);
      setTotalPages(pageableResult.totalPages);
      setTotalElements(pageableResult.totalElements);
    });
  };

  useEffect(() => {
    fetchAuthorities();
  }, [currentPage]);

  function handleDeleteClick(authority: AuthorityDTO) {
    setSelectedAuthority(authority);
    setIsDialogOpen(true);
  }

  async function confirmDeleteAuthority() {
    if (selectedAuthority) {
      console.log(`Delete ${JSON.stringify(selectedAuthority)}`);
      await deleteAuthority(selectedAuthority.name);
      setSelectedAuthority(null);
      fetchAuthorities();
    }
    setIsDialogOpen(false);
    setSelectedAuthority(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between">
        <Heading
          title={`Authorities (${totalElements})`}
          description="Manage permissions for groups and users to control access to resources."
        />
        {PermissionUtils.canWrite(permissionLevel) && (
          <Button
            onClick={() => router.push("/portal/settings/authorities/new/edit")}
          >
            <Plus />
            New Authority
          </Button>
        )}
      </div>
      <Separator />
      <div className="flex flex-col md:flex-row md:space-x-4 items-start">
        <div className="md:flex-1 flex flex-row flex-wrap w-full gap-4 pt-2">
          {authorities?.map((authority) => (
            <div
              className={`w-full md:w-[24rem] flex flex-row gap-4 px-4 py-4 rounded-2xl relative 
    ${
      authority.systemRole
        ? "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
        : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-600"
    }`}
              key={authority.name}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Button variant="link" className="px-0 text-xl">
                    <Link
                      href={`/portal/settings/authorities/${obfuscate(authority.name)}`}
                    >
                      {authority.descriptiveName} ({authority.usersCount})
                    </Link>
                  </Button>
                  {authority.systemRole && (
                    <Badge
                      variant="outline"
                      className="text-blue-500 border-blue-500 dark:text-blue-300 dark:border-blue-600"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      System Role
                    </Badge>
                  )}
                </div>
                <div>{authority.description}</div>
              </div>

              {PermissionUtils.canAccess(permissionLevel) &&
                !authority.systemRole && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Ellipsis className="cursor-pointer absolute top-2 right-2 text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[14rem]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleDeleteClick(authority)}
                            >
                              <Trash /> Remove authority
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This action will delete the role and unassign all
                              users from this role.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
            </div>
          ))}
          <PaginationExt
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedAuthority?.descriptiveName}</strong>? This action
              cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteAuthority}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
