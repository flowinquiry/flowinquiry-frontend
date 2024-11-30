"use client";

import { useEffect, useState } from "react";

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/components/ui/timeline";
import { getTeamRequestStateChangesHistory } from "@/lib/actions/teams.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { TransitionItemCollectionDTO } from "@/types/teams";

const TeamRequestsTimelineHistory = ({ teamId }: { teamId: number }) => {
  const [transitionItemCollection, setTransitionItemCollection] =
    useState<TransitionItemCollectionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatesHistory = async () => {
      setLoading(true);
      setError(null);
      getTeamRequestStateChangesHistory(teamId)
        .then((data) => setTransitionItemCollection(data))
        .finally(() => setLoading(false));
    };
    fetchStatesHistory();
  }, [teamId]);

  if (loading) {
    return <div className="text-center py-4">Loading timeline history...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (
    !transitionItemCollection ||
    !transitionItemCollection.transitions ||
    transitionItemCollection.transitions.length === 0
  ) {
    return (
      <div className="py-4 text-left">
        No transitions found for this request.
      </div>
    );
  }

  return (
    <div>
      <Timeline className="py-4">
        {transitionItemCollection.transitions.map((transition, index) => (
          <TimelineItem key={index}>
            <TimelineConnector />
            <TimelineHeader>
              <TimelineIcon />
              <TimelineTitle>
                {transition.eventName}
                <span
                  className="text-sm ml-2"
                  title={transition.transitionDate}
                >
                  (
                  {formatDateTimeDistanceToNow(
                    new Date(transition.transitionDate),
                  )}
                  )
                </span>
              </TimelineTitle>
            </TimelineHeader>
            <TimelineContent>
              <TimelineDescription>
                {transition.fromState} to {transition.toState}
              </TimelineDescription>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default TeamRequestsTimelineHistory;
