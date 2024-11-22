"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DefaultUserLogo from "@/components/users/user-logo";
import {
  createNewComment,
  getCommentsForEntity,
} from "@/lib/actions/comments.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { CommentType } from "@/types/commons";
import { TeamRequestType } from "@/types/teams";
import { obfuscate } from "@/lib/endecode";

type RequestDetailsProps = {
  open: boolean;
  onClose: () => void;
  request: TeamRequestType;
};

const TeamRequestDetailSheet: React.FC<RequestDetailsProps> = ({
  open,
  onClose,
  request,
}) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (open && request.id) {
      setLoading(true);
      getCommentsForEntity("Team_Request", request.id)
        .then((data) => setComments(data))
        .finally(() => setLoading(false));
    }
  }, [open, request.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const newCommentObj: CommentType = {
      content: newComment,
      createdById: Number(session?.user?.id!),
      entityType: "Team_Request",
      entityId: request.id!,
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[50rem] h-full">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>
              <Button variant="link" className="px-0 text-2xl">
                <Link href="">{request.requestTitle}</Link>
              </Button>
            </SheetTitle>
            <SheetDescription>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: request.requestDescription!,
                }}
              />
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div>
              Requested User:{" "}
              {request.requestUserId !== undefined && (
                <Button variant="link" className="px-0">
                  <Link
                    href={`/portal/users/${obfuscate(request.requestUserId)}`}
                  >
                    {request.requestUserName}
                  </Link>
                </Button>
              )}
            </div>
            <div>
              Assignee:{" "}
              {request.assignUserId !== undefined && (
                <Button variant="link" className="px-0">
                  <Link
                    href={`/portal/users/${obfuscate(request.assignUserId)}`}
                  >
                    {request.assignUserName}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="border-t pt-4 pr-4">
            <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
            <Textarea
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
            />
            <Button
              className="mt-2"
              onClick={handleAddComment}
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? "Submitting..." : "Add Comment"}
            </Button>
          </div>
          <div className="pt-4 pr-4">
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
                    {/* Avatar Section */}
                    <div>
                      <Avatar>
                        {comment.createdByImageUrl ? (
                          <AvatarImage
                            src={comment.createdByImageUrl}
                            alt={comment.createdByName}
                          />
                        ) : (
                          <AvatarFallback>
                            <DefaultUserLogo />
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>

                    {/* Comment Content Section */}
                    <div>
                      <div>
                        <Button variant="link" className="px-0 h-0">
                          <Link
                            href={`/portal/users/${obfuscate(comment.createdById)}`}
                          >
                            {comment.createdByName}
                          </Link>
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
                      <div className="mt-2">{comment.content}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No comments available.</div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default TeamRequestDetailSheet;
