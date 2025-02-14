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
import { useError } from "@/providers/error-provider";
import { NotificationDTO, NotificationType } from "@/types/commons";

const LOCAL_STORAGE_KEY = "notifications";

const NotificationsDropdown = () => {
  const { data: session } = useSession();
  const { setError } = useError();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState<NotificationDTO[]>(() => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  });

  const { notifications: notificationsSocket } = useWebSocket();

  useEffect(() => {
    async function fetchNotifications() {
      if (!session?.user?.id) return;

      const notificationsData = await getUnReadNotificationsByUserId(
        Number(session.user.id),
        setError,
      );

      setNotifications((prev) => {
        const merged = [
          ...notificationsData,
          ...prev.filter(
            (n) => !notificationsData.some((dbN) => dbN.id === n.id),
          ),
        ];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      });
    }

    fetchNotifications();
  }, [session]);

  useEffect(() => {
    if (notificationsSocket.length > 0) {
      notificationsSocket.forEach((notification) => {
        toast({ title: notification.content });
      });

      setNotifications((prev) => {
        const updated = [
          ...notificationsSocket,
          ...prev.filter(
            (n) => !notificationsSocket.some((socketN) => socketN.id === n.id),
          ),
        ];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [notificationsSocket]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setNotifications(
          JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"),
        );
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const handleMarkAllRead = async () => {
    const validNotificationIds = notifications
      .map((n) => n.id)
      .filter((id): id is number => id !== null);

    if (validNotificationIds.length > 0) {
      await markNotificationsAsRead(validNotificationIds, setError);
    }

    setNotifications([]);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  };

  const handleNotificationClick = async (
    notificationId: number | null,
    index: number,
  ) => {
    if (notificationId !== null) {
      await markNotificationsAsRead([notificationId], setError);
    }

    setNotifications((prevNotifications) => {
      const updated = prevNotifications.map((notification, i) =>
        i === index ? { ...notification, isRead: true } : notification,
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setTimeout(() => {
      setNotifications((prevNotifications) => {
        const updated = prevNotifications.filter((_, i) => i !== index);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }, 500);
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
        <Button variant="outline" className="relative h-10 w-10 rounded-full">
          <BellDot className="animate-tada h-8 w-8" />
          {notifications.length > 0 && (
            <div className="absolute top-[2px] right-[2px] translate-x-1/2 translate-y-[-50%] w-5 h-5 text-[10px] rounded-full font-semibold flex items-center justify-center bg-red-400 text-white dark:bg-red-500 dark:text-white">
              {notifications.length}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-[999] mx-4 lg:w-[24rem] p-0"
      >
        {notifications.length > 0 ? (
          <>
            <DropdownMenuLabel>
              <div className="flex justify-between px-2 py-2">
                <div className="text-sm font-medium">
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
            <ScrollArea className="max-h-[20rem] overflow-y-auto">
              <AnimatePresence>
                {notifications.map((item, index) => (
                  <motion.div
                    key={index}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DropdownMenuItem
                      className="cursor-pointer flex gap-3 items-start"
                      onClick={() => handleNotificationClick(item.id, index)}
                    >
                      {getNotificationIcon(item.type)}
                      <div className="flex-1 flex flex-col">
                        <TruncatedHtmlLabel
                          htmlContent={item.content}
                          wordLimit={400}
                        />
                        <Tooltip>
                          <TooltipTrigger className="w-auto text-left">
                            {formatDateTimeDistanceToNow(
                              new Date(item.createdAt),
                            )}
                          </TooltipTrigger>
                          <TooltipContent side="right" align="start">
                            <p>{formatDateTime(new Date(item.createdAt))}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          </>
        ) : (
          <div className="p-4 text-center text-sm">No new notifications.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
