// @flow
import axios from 'axios';
import type { PhotoNote } from '../types/models';
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
  const photoNote = {
    body: String((data.body: string) || ''),
    bookmarked: Boolean((data.bookmarked: boolean) || false),
    classId: Number((data.class_id: number) || 0),
    classroomName: String((data.classroom_name: string) || ''),
    created: String((data.created: string) || ''),
    feedId: Number((data.feed_id: number) || 0),
    grade: Number((data.grade: number) || 0),
    inStudyCircle: Boolean((data.in_study_circle: boolean) || false),
    name: String((data.name: string) || ''),
    notes: (data.notes || []).map(item => ({
      fullNoteUrl: String((item.full_note_url: string) || ''),
      note: String((item.note: string) || ''),
      noteUrl: String((item.note_url: string) || '')
    })),
    postId: Number((data.post_id: number) || 0),
    postInfo: {
      date: String((data.post_info.date: string) || ''),
      feedId: Number((data.post_info.feed_id: number) || 0),
      postId: Number((data.post_info.post_id: number) || 0),
      questionsCount: Number((data.post_info.questions_count: number) || 0),
      thanksCount: Number((data.post_info.thanks_count: number) || 0),
      userId: Number((data.post_info.user_id: number) || 0),
      viewCount: Number((data.post_info.view_count: number) || 0)
    },
    rank: Number((data.rank: number) || 0),
    reports: Number((data.reports: number) || 0),
    school: String((data.school: string) || ''),
    subject: String((data.subject: string) || ''),
    thanked: Boolean((data.thanked: boolean) || false),
    title: String((data.title: string) || ''),
    typeId: Number((data.type_id: number) || 0),
    userId: String((data.user_id: string) || ''),
    userProfileUrl: String((data.user_profile_url: string) || '')
  };
  return photoNote;
};
