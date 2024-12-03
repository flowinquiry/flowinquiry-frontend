"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Add a badge for visual distinction
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAuthorities } from "@/lib/actions/authorities.action";
import { obfuscate } from "@/lib/endecode";
import { AuthorityDTO } from "@/types/authorities";
import PaginationExt from "@/components/shared/pagination-ext";
import { PermissionUtils } from "@/types/resources";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash, Shield } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePagePermission } from "@/hooks/use-page-permission";

export function AuthoritiesView() {
  const [authorities, setAuthorities] = useState<Array<AuthorityDTO>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedAuthority, setSelectedAuthority] =
    useState<AuthorityDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const permissionLevel = usePagePermission();

  useEffect(() => {
    const fetchAuthorities = async () => {
      getAuthorities().then((pageableResult) => {
        setAuthorities(pageableResult.content);
        setTotalPages(pageableResult.totalPages);
        setTotalElements(pageableResult.totalElements);
      });
    };

    fetchAuthorities();
  }, []);

  function handleDeleteClick(authority: AuthorityDTO) {
    setSelectedAuthority(authority);
    setIsDialogOpen(true);
  }

  function confirmDeleteAuthority() {
    if (selectedAuthority) {
      console.log(`Delete ${JSON.stringify(selectedAuthority)}`);
      // Add actual delete logic here (e.g., API call)
    }
    setIsDialogOpen(false);
    setSelectedAuthority(null);
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-4 items-start">
      <div className="md:flex-1 flex flex-row flex-wrap w-full gap-4 pt-2">
        {authorities?.map((authority) => (
          <div
            className={`w-full md:w-[24rem] flex flex-row gap-4 border px-4 py-4 rounded-2xl relative ${
              authority.systemRole
                ? "bg-gray-100 border-gray-300"
                : "bg-white border-gray-200"
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
                    className="text-blue-500 border-blue-500"
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
                  <DropdownMenuContent className="w-[14rem] w-full">
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

      {/* Confirmation Dialog */}
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
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAuthority}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
