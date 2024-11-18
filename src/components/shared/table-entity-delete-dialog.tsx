"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import * as React from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface RowEntitiesDeleteDialogProps<
  TEntity extends Record<string, any>,
> extends React.ComponentPropsWithoutRef<typeof Dialog> {
  entities: Row<TEntity>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
  deleteEntitiesFn: (ids: number[]) => Promise<void>; // Pass a function to delete entities
  entityName: string; // Pass the entity name for the UI text
}

export function EntitiesDeleteDialog<TEntity extends Record<string, any>>({
  entities,
  showTrigger = true,
  onSuccess,
  deleteEntitiesFn,
  entityName,
  ...props
}: RowEntitiesDeleteDialogProps<TEntity>) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  function onDelete() {
    startDeleteTransition(async () => {
      // Perform a runtime check to ensure each entity has an "id" field
      const ids = entities.map((entity) => {
        if ("id" in entity && typeof entity.id === "number") {
          return entity.id; // Return the ID if it exists and is a string
        } else {
          throw new Error(`Entity does not have a valid "id" field`);
        }
      });

      try {
        await deleteEntitiesFn(ids);
      } catch (error) {
        toast.error(
          `Cannot delete ${entityName}${entities.length > 1 ? "s" : ""}`,
        );
        return;
      }

      props.onOpenChange?.(false);
      toast.success(
        `${entityName}${entities.length > 1 ? "s are" : " is"} deleted`,
      );
      onSuccess?.();
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <TrashIcon className="mr-2 size-4" aria-hidden="true" />
              Delete ({entities.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">{entities.length}</span>
              {entities.length === 1
                ? ` ${entityName}`
                : ` ${entityName}s`}{" "}
              from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({entities.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{entities.length}</span>
            {entities.length === 1 ? ` ${entityName}` : ` ${entityName}s`} from
            our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Icons.spinner
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
