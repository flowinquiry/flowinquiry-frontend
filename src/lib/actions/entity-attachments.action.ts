import { deleteExec, get, post } from "@/lib/actions/commons.action";
import { HttpError } from "@/lib/errors";
import { EntityAttachmentDTO, EntityType } from "@/types/commons";

export const uploadAttachmentsForEntity = async (
  entityType: EntityType,
  entityId: number,
  files: File[],
  setError?: (error: HttpError | string | null) => void,
) => {
  const formData = new FormData();
  formData.append("entityType", entityType);
  formData.append("entityId", entityId.toString());
  files.forEach((file) => {
    formData.append("files", file); // Matches @RequestPart("files")
  });

  return post<FormData, void>(`/api/entity-attachments`, formData, setError);
};

export const getEntityAttachments = async (
  entityType: EntityType,
  entityId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<EntityAttachmentDTO[]>(
    `/api/entity-attachments?entityType=${entityType}&&entityId=${entityId}`,
    setError,
  );
};

export const deleteEntityAttachment = async (
  attachmentId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return deleteExec(`/api/entity-attachments/${attachmentId}`, setError);
};
