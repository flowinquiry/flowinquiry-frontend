import { get, post } from "@/lib/actions/commons.action";
import { CommentDTO, EntityType } from "@/types/commons";

export const getCommentsForEntity = (
  entityType: EntityType,
  entityId: number,
  setError?: (error: string | null) => void,
) => {
  return get<Array<CommentDTO>>(
    `/api/comments?entityType=${entityType}&&entityId=${entityId}`,
    setError,
  );
};

export const createNewComment = async (
  comment: CommentDTO,
  setError?: (error: string | null) => void,
) => {
  return post<CommentDTO, CommentDTO>(`/api/comments`, comment, setError);
};
