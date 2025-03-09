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
import { useError } from "@/providers/error-provider";
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
  const { setError } = useError();

  useEffect(() => {
    if (entityId) {
      setLoading(true);
      getCommentsForEntity(entityType, entityId, setError)
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
      const savedComment = await createNewComment(newCommentObj, setError);
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
              <li key={comment.id} className="flex items-start gap-4">
                <div className="pt-3">
                  <UserAvatar imageUrl={comment.createdByImageUrl} />
                </div>

                <div
                  className="relative bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm flex-1
                                before:absolute before:-left-3 before:top-6 before:w-0 before:h-0
                                before:border-t-[6px] before:border-b-[6px] before:border-r-[12px]
                                before:border-t-transparent before:border-b-transparent
                                before:border-r-gray-100 before:dark:border-r-gray-800"
                >
                  <div className="flex items-baseline gap-2 mb-2 pb-2">
                    <Button
                      variant="link"
                      className="px-0 h-6 text-sm font-medium"
                    >
                      <a
                        href={`/portal/users/${obfuscate(comment.createdById)}`}
                      >
                        {comment.createdByName}
                      </a>
                    </Button>

                    <div className="text-gray-500 dark:text-gray-400 text-xs">
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
