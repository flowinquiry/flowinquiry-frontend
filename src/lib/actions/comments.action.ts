import { get, post } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { CommentDTO, EntityType } from "@/types/commons";

export const getCommentsForEntity = (
  entityType: EntityType,
  entityId: number,
) => {
  return get<Array<CommentDTO>>(
    `${BACKEND_API}/api/comments?entityType=${entityType}&&entityId=${entityId}`,
  );
};

export const createNewComment = async (comment: CommentDTO) => {
  return post<CommentDTO, CommentDTO>(`${BACKEND_API}/api/comments`, comment);
};
