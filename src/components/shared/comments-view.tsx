"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { UserAvatar } from "@/components/shared/avatar-display";
import RichTextEditor from "@/components/shared/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createNewComment,
  getCommentsForEntity,
} from "@/lib/actions/comments.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { CommentDTO, EntityType } from "@/types/commons";

type CommentsViewProps = {
  entityType: EntityType;
  entityId: number;
};

const CommentsView: React.FC<CommentsViewProps> = ({
  entityType,
  entityId,
}) => {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (entityId) {
      setLoading(true);
      getCommentsForEntity(entityType, entityId)
        .then((data) => {
          setComments(data);
        })
        .finally(() => setLoading(false));
    }
  }, [entityType, entityId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const newCommentObj: CommentDTO = {
      content: newComment,
      createdById: Number(session?.user?.id!),
      entityType: entityType,
      entityId: entityId,
    };

    setSubmitting(true);

    try {
      const savedComment = await createNewComment(newCommentObj);
      savedComment.createdByName =
        `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`.trim();
      setComments((prevComments) => [savedComment, ...prevComments]);
      setNewComment("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="pt-4">
        <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>

        <RichTextEditor
          value={newComment}
          onChange={(value) => setNewComment(value)}
        />
        <Button
          className="mt-2"
          onClick={handleAddComment}
          disabled={submitting || !newComment.trim()}
        >
          {submitting ? "Submitting..." : "Add Comment"}
        </Button>
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {loading ? (
          <div>Loading comments...</div>
        ) : comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="p-4 border rounded-md flex items-start gap-4"
              >
                <UserAvatar imageUrl={comment.createdByImageUrl} />
                <div>
                  <div>
                    <Button variant="link" className="px-0 h-0">
                      <a
                        href={`/portal/users/${obfuscate(comment.createdById)}`}
                      >
                        {comment.createdByName}
                      </a>
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <Tooltip>
                      <TooltipTrigger>
                        <span>
                          {formatDateTimeDistanceToNow(
                            new Date(comment.createdAt!),
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>
                          {new Date(comment.createdAt!).toLocaleString()}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: comment.content!,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No comments available.</div>
        )}
      </div>
    </div>
  );
};

export default CommentsView;
