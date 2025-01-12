"use client";

import { DownloadIcon, Paperclip, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  deleteEntityAttachment,
  getEntityAttachments,
} from "@/lib/actions/entity-attachments.action";
import { BASE_URL } from "@/lib/constants";
import { formatBytes } from "@/lib/utils";
import { useError } from "@/providers/error-provider";
import { EntityAttachmentDTO, EntityType } from "@/types/commons";

type AttachmentViewProps = {
  entityType: EntityType;
  entityId: number;
};

const AttachmentView: React.FC<AttachmentViewProps> = ({
  entityType,
  entityId,
}) => {
  const [attachments, setAttachments] = useState<EntityAttachmentDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setError } = useError();

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const data = await getEntityAttachments(entityType, entityId, setError);
        setAttachments(data);
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, [entityType, entityId]);

  const handleDelete = async (attachmentId: number) => {
    await deleteEntityAttachment(attachmentId, setError);
    setAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== attachmentId),
    );
  };

  if (loading) {
    return <p>Loading attachments...</p>;
  }

  return (
    <div className="attachment-view w-full">
      {attachments.length === 0 ? (
        <p>No attachments found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {attachments.map((attachment, index) => (
            <li key={index} className="mb-2 flex items-center gap-2">
              <Paperclip size={16} />

              <div className="flex items-center gap-2 w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={`${BASE_URL}/api/files/${attachment.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline truncate overflow-hidden"
                    >
                      {attachment.fileName}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Uploaded at:{" "}
                      {new Date(attachment.uploadedAt).toLocaleString()}
                    </p>
                    {attachment.fileSize && (
                      <p>Size: {formatBytes(attachment.fileSize)}</p>
                    )}
                  </TooltipContent>
                </Tooltip>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {attachment.fileUrl && (
                    <a
                      href={`${BASE_URL}/api/files/${attachment.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      title="Download"
                    >
                      <DownloadIcon size={16} />
                    </a>
                  )}

                  <button
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                    onClick={() => handleDelete(attachment.id)}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttachmentView;
