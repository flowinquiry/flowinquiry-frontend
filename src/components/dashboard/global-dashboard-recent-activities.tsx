"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import PaginationExt from "@/components/shared/pagination-ext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getUserActivities } from "@/lib/actions/activity-logs.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { ActivityLogDTO } from "@/types/activity-logs";

const RecentUserTeamActivities = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLogDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const userId = Number(session?.user?.id!);

  useEffect(() => {
    async function fetchActivityLogs() {
      setLoading(true);
      getUserActivities(userId, currentPage, 5)
        .then((data) => {
          setActivityLogs(data.content);
          setTotalPages(data.totalPages);
        })
        .finally(() => setLoading(false));
    }
    fetchActivityLogs();
  }, [userId, currentPage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[150px]">
            <Spinner className="h-8 w-8">
              <span>Loading data ...</span>
            </Spinner>
          </div>
        ) : activityLogs && activityLogs.length > 0 ? (
          <div className="space-y-2">
            {activityLogs.map((activityLog, index) => (
              <div
                key={activityLog.id}
                className={`py-4 px-4 rounded-md ${
                  index % 2 === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "bg-white dark:bg-gray-900"
                }`}
              >
                <Button variant="link" className="px-0 h-0">
                  <Link
                    href={`/portal/teams/${obfuscate(activityLog.entityId)}/dashboard`}
                  >
                    {activityLog.entityName}
                  </Link>
                </Button>
                <div
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: activityLog.content!,
                  }}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Modified at:{" "}
                  {formatDateTimeDistanceToNow(new Date(activityLog.createdAt))}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No activity logs available
          </p>
        )}
        <PaginationExt
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          className="pt-2"
        />
      </CardContent>
    </Card>
  );
};

export default RecentUserTeamActivities;
