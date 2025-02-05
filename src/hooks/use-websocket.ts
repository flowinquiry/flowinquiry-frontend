"use client";

import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

import { NotificationDTO } from "@/types/commons";

const useWebSocket = (userId: string) => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/fiws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("connecting");
        // Subscribe to the user's notification queue
        stompClient.subscribe(`/user/queue/notifications`, (message) => {
          console.log("Recenive message", message);
          try {
            const notification: NotificationDTO = JSON.parse(message.body);
            setNotifications((prev) => [...prev, notification]);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        });
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
    });

    stompClient.activate();
    setClient(stompClient);

    // Cleanup function must be synchronous
    return () => {
      stompClient.deactivate(); // Ensure cleanup is synchronous
    };
  }, [userId]);

  return { notifications, setNotifications };
};

export default useWebSocket;
