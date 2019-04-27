/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

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
