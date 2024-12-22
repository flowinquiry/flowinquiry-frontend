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
      {/* Add a Comment Section */}
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

      {/* Display Comments Section */}
      <div className="pt-4">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {loading ? (
          <div>Loading comments...</div>
        ) : comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="flex items-start gap-4 w-full">
                <div className="relative">
                  <UserAvatar imageUrl={comment.createdByImageUrl} />
                </div>

                {/* Bubble with Curved Tail */}
                <div className="relative bg-gray-100 dark:bg-gray-800 text-sm p-4 rounded-lg shadow-md max-w-full flex-1 before:content-[''] before:absolute before:-left-5 before:top-3 before:w-6 before:h-6 before:bg-gray-100 before:dark:bg-gray-800 before:rounded-tl-full before:rounded-br-full before:shadow-md">
                  <div>
                    <Button
                      variant="link"
                      className="px-0 h-0 text-sm font-medium"
                    >
                      <a
                        href={`/portal/users/${obfuscate(comment.createdById)}`}
                      >
                        {comment.createdByName}
                      </a>
                    </Button>
                  </div>

                  <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">
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
