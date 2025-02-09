import { Client } from "@stomp/stompjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { BASE_URL } from "@/lib/constants";
import { NotificationDTO } from "@/types/commons";

const useWebSocket = () => {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || null;
  const userId = session?.user?.id || null;

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!userId || !token) {
      console.warn("❌ WebSocket not initialized: Missing userId or token");
      return;
    }

    // ✅ Convert `http` to `ws`, and `https` to `wss`
    const WEBSOCKET_URL = BASE_URL!.replace(/^http/, "ws") + "/fiws";

    const stompClient = new Client({
      brokerURL: WEBSOCKET_URL,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("✅ WebSocket Connected for user:", userId);

        stompClient.subscribe(
          `/user/${userId}/queue/notifications`,
          (message) => {
            try {
              const notification: NotificationDTO = JSON.parse(message.body);
              setNotifications((prev) => [...prev, notification]);
            } catch (error) {
              console.error("❌ Error parsing WebSocket message:", error);
            }
          },
        );
      },
      onStompError: (frame) => {
        console.error("❌ WebSocket STOMP error:", frame);
      },
      onDisconnect: () => console.log("❌ Disconnected from WebSocket"),
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [userId, token]);

  return { notifications, setNotifications };
};

export default useWebSocket;
