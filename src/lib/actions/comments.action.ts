"use server";

import { get, post } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { CommentType, EntityType } from "@/types/commons";

export const getCommentsForEntity = (
  entityType: EntityType,
  entityId: number,
) => {
  return get<Array<CommentType>>(
    `${BACKEND_API}/api/comments?entityType=${entityType}&&entityId=${entityId}`,
  );
};

export const createNewComment = async (comment: CommentType) => {
  return post<CommentType, CommentType>(`${BACKEND_API}/api/comments`, comment);
};
