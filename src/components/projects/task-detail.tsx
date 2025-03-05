"use client";

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
import { TeamRequestDTO } from "@/types/team-requests";

type TaskDetailSheetProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: TeamRequestDTO | null;
};

const TaskDetailSheet: React.FC<TaskDetailSheetProps> = ({
  isOpen,
  setIsOpen,
  task,
}) => {
  if (!task) return null; // Don't render if no task is selected

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[450px] sm:w-[500px] md:w-[600px]">
        <SheetHeader>
          <SheetTitle>{task.requestTitle}</SheetTitle>
          <SheetDescription className="text-sm text-gray-500 dark:text-gray-400">
            Task Details
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[400px] overflow-y-auto mt-4">
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Description:
              </p>
              <p
                className="text-gray-900 dark:text-gray-100 text-sm mt-1"
                dangerouslySetInnerHTML={{
                  __html:
                    task.requestDescription ?? "No description available.",
                }}
              />
            </div>

            {/*<div className="border-t pt-4">*/}
            {/*    <p className="text-gray-600 dark:text-gray-300 text-sm">Status:</p>*/}
            {/*    <p className="text-blue-500 font-medium">{task.status}</p>*/}
            {/*</div>*/}

            {/*<div className="border-t pt-4">*/}
            {/*    <p className="text-gray-600 dark:text-gray-300 text-sm">Assigned To:</p>*/}
            {/*    <p className="text-gray-900 dark:text-gray-100">{task.assigneeName ?? "Unassigned"}</p>*/}
            {/*</div>*/}

            <div className="border-t pt-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Created At:
              </p>
              <p className="text-gray-900 dark:text-gray-100">
                {new Date(task.createdAt!).toLocaleDateString()}
              </p>
            </div>

            {/*<div className="border-t pt-4">*/}
            {/*    <p className="text-gray-600 dark:text-gray-300 text-sm">Due Date:</p>*/}
            {/*    <p className="text-gray-900 dark:text-gray-100">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>*/}
            {/*</div>*/}
          </div>
        </ScrollArea>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailSheet;
