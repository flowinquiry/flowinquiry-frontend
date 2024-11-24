"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellDot } from "lucide-react";
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
import {
  getUnReadNotificationsByUserId,
  markNotificationsAsRead,
} from "@/lib/actions/notifications.action";
import { formatDateTime, formatDateTimeDistanceToNow } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { NotificationDTO } from "@/types/commons";

const NotificationsDropdown = () => {
  const { data: session } = useSession();

  const [notifications, setNotifications] = useState<Array<NotificationDTO>>(
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

  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationsAsRead([notificationId]);

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );

    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId,
        ),
      );
    }, 500);
  };

  const handleMarkAllRead = async () => {
    const notificationIds = notifications
      .map((notification) => notification.id)
      .filter((id): id is number => id !== null);

    await markNotificationsAsRead(notificationIds);

    setNotifications([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-8 w-8 rounded-full">
          <BellDot className="animate-tada h-5 w-5" />
          {notifications.filter((notification) => !notification.isRead).length >
            0 && (
            <div
              className={cn(
                "absolute top-[2px] right-[2px] translate-x-1/2 translate-y-[-50%]",
                "w-5 h-5 text-[10px] rounded-full font-semibold flex items-center justify-center",
                "bg-red-400 text-white",
                "dark:bg-red-500 dark:text-white",
              )}
            >
              {
                notifications.filter((notification) => !notification.isRead)
                  .length
              }
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "z-[999] mx-4 lg:w-[24rem] p-0",
          "bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(23,23,23,0.8)]",
          "border border-[hsl(var(--border))] dark:border-[hsl(var(--border-dark))]",
          "backdrop-blur-md backdrop-brightness-110 dark:backdrop-brightness-75 shadow-lg",
        )}
      >
        {notifications.length > 0 ? (
          <>
            <DropdownMenuLabel>
              <div className="flex justify-between px-2 py-2">
                <div className="text-sm text-default-800 dark:text-default-200 font-medium">
                  Notifications ({notifications.length})
                </div>
                <Button
                  variant="link"
                  onClick={handleMarkAllRead}
                  className="text-sm px-0 h-0"
                >
                  Mark all read
                </Button>
              </div>
            </DropdownMenuLabel>
            <div className="max-h-[16rem] xl:max-h-[20rem] overflow-auto">
              <ScrollArea className="h-full">
                <AnimatePresence>
                  {notifications.map((item: NotificationDTO, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border-dark))]",
                        item.isRead
                          ? "bg-gray-100 dark:bg-gray-800"
                          : "bg-white dark:bg-black",
                      )}
                    >
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className={cn(
                          "flex gap-9 py-2 px-4 cursor-pointer group",
                          "hover:bg-[hsl(var(--muted))] dark:hover:bg-[rgba(255,255,255,0.05)]",
                        )}
                        onClick={() => handleNotificationClick(item.id!)}
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
                                  <p>
                                    {formatDateTime(new Date(item.createdAt))}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-default-800 dark:text-default-200">
              You have no notifications.
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
