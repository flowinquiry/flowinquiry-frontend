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
import { useError } from "@/providers/error-provider";
import { EntityType, EntityWatcherDTO } from "@/types/commons";

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
  const [watchers, setWatchers] = useState<EntityWatcherDTO[]>([]);
  const { setError } = useError();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchUsers = async (userTerm: string) => {
    // Handle user search logic
  };

  useEffect(() => {
    const fetchWatchers = async () => {
      try {
        setLoading(true);
        const data = await getEntityWatchers(entityType, entityId, setError);
        setWatchers(data);
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

  const handleWatcherEdit = () => {
    setIsEditing(true);
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

  // Convert watchers to defaultOptions for MultipleSelector
  const defaultOptions: Option[] = watchers.map((watcher) => ({
    value: watcher.id.toString(),
    label: watcher.watchUserName,
  }));

  return (
    <div
      ref={containerRef}
      className={`space-y-2 p-2 w-full rounded-md transition-all duration-200 ${
        isHovered ? "border border-dotted border-gray-400" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleWatcherEdit}
    >
      {isEditing ? (
        <MultipleSelector
          value={defaultOptions}
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
              {watchers.map((watcher) => (
                <Badge
                  key={watcher.id}
                  className="flex items-center gap-2 px-2 py-1 max-w-[150px] truncate"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={watcher.watcherImageUrl ?? ""}
                      alt={watcher.watchUserName}
                    />
                    <AvatarFallback>
                      {getInitials(watcher.watchUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {truncateName(watcher.watchUserName)}
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
