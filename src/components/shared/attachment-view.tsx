"use client";

import { DownloadIcon, Paperclip, TrashIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSecureBlobResource } from "@/lib/actions/commons.action";
import {
  deleteEntityAttachment,
  getEntityAttachments,
} from "@/lib/actions/entity-attachments.action";
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

  const handleDownload = async (fileUrl: string, fileName: string) => {
    const blob = await getSecureBlobResource(fileUrl, setError);
    if (blob) {
      const objectURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(objectURL);
    }
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
                    <button
                      type="button"
                      className="underline truncate overflow-hidden text-left"
                      onClick={() =>
                        handleDownload(
                          attachment.fileUrl,
                          attachment.fileName || "download",
                        )
                      }
                    >
                      {attachment.fileName}
                    </button>
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
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(
                        attachment.fileUrl,
                        attachment.fileName || "download",
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="Download"
                  >
                    <DownloadIcon size={16} />
                  </button>

                  <button
                    type="button"
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
