// @flow
import axios from 'axios';
import type {
  PhotoNote,
  Question,
  Flashcard,
  Flashcards,
  ShareLink,
  Comments,
  PostMetaData
} from '../types/models';
import { API_ROUTES } from '../constants/routes';
import { getToken, postToCamelCase, commentsToCamelCase } from './utils';

export const createFlashcards = async ({
  userId,
  title,
  deck,
  classId,
  sectionId,
  tags,
  grade
}: {
  userId: string,
  title: string,
  deck: Array<Flashcard>,
  classId: number,
  sectionId?: number,
  tags: Array<number>,
  grade: number
}): Promise<Object> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.DECK}`,
    {
      user_id: Number(userId),
      title,
      deck,
      grade_level: grade,
      token: 'NA',
      class_id: classId,
      section_id: sectionId,
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

export const createQuestion = async ({
  userId,
  title,
  body,
  classId,
  sectionId,
  tags
}: {
  userId: string,
  title: string,
  body: string,
  classId: number,
  sectionId?: number,
  tags: Array<number>
}): Promise<Object> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.QUESTION}`,
    {
      user_id: Number(userId),
      question_title: title,
      question_body: body,
      class_id: classId,
      section_id: sectionId,
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

export const createShareLink = async ({
  userId,
  title,
  uri,
  classId,
  sectionId,
  tags
}: {
  userId: string,
  title: string,
  uri: string,
  classId: number,
  sectionId?: number,
  tags: Array<number>
}): Promise<Object> => {
  const token = await getToken();
  const result = await axios.post(
    `${API_ROUTES.SHARELINK}`,
    {
      user_id: Number(userId),
      title,
      uri,
      class_id: classId,
      section_id: sectionId,
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
  const post = postToCamelCase(data);
  const notes = (data.notes || []).map(item => ({
    fullNoteUrl: String((item.full_note_url: string) || ''),
    note: String((item.note: string) || ''),
    noteUrl: String((item.note_url: string) || '')
  }));
  const photoNote = { ...post, notes };
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

export const getFlashcards = async ({
  userId,
  flashcardId
}: {
  userId: string,
  flashcardId: number
}): Promise<Flashcards> => {
  const token = await getToken();
  const result = await axios.get(
    `${API_ROUTES.FLASHCARDS}/${flashcardId}?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  const post = postToCamelCase(data);
  const deck = data.deck || [];
  const flashcards = { ...post, deck };
  return flashcards;
};

export const getShareLink = async ({
  userId,
  sharelinkId
}: {
  userId: string,
  sharelinkId: number
}): Promise<ShareLink> => {
  const token = await getToken();
  const result = await axios.get(
    `${API_ROUTES.SHARELINK}/${sharelinkId}?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  const post = postToCamelCase(data);
  const uri = String((data.uri: string) || '');
  const shareLink = { ...post, uri };
  return shareLink;
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
  return data;
};

export const createShareURL = async ({
  userId,
  feedId
}: {
  userId: string,
  feedId: number
}) => {
  const token = await getToken();

  const result = await axios.post(
    API_ROUTES.CREATELINK,
    {
      user_id: Number(userId),
      feed_id: feedId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  const { url } = data;
  return url;
};

export const updateThanks = async ({
  userId,
  postId,
  typeId
}: {
  userId: string,
  postId: number,
  typeId: number
}) => {
  const token = await getToken();

  const result = await axios.post(
    `${API_ROUTES.FEED}/${postId}/thank`,
    {
      user_id: Number(userId),
      type_id: typeId,
      token: 'abc'
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

export const addToStudyCircle = async ({
  userId,
  classmateId,
  studyCircleTypeId = 1,
  feedId
}: {
  userId: string,
  classmateId: string,
  studyCircleTypeId?: number,
  feedId: number
}) => {
  const token = await getToken();

  const result = await axios.post(
    `${API_ROUTES.STUDY_CIRCLE}/${userId}`,
    {
      study_circle_id: Number(classmateId),
      study_circle_type_id: studyCircleTypeId,
      added_from_feed_id: feedId
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

export const removeFromStudyCircle = async ({
  userId,
  classmateId,
  studyCircleTypeId = 1
}: {
  userId: string,
  classmateId: string,
  studyCircleTypeId?: number
}) => {
  const token = await getToken();

  const result = await axios.delete(
    `${
      API_ROUTES.STUDY_CIRCLE
    }/${userId}?study_circle_id=${classmateId}&study_circle_type_id=${studyCircleTypeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  return data;
};

export const thankComment = async ({
  userId,
  feedId,
  commentId
}: {
  userId: string,
  feedId: number,
  commentId: number
}) => {
  const token = await getToken();

  const result = await axios.post(
    `${API_ROUTES.COMMENT}/${commentId}/thank`,
    {
      user_id: Number(userId),
      feed_id: feedId
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

export const report = async ({
  reportCreatorId,
  objectCreatorId,
  reasonId,
  objectId,
  reportTypeId,
  description
}: {
  reportCreatorId: string,
  objectCreatorId: string,
  reasonId: string,
  objectId: number,
  reportTypeId: number,
  description: string
}) => {
  const token = await getToken();

  const result = await axios.post(
    API_ROUTES.REPORT,
    {
      report_creator_id: Number(reportCreatorId),
      object_creator_id: Number(objectCreatorId),
      reason_id: Number(reasonId),
      object_id: objectId,
      report_type_id: reportTypeId,
      description
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

export const bookmark = async ({
  feedId,
  userId,
  remove
}: {
  feedId: number,
  userId: string,
  remove: boolean
}) => {
  const token = await getToken();

  if (remove) {
    const result = await axios.delete(
      `${API_ROUTES.FEED}/${feedId}/bookmark?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { data } = result;
    return data;
  }

  const result = await axios.post(
    `${API_ROUTES.FEED}/${feedId}/bookmark`,
    {
      user_id: Number(userId)
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

export const deletePost = async ({
  feedId,
  userId
}: {
  feedId: number,
  userId: string
}) => {
  const token = await getToken();

  const result = await axios.delete(
    `${API_ROUTES.FEED}/${feedId}?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data } = result;
  return data;
};

export const getPostMetadata = async ({
  feedId,
  userId
}: {
  feedId: number,
  userId: string
}): Promise<PostMetaData> => {
  const token = await getToken();

  const result = await axios.get(
    `${API_ROUTES.FEED}/${feedId}/info?user_id=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const { data = {} } = result;
  const recommendedPosts = (data.recommended_posts || []).map(item => ({
    id: Number((item.id: number) || 0),
    postId: Number((item.post_id: number) || 0),
    typeId: Number((item.type_id: number) || 0),
    userId: String((item.user_id: string) || ''),
    firstName: String((item.first_name: string) || ''),
    lastName: String((item.last_name: string) || ''),
    title: String((item.title: string) || ''),
    description: String((item.description: string) || ''),
    created: String((item.created: string) || ''),
    thanksCount: Number((item.thanks_count: number) || 0),
    viewCount: Number((item.view_count: number) || 0)
  }));

  const tags = (data.tags || []).map(item => ({
    description: String((item.description: string) || ''),
    id: Number((item.id: number) || 0),
    name: String((item.name: string) || '')
  }));

  return { recommendedPosts, tags };
};
