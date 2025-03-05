"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion"; // 🎯 Import Framer Motion
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // 📌 ShadCN Tooltip

const TaskBlock = ({
  id,
  title,
  isDragging = false,
}: {
  id: number;
  title: string;
  isDragging?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({
    id: id.toString(),
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          ref={setNodeRef}
          style={{
            transform: transform
              ? CSS.Transform.toString(transform)
              : undefined,
            transition,
          }}
          {...attributes}
          {...listeners}
          className="w-full p-2 rounded-lg shadow-md mb-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 truncate"
          animate={{ opacity: isSorting ? 0.5 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          {title}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="text-sm max-w-xs">
        {title}
      </TooltipContent>
    </Tooltip>
  );
};

export default TaskBlock;
