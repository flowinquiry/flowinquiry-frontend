import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

const Task = ({
  id,
  title,
  isDragging = false,
}: {
  id: number;
  title: string;
  isDragging?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id.toString(),
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        cursor: isDragging ? "grabbing" : "pointer",
      }}
      {...attributes}
      {...listeners}
      className="p-2 rounded-lg shadow-md mb-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    >
      {title}
    </div>
  );
};

export default Task;
