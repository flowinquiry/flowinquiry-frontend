"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpCircle,
  Bell,
  BellDot,
  Clock,
  Timer,
  XCircle,
} from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";
import useWebSocket from "@/hooks/use-websocket";
import {
  getUnReadNotificationsByUserId,
  markNotificationsAsRead,
} from "@/lib/actions/notifications.action";
import { formatDateTime, formatDateTimeDistanceToNow } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { useError } from "@/providers/error-provider";
import { NotificationDTO, NotificationType } from "@/types/commons";

const NotificationsDropdown = () => {
  const { data: session } = useSession();
  const { setError } = useError();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);

  // Load WebSocket notifications
  const { notifications: notificationsSocket } = useWebSocket();

  // Load unread notifications from the database
  useEffect(() => {
    async function fetchNotifications() {
      if (!session?.user?.id) return;

      const notificationsData = await getUnReadNotificationsByUserId(
        Number(session.user.id),
        setError,
      );
      setNotifications(notificationsData);
    }

    fetchNotifications();
  }, [session]);

  // Merge WebSocket notifications + show toast alerts
  useEffect(() => {
    if (notificationsSocket.length > 0) {
      notificationsSocket.forEach((notification) => {
        toast({
          title: notification.content,
        });
      });

      // Merge WebSocket notifications while avoiding duplicates
      setNotifications((prev) => [
        ...notificationsSocket,
        ...prev.filter(
          (n) => !notificationsSocket.some((socketN) => socketN.id === n.id),
        ),
      ]);
    }
  }, [notificationsSocket]);

  // Mark notification as read when clicked
  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationsAsRead([notificationId], setError);

    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );

    // Remove the notification after a short delay
    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationId,
        ),
      );
    }, 500);
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    const notificationIds = notifications
      .map((n) => n.id)
      .filter((id): id is number => id !== null);

    await markNotificationsAsRead(notificationIds, setError);
    setNotifications([]); // Clear notifications from UI
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INFO:
        return <Bell className="text-blue-500 dark:text-blue-400 w-5 h-5" />;
      case NotificationType.WARNING:
        return (
          <AlertTriangle className="text-yellow-500 dark:text-yellow-400 w-5 h-5" />
        );
      case NotificationType.ERROR:
        return <XCircle className="text-red-500 dark:text-red-400 w-5 h-5" />;
      case NotificationType.SLA_BREACH:
        return (
          <Clock className="text-orange-500 dark:text-orange-400 w-5 h-5" />
        );
      case NotificationType.SLA_WARNING:
        return (
          <Timer className="text-purple-500 dark:text-purple-400 w-5 h-5" />
        );
      case NotificationType.ESCALATION_NOTICE:
        return (
          <ArrowUpCircle className="text-green-500 dark:text-green-400 w-5 h-5" />
        );
      default:
        return <Bell className="text-gray-500 dark:text-gray-400 w-5 h-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-8 w-8 rounded-full">
          <BellDot className="animate-tada h-5 w-5" />
          {notifications.length > 0 && (
            <div
              className={cn(
                "absolute top-[2px] right-[2px] translate-x-1/2 translate-y-[-50%]",
                "w-5 h-5 text-[10px] rounded-full font-semibold flex items-center justify-center",
                "bg-red-400 text-white",
                "dark:bg-red-500 dark:text-white",
              )}
            >
              {notifications.length}
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
                  {notifications.map((item: NotificationDTO) => (
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
                        <div className="flex items-start gap-3 flex-1">
                          {/* ✅ Wrap icon in a fixed-width div to prevent shifting */}
                          <div className="w-6 flex items-center justify-center">
                            {getNotificationIcon(item.type)}
                          </div>

                          {/* ✅ Wrap content and date inside the same flex container */}
                          <div className="flex-1 flex flex-col gap-0.5 -mx-4">
                            <div className="html-display">
                              <TruncatedHtmlLabel
                                htmlContent={item.content}
                                wordLimit={400}
                              />
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
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
