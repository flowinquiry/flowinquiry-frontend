"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { UserAvatar } from "@/components/shared/avatar-display";
import { Button } from "@/components/ui/button";
import { getActivityLogs } from "@/lib/actions/activity-logs.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { ActivityLogDTO } from "@/types/activity-logs";
import { EntityType } from "@/types/commons";

type AuditLogViewProps = {
  entityType: EntityType;
  entityId: number;
};

const AuditLogView: React.FC<AuditLogViewProps> = ({
  entityType,
  entityId,
}) => {
  const [logs, setLogs] = useState<ActivityLogDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      getActivityLogs("Team_Request", entityId)
        .then((data) => {
          setLogs(data.content);
        })
        .finally(() => setLoading(false));
    };
    fetchAuditLogs();
  }, [entityType, entityId]);

  if (loading) {
    return <div>Loading history...</div>;
  }

  if (logs.length === 0) {
    return <div>No history available.</div>;
  }

  return (
    <div>
      {logs.map((log, index) => (
        <div
          key={index}
          className={cn(
            "relative border-b py-2 gap-2 transition-colors",
            "odd:bg-[hsl(var(--card))] odd:text-[hsl(var(--card-foreground))]",
            "even:bg-[hsl(var(--secondary))] even:text-[hsl(var(--secondary-foreground))]",
          )}
        >
          <div className="flex items-center gap-2">
            <UserAvatar imageUrl={log.createdByImageUrl} size="w-6 h-6" />
            <Button variant="link" className="px-0">
              <Link href={`/portal/users/${obfuscate(log.createdById)}`}>
                {log.createdByName}
              </Link>
            </Button>
            <span>made some changes</span>
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: log.content!,
            }}
          />
          <small>
            Updated: {formatDateTimeDistanceToNow(new Date(log.createdAt))}
          </small>
        </div>
      ))}
    </div>
  );
};

export default AuditLogView;
