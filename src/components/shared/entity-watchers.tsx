"use client";

import React, { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MultipleSelector, { Option } from "@/components/ui/multi-select-dynamic";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  addWatchers,
  deleteWatchers,
  getEntityWatchers,
} from "@/lib/actions/entity-watchers.action";
import { findUsers } from "@/lib/actions/users.action";
import { useError } from "@/providers/error-provider";
import { EntityType } from "@/types/commons";
import { QueryDTO } from "@/types/query";

interface EntityWatchersProps {
  entityType: EntityType;
  entityId: number;
}

const EntityWatchers = ({ entityType, entityId }: EntityWatchersProps) => {
  const [initialWatchers, setInitialWatchers] = useState<Option[]>([]); // Stores the original list of watchers fetched from the backend when the component loads.
  const [selectedWatchers, setSelectedWatchers] = useState<Option[]>([]); // Stores the current selection of watchers (including user changes)
  const [watcherImages, setWatcherImages] = useState<Map<string, string>>(
    new Map(),
  ); // Store image URLs separately
  const { setError } = useError();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch watchers on component mount
  useEffect(() => {
    const fetchWatchers = async () => {
      try {
        setLoading(true);
        const data = await getEntityWatchers(entityType, entityId, setError);

        const imageMap = new Map<string, string>();
        const formattedWatchers = data.map((watcher) => {
          imageMap.set(
            watcher.watchUserId.toString(),
            watcher.watcherImageUrl || "",
          ); // Store image URLs
          return {
            value: watcher.watchUserId.toString(),
            label: watcher.watchUserName,
          }; // Ensure Option type
        });

        setWatcherImages(imageMap);
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

  // Trigger `handleUpdateWatchers` when exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      handleUpdateWatchers();
    }
  }, [isEditing]);

  // Fetch users when searching
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

  const handleWatcherEdit = () => {
    setIsEditing(true);
  };

  const handleWatcherChange = (newSelection: Option[]) => {
    setSelectedWatchers(newSelection);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleUpdateWatchers = async () => {
    const initialIds = new Set(initialWatchers.map((w) => Number(w.value)));
    const selectedIds = new Set(selectedWatchers.map((w) => Number(w.value)));

    const addedWatcherIds = [...selectedIds].filter(
      (id) => !initialIds.has(id),
    );
    const removedWatcherIds = [...initialIds].filter(
      (id) => !selectedIds.has(id),
    );

    if (addedWatcherIds.length === 0 && removedWatcherIds.length === 0) {
      return; // No changes, skip API call
    }

    if (addedWatcherIds.length > 0) {
      await addWatchers(entityType, entityId, addedWatcherIds, setError);
    }

    if (removedWatcherIds.length > 0) {
      await deleteWatchers(entityType, entityId, removedWatcherIds, setError);
    }

    setInitialWatchers([...selectedWatchers]); // Update state after sync
  };

  return (
    <div
      ref={containerRef}
      className={`space-y-2 p-2 w-full rounded-md transition-all duration-200 ${
        isHovered
          ? "border border-dotted border-gray-400"
          : "border-transparent"
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
                      src={watcherImages.get(watcher.value) || ""} // Use stored image map
                      alt={watcher.label}
                    />
                    <AvatarFallback>
                      {watcher.label.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{watcher.label}</span>
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
