"use client";
"use client";

import React, { useEffect, useState } from "react";

import { getEntityAttachments } from "@/lib/actions/entity-attachments.action";
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
      await getEntityAttachments(entityType, entityId, setError)
        .then((data) => setAttachments(data))
        .finally(() => setLoading(false));
    };

    fetchAttachments();
  }, [entityType, entityId]);

  if (loading) {
    return <p>Loading attachments...</p>;
  }

  return (
    <div className="attachment-view">
      {attachments.length === 0 ? (
        <p>No attachments found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {attachments.map((attachment, index) => (
            <li key={index} className="mb-2">
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {attachment.fileName}
              </a>{" "}
              <span className="text-sm text-gray-500">
                {attachment.fileType || "Unknown type"} -{" "}
                {attachment.fileSize
                  ? `${attachment.fileSize} bytes`
                  : "Unknown size"}
              </span>
              <br />
              <span className="text-sm text-gray-400">
                Uploaded: {new Date(attachment.uploadedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttachmentView;
