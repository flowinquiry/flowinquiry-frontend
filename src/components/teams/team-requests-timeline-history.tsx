"use client";

import { useEffect, useState } from "react";
import { TransitionItemCollectionDTO } from "@/types/teams";
import { getTeamRequestStateChangesHistory } from "@/lib/actions/teams.action";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/timeline";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";

const TeamRequestsTimelineHistory = ({ teamId }: { teamId: number }) => {
  const [transitionItemCollection, setTransitionItemCollection] =
    useState<TransitionItemCollectionDTO>();

  useEffect(() => {
    async function fetchStatesHistory() {
      getTeamRequestStateChangesHistory(teamId).then((data) =>
        setTransitionItemCollection(data),
      );
    }
    fetchStatesHistory();
  }, [teamId]);
  return (
    <div>
      {transitionItemCollection && transitionItemCollection.transitions && (
        <Timeline className="py-4">
          {transitionItemCollection.transitions.map((transition) => (
            <TimelineItem>
              <TimelineConnector />
              <TimelineHeader>
                <TimelineTime></TimelineTime>
                <TimelineIcon />
                <TimelineTitle>
                  {transition.eventName}{" "}
                  <span className="text-sm" title={transition.transitionDate}>
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
      )}
    </div>
  );
};

export default TeamRequestsTimelineHistory;
