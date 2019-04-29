// @flow
import axios from 'axios';
import type { PhotoNote, Question, Comments } from '../types/models';
import { API_ROUTES } from '../constants/routes';
import { getToken, postToCamelCase, commentsToCamelCase } from './utils';

export const createPhotoNote = async ({
  userId,
  title,
  classId,
  sectionId,
  fileNames,
  comment,
  tags
}: {
  userId: string,
  title: string,
  classId: number,
  sectionId?: number,
  fileNames: Array<string>,
  comment: string,
  tags: Array<number>
}): Promise<Object> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.PHOTO_NOTE}`,
    {
      user_id: Number(userId),
      title,
      class_id: classId,
      section_id: sectionId,
      file_names: fileNames,
      comment,
      tags
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  return data;
};

export const getNotes = async ({
  userId,
  noteId
}: {
  userId: string,
  noteId: number
}): Promise<PhotoNote> => {
  const token = await getToken();
  const result = await axios.get(
    `${API_ROUTES.PHOTO_NOTE}/${noteId}?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  const photoNote = postToCamelCase(data);
  const notes = (data.notes || []).map(item => ({
    fullNoteUrl: String((item.full_note_url: string) || ''),
    note: String((item.note: string) || ''),
    noteUrl: String((item.note_url: string) || '')
  }));
  Object.assign(photoNote, { notes });
  return photoNote;
};

export const getQuestion = async ({
  userId,
  questionId
}: {
  userId: string,
  questionId: number
}): Promise<Question> => {
  const token = await getToken();
  const result = await axios.get(
    `${API_ROUTES.QUESTION}/${questionId}?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  const question = postToCamelCase(data);
  return question;
};

export const getPostComments = async ({
  userId,
  postId,
  typeId
}: {
  userId: string,
  postId: number,
  typeId: number
}): Promise<Comments> => {
  const token = await getToken();
  const result = await axios.get(
    `${API_ROUTES.FEED}/${postId}/comments?user_id=${userId}&type_id=${typeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;

  const comments = commentsToCamelCase(data);
  return comments;
};

export const createComment = async ({
  userId,
  postId,
  typeId,
  comment,
  rootCommentId,
  parentCommentId
}: {
  userId: string,
  postId: number,
  typeId: number,
  comment: string,
  rootCommentId: ?number,
  parentCommentId: ?number
}) => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.FEED}/${postId}/comment`,
    {
      user_id: Number(userId),
      type_id: typeId,
      comment,
      root_comment_id: rootCommentId,
      parent_comment_id: parentCommentId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  console.log(data);
};
