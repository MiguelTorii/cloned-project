import axios from 'axios';

import { API_ROUTES } from 'constants/routes';

import { getToken } from './utils';

import type { NotesType } from 'reducers/notes';

export const getNotes = async ({ sectionId }) => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.NOTES}/section/${sectionId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  return {
    notes: data.notes.map((d) => ({
      content: d.content,
      id: d.id,
      sectionId: d.section_id,
      lastModified: d.last_modified,
      title: d.title,
      created: d.created
    }))
  };
};
export const getNote = async ({ noteId }): Promise<NotesType> => {
  const token = await getToken();
  const result = await axios.get(`${API_ROUTES.NOTES}/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { data = {} } = result;
  return {
    content: data.content,
    id: data.post_id,
    sectionId: data.section_id,
    lastModified: data.last_modified,
    title: data.title,
    created: data.created
  };
};
export const deleteNote = async ({ note }: { note: NotesType }) => {
  const { id } = note;
  const token = await getToken();
  const dataStr = JSON.stringify({});
  const config = {
    method: 'delete',
    url: `${API_ROUTES.NOTES}/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: dataStr
  };
  const result = await axios(config);
  const { data = {} } = result;
  return data;
};
export const updateNote = async ({ note }: { note: NotesType }) => {
  const token = await getToken();
  const result = await axios.put(
    API_ROUTES.NOTES,
    {
      title: note.title,
      content: note.content,
      id: note.id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
export const postNote = async ({ note, sectionId, classId }) => {
  const token = await getToken();
  const result = await axios.post(
    API_ROUTES.NOTES,
    {
      section_id: sectionId,
      class_id: classId,
      title: note.title,
      content: note.content
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const { data = {} } = result;
  return data;
};
