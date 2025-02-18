"use client";

import React, { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MultipleSelector from "@/components/ui/multi-select-dynamic";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEntityWatchers } from "@/lib/actions/entity-watchers.action";
import { findUsers } from "@/lib/actions/users.action";
import { useError } from "@/providers/error-provider";
import { EntityType } from "@/types/commons";
import { QueryDTO } from "@/types/query";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

interface EntityWatchersProps {
  entityType: EntityType;
  entityId: number;
}

const EntityWatchers = ({ entityType, entityId }: EntityWatchersProps) => {
  const [initialWatchers, setInitialWatchers] = useState<Option[]>([]);
  const [selectedWatchers, setSelectedWatchers] = useState<Option[]>([]);
  const { setError } = useError();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchUsers = async (userTerm: string) => {
    const query: QueryDTO = {
      groups: [
        {
          logicalOperator: "OR",
          filters: [
            { field: "email", operator: "lk", value: `%${userTerm}%` },
            { field: "firstName", operator: "lk", value: `%${userTerm}%` },
            { field: "lastName", operator: "lk", value: `%${userTerm}%` },
          ],
        },
      ],
    };

    const users = await findUsers(query, { page: 1, size: 10 }, setError);
    return users.content.map((user) => ({
      value: `${user.id}`,
      label: `${user.firstName} ${user.lastName}`,
    }));
  };

  useEffect(() => {
    const fetchWatchers = async () => {
      try {
        setLoading(true);
        const data = await getEntityWatchers(entityType, entityId, setError);
        const formattedWatchers = data.map((watcher) => ({
          value: watcher.id.toString(),
          label: watcher.watchUserName,
        }));
        setInitialWatchers(formattedWatchers);
        setSelectedWatchers(formattedWatchers);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchers();
  }, [entityType, entityId, setError]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleUpdateWatchers();
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleWatcherEdit = () => {
    setIsEditing(true);
  };

  const handleWatcherChange = (newSelection: Option[]) => {
    setSelectedWatchers(newSelection);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleUpdateWatchers();
      setIsEditing(false);
    }
  };

  const handleUpdateWatchers = async () => {
    const initialIds = new Set(initialWatchers.map((w) => w.value));
    const selectedIds = new Set(selectedWatchers.map((w) => w.value));

    const addedWatchers = selectedWatchers.filter(
      (w) => !initialIds.has(w.value),
    );
    const removedWatchers = initialWatchers.filter(
      (w) => !selectedIds.has(w.value),
    );

    if (addedWatchers.length > 0) {
      await Promise.all(
        addedWatchers.map((w) => addWatcher(entityId, w.value, setError)),
      );
    }

    if (removedWatchers.length > 0) {
      await Promise.all(
        removedWatchers.map((w) => removeWatcher(entityId, w.value, setError)),
      );
    }

    // Update initialWatchers to reflect the current state
    setInitialWatchers([...selectedWatchers]);
  };

  const getInitials = (fullName: string) => {
    const words = fullName.trim().split(" ");
    return words.length > 1
      ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
      : words[0][0].toUpperCase();
  };

  const truncateName = (name: string, maxLength = 12) => {
    return name.length > maxLength ? `${name.slice(0, maxLength)}…` : name;
  };

  return (
    <div
      ref={containerRef}
      className={`space-y-2 p-2 w-full rounded-md transition-all duration-200 ${
        isHovered ? "border border-dotted border-gray-400" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleWatcherEdit}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {isEditing ? (
        <MultipleSelector
          value={selectedWatchers}
          onChange={handleWatcherChange}
          onSearch={searchUsers}
          placeholder="Add watcher..."
          emptyIndicator={
            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
              No results found.
            </p>
          }
        />
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-wrap gap-2 items-center cursor-pointer">
              {selectedWatchers.map((watcher) => (
                <Badge
                  key={watcher.value}
                  className="flex items-center gap-2 px-2 py-1 max-w-[150px] truncate"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={
                        String(
                          initialWatchers.find((w) => w.value === watcher.value)
                            ?.watcherImageUrl,
                        ) || ""
                      }
                      alt={watcher.label}
                    />
                    <AvatarFallback>
                      {getInitials(watcher.label)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {truncateName(watcher.label)}
                  </span>
                </Badge>
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent>Click to edit watchers</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default EntityWatchers;
