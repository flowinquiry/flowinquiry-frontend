"use client";

import { Badge, BellDot } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import TruncatedHtmlLabel from "@/components/shared/truncate-html-label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUnReadNotificationsByUserId } from "@/lib/actions/notifications.action";
import { formatDateTime, formatDateTimeDistanceToNow } from "@/lib/datetime";
import { NotificationType } from "@/types/commons";

const NotificationsDropdown = () => {
  const { data: session } = useSession();

  const [notifications, setNotifications] = useState<Array<NotificationType>>(
    [],
  );

  useEffect(() => {
    async function fetchNotifications() {
      const notificationsData = await getUnReadNotificationsByUserId(
        Number(session?.user?.id),
      );
      setNotifications(notificationsData);
    }
    fetchNotifications();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-8 w-8 rounded-full">
          <BellDot className="animate-tada h-5 w-5" />
          <Badge
            className="bg-red-400 text-white absolute top-[2px] right-[2px] translate-x-1/2 translate-y-[-50%] w-4 h-4 p-0 text-[8px] rounded-full font-semibold flex items-center justify-center"
            color="destructive"
          >
            2
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className=" z-[999] mx-4 lg:w-[24rem] p-0"
      >
        <DropdownMenuLabel>
          <div className="flex justify-between px-4 py-3 border-b border-default-100 ">
            <div className="text-sm text-default-800  font-medium ">
              Notifications ({notifications.length})
            </div>
          </div>
        </DropdownMenuLabel>
        <div className="max-h-[16rem] xl:max-h-[20rem]">
          <ScrollArea className="h-full">
            {notifications.map((item: NotificationType, index: number) => (
              <DropdownMenuItem
                key={`inbox-${index}`}
                className="flex gap-9 py-2 px-4 cursor-pointer group"
                onClick={() => console.log(`Click on ${JSON.stringify(item)}`)}
              >
                <div className="flex items-start gap-2 flex-1">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="html-display">
                      <TruncatedHtmlLabel
                        htmlContent={item.content}
                        wordLimit={400}
                      />
                    </div>
                    <div>
                      <Tooltip>
                        <TooltipTrigger>
                          {formatDateTimeDistanceToNow(
                            new Date(item.createdAt),
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{formatDateTime(new Date(item.createdAt))}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                {item.isRead && (
                  <div className="flex-0">
                    <span className="h-[10px] w-[10px] bg-destructive border border-destructive-foreground dark:border-default-400 rounded-full inline-block" />
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;