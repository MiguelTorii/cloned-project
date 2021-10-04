import axios from "axios";
import clsx from "clsx";
import type { Post, PhotoNote, Question, Flashcard, Flashcards, ShareLink, Comments, PostMetaData, PostResponse } from "../types/models";
import { API_ROUTES } from "../constants/routes";
import { logEvent } from "./analytics";
import { getToken, postToCamelCase, commentsToCamelCase, postResponseToCamelCase } from "./utils";
import callApi from "./api_base";
export const createBatchFlashcards = async ({
  userId,
  title,
  summary,
  deck,
  sectionIds,
  tags,
  grade
}: {
  userId: string;
  title: string;
  summary: string;
  deck: Array<Flashcard>;
  sectionIds: Array<number>;
  tags: Array<number>;
  grade: number;
}): Promise<PostResponse> => {
  try {
    const newDeck = deck.map(d => ({
      question: d.question,
      answer: d.answer,
      answer_image_url: clsx(d.answerImage),
      question_image_url: clsx(d.questionImage)
    }));
    const token = await getToken();
    const result = await axios.post(API_ROUTES.BATCH_DECK, {
      user_id: Number(userId),
      title,
      summary,
      deck: newDeck,
      grade_level: grade,
      token: 'NA',
      section_ids: sectionIds,
      tags
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);
    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const createFlashcards = async ({
  userId,
  title,
  summary,
  deck,
  classId,
  sectionId,
  tags,
  grade
}: {
  userId: string;
  title: string;
  summary: string;
  deck: Array<Flashcard>;
  classId: number;
  sectionId: number | null | undefined;
  tags: Array<number>;
  grade: number;
}): Promise<PostResponse> => {
  try {
    const newDeck = deck.map(d => ({
      question: d.question,
      answer: d.answer,
      answer_image_url: clsx(d.answerImage),
      question_image_url: clsx(d.questionImage)
    }));
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.DECK}`, {
      user_id: Number(userId),
      title,
      summary,
      deck: newDeck,
      grade_level: grade,
      token: 'NA',
      class_id: classId,
      section_id: sectionId,
      tags
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);
    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const updateFlashcards = async ({
  flashcardId,
  classId,
  userId,
  title,
  sectionId,
  summary,
  deck
}: {
  flashcardId: string;
  title: string;
  userid: string;
  classid: number;
  sectionid: number | null | undefined;
  summary: string;
  deck: Array<Flashcard>;
}): Promise<PostResponse> => {
  try {
    const newDeck = deck.map(d => ({
      question: d.question,
      answer: d.answer,
      answer_image_url: clsx(d.answerImage),
      question_image_url: clsx(d.questionImage)
    }));
    const token = await getToken();
    const result = await axios.put(`${API_ROUTES.FLASHCARDS}/${flashcardId}`, {
      user_id: Number(userId),
      section_id: sectionId,
      title,
      summary,
      deck: newDeck,
      class_id: classId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);
    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const createBatchPostSt = async ({
  userId,
  title,
  content,
  sectionIds,
  anonymous,
  tags
}: {
  userId: string;
  title: string;
  sectionIds: Array<number>;
  content: string;
  anonymous: boolean;
  tags: Array<number>;
}): Promise<PostResponse> => {
  try {
    const body = {
      user_id: Number(userId),
      title,
      content,
      anonymous,
      private: false,
      section_id: sectionIds,
      tags
    };
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.BATCH_POST}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);

    try {
      logEvent({
        event: 'Feed- Create Batch Post Anything',
        props: {
          Title: title
        }
      });
    } catch (err) {
      console.log(err);
    }

    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const createPostSt = async ({
  userId,
  title,
  sectionId,
  content,
  anonymous,
  tags
}: {
  userId: string;
  title: string;
  sectionId: number | null | undefined;
  content: string;
  anonymous: Boolean;
  tags: Array<number>;
}): Promise<PostResponse> => {
  try {
    const body = {
      user_id: Number(userId),
      title,
      section_id: sectionId,
      content,
      private: anonymous,
      tags
    };
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.POST}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);

    try {
      logEvent({
        event: 'Feed- Create Post Anything',
        props: {
          Title: title
        }
      });
    } catch (err) {
      console.log(err);
    }

    return response;
  } catch (err) {
    console.log(err);
    // return postResponseToCamelCase({});
    throw err;
  }
};
export const updatePostSt = async ({
  title,
  content,
  postId,
  classId
}: {
  title: string;
  content: string;
  classId: number;
}): Promise<PostResponse> => {
  try {
    const token = await getToken();
    const result = await axios.put(`${API_ROUTES.POST}/${postId}`, {
      title,
      content // class_id: classId,

    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = data;

    try {
      logEvent({
        event: 'Feed- Update Post Anything',
        props: {
          Title: title
        }
      });
    } catch (err) {
      console.log(err);
    }

    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const createBatchPhotoNote = async ({
  userId,
  title,
  fileNames,
  comment,
  sectionIds,
  tags
}: {
  userId: string;
  title: string;
  fileNames: Array<string>;
  sectionIds: Array<number>;
  comment: string;
  tags: Array<number>;
}): Promise<PostResponse> => {
  try {
    const body = {
      user_id: Number(userId),
      title,
      file_names: fileNames,
      comment,
      section_ids: sectionIds,
      tags
    };
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.BATCH_PHOTO_NOTE}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);

    try {
      logEvent({
        event: 'Feed- Create Photo Note',
        props: {
          Title: title
        }
      });
    } catch (err) {
      console.log(err);
    }

    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
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
  userId: string;
  title: string;
  classId: number;
  sectionId: number | null | undefined;
  fileNames: Array<string>;
  comment: string;
  tags: Array<number>;
}): Promise<PostResponse> => {
  try {
    const body = {
      user_id: Number(userId),
      title,
      class_id: classId,
      section_id: sectionId,
      file_names: fileNames,
      comment,
      tags
    };
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.PHOTO_NOTE}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);

    try {
      logEvent({
        event: 'Feed- Create Photo Note',
        props: {
          Title: title
        }
      });
    } catch (err) {
      console.log(err);
    }

    return response;
  } catch (err) {
    console.log(err);
    // return postResponseToCamelCase({});
    throw err;
  }
};
export const updatePhotoNote = async ({
  userId,
  title,
  classId,
  sectionId,
  fileNames,
  comment,
  noteId
}: {
  noteId: string;
  userId: string;
  title: string;
  classId: number;
  sectionId: number | null | undefined;
  fileNames: Array<string>;
  comment: string;
}): Promise<PostResponse> => {
  try {
    const token = await getToken();
    const result = await axios.put(`${API_ROUTES.PHOTO_NOTE}/${noteId}`, {
      user_id: Number(userId),
      title,
      class_id: classId,
      section_id: sectionId,
      file_names: fileNames,
      comment
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);

    try {
      logEvent({
        event: 'Feed- Create Photo Note',
        props: {
          Title: title
        }
      });
    } catch (err) {
      console.log(err);
    }

    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const updateQuestion = async ({
  userId,
  questionId,
  title,
  body,
  classId,
  sectionId
}: {
  userId: string;
  questionId: number;
  title: string;
  body: string;
  classId: number;
  sectionId: number | null | undefined;
}) => {
  try {
    const token = await getToken();
    const result = await axios.put(`${API_ROUTES.QUESTION}/${questionId}`, {
      user_id: Number(userId),
      question_title: title,
      question_body: body,
      class_id: classId,
      section_id: sectionId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    return data;
  } catch (err) {
    return {};
  }
};
export const createQuestion = async ({
  userId,
  title,
  body,
  classId,
  anonymous,
  sectionId,
  tags
}: {
  userId: string;
  title: string;
  body: string;
  anonymous: boolean;
  classId: number;
  sectionId: number | null | undefined;
  tags: Array<number>;
}): Promise<PostResponse> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.QUESTION}`, {
      user_id: Number(userId),
      anonymous,
      question_title: title,
      question_body: body,
      class_id: classId,
      section_id: sectionId,
      tags
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const response = postResponseToCamelCase(data);
    return response;
  } catch (err) {
    console.log(err);
    // return postResponseToCamelCase({});
    throw err;
  }
};
export const createBatchQuestion = async ({
  userId,
  title,
  body,
  sectionIds,
  tags
}: {
  userId: string;
  sectionIds: Array<number>;
  title: string;
  body: string;
  tags: Array<number>;
}): Promise<PostResponse> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.BATCH_QUESTION}`, {
      user_id: Number(userId),
      section_ids: sectionIds,
      question_title: title,
      question_body: body,
      tags
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const response = postResponseToCamelCase(data);
    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const createShareLink = async ({
  userId,
  title,
  summary,
  uri,
  classId,
  sectionId,
  tags
}: {
  userId: string;
  title: string;
  summary: string;
  uri: string;
  classId: number;
  sectionId: number | null | undefined;
  tags: Array<number>;
}): Promise<PostResponse> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.SHARELINK}`, {
      user_id: Number(userId),
      title,
      summary,
      uri,
      class_id: classId,
      section_id: sectionId,
      tags
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);
    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const createBatchShareLink = async ({
  userId,
  title,
  summary,
  uri,
  sectionIds,
  tags
}: {
  userId: string;
  title: string;
  sectionIds: Array<number>;
  summary: string;
  uri: string;
  classId: number;
  sectionId: number | null | undefined;
  tags: Array<number>;
}): Promise<PostResponse> => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.BATCH_LINK}`, {
      user_id: Number(userId),
      title,
      summary,
      uri,
      section_ids: sectionIds,
      tags
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const response = postResponseToCamelCase(data);
    return response;
  } catch (err) {
    console.log(err);
    return postResponseToCamelCase({});
  }
};
export const getNotes = async ({
  userId,
  noteId
}: {
  userId: string;
  noteId: number;
}): Promise<PhotoNote> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.PHOTO_NOTE}/${noteId}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const post = postToCamelCase(data);
    const notes = (data.notes || []).map(item => ({
      fullNoteUrl: String((item.full_note_url as string) || ''),
      note: String((item.note as string) || ''),
      noteUrl: String((item.note_url as string) || '')
    }));
    const photoNote = { ...post,
      notes
    };
    return photoNote;
  } catch (err) {
    console.log(err);
    return { ...postToCamelCase({}),
      notes: []
    };
  }
};
export const getPost = async ({
  userId,
  postId
}: {
  userId: string;
  postId: number;
}): Promise<Question> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.POST}/${postId}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const {
      feedPostV2UserInfo,
      generalPostSpecificInfo,
      postCharacteristics
    } = data;
    const post = postToCamelCase({ ...feedPostV2UserInfo,
      ...generalPostSpecificInfo,
      ...postCharacteristics
    });
    return post;
  } catch (err) {
    console.log(err);
    return postToCamelCase({});
  }
};
export const getQuestion = async ({
  userId,
  questionId
}: {
  userId: string;
  questionId: number;
}): Promise<Question> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.QUESTION}/${questionId}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const question = postToCamelCase(data);
    return question;
  } catch (err) {
    console.log(err);
    return postToCamelCase({});
  }
};
export const getFlashcards = async ({
  userId,
  flashcardId
}: {
  userId: string;
  flashcardId: number;
}): Promise<Flashcards> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.FLASHCARDS}/${flashcardId}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const post = postToCamelCase(data);
    const deck = data.deck || [];
    const flashcards = { ...post,
      deck
    };
    return flashcards;
  } catch (err) {
    console.log(err);
    return { ...postToCamelCase({}),
      deck: []
    };
  }
};
export const getShareLink = async ({
  userId,
  sharelinkId
}: {
  userId: string;
  sharelinkId: number;
}): Promise<ShareLink> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.SHARELINK}/${sharelinkId}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const post = postToCamelCase(data);
    const uri = String((data.uri as string) || '');
    const shareLink = { ...post,
      uri
    };
    return shareLink;
  } catch (err) {
    console.log(err);
    return { ...postToCamelCase({}),
      uri: ''
    };
  }
};
export const getPostComments = async ({
  userId,
  postId,
  typeId
}: {
  userId: string;
  postId: number;
  typeId: number;
}): Promise<Comments> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.FEED}/${postId}/comments?user_id=${userId}&type_id=${typeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const comments = commentsToCamelCase(data);
    return comments;
  } catch (err) {
    console.log(err);
    return commentsToCamelCase({});
  }
};
export const createComment = async ({
  userId,
  postId,
  typeId,
  comment,
  rootCommentId,
  anonymous,
  parentCommentId
}: {
  userId: string;
  postId: number;
  typeId: number;
  comment: string;
  anonymous: boolean;
  rootCommentId: number | null | undefined;
  parentCommentId: number | null | undefined;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.FEED}/${postId}/comment`, {
      user_id: Number(userId),
      type_id: typeId,
      comment,
      anonymous,
      root_comment_id: rootCommentId,
      parent_comment_id: parentCommentId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const createShareURL = async ({
  userId,
  feedId
}: {
  userId: string;
  feedId: number;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(API_ROUTES.CREATELINK, {
      user_id: Number(userId),
      feed_id: feedId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    const {
      url
    } = data;
    return url;
  } catch (err) {
    console.log(err);
    return '';
  }
};
export const updateShareURL = async ({
  userId,
  sectionId,
  classId,
  uri,
  summary,
  title,
  sharelinkId
}: {
  sharelinkId: number;
  userId: string;
  classId: number;
  sectionId: number | null | undefined;
  uri: string;
  title: string;
  summary: string;
}) => {
  try {
    const token = await getToken();
    const result = await axios.put(`${API_ROUTES.SHARELINK}/${sharelinkId}`, {
      user_id: Number(userId),
      section_id: sectionId,
      title,
      summary,
      uri,
      class_id: classId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return '';
  }
};
export const updateThanks = async ({
  userId,
  postId,
  typeId
}: {
  userId: string;
  postId: number;
  typeId: number;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.FEED}/${postId}/thank`, {
      user_id: Number(userId),
      type_id: typeId,
      token: 'abc'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const addToStudyCircle = async ({
  userId,
  classmateId,
  studyCircleTypeId = 1,
  feedId
}: {
  userId: string;
  classmateId: string;
  studyCircleTypeId?: number;
  feedId: number | null | undefined;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.STUDY_CIRCLE}/${userId}`, {
      study_circle_id: Number(classmateId),
      study_circle_type_id: studyCircleTypeId,
      added_from_feed_id: feedId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const removeFromStudyCircle = async ({
  userId,
  classmateId,
  studyCircleTypeId = 1
}: {
  userId: string;
  classmateId: string;
  studyCircleTypeId?: number;
}) => {
  try {
    const token = await getToken();
    const result = await axios.delete(`${API_ROUTES.STUDY_CIRCLE}/${userId}?study_circle_id=${classmateId}&study_circle_type_id=${studyCircleTypeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const thankComment = async ({
  userId,
  feedId,
  commentId
}: {
  userId: string;
  feedId: number;
  commentId: number;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.COMMENT}/${commentId}/thank`, {
      user_id: Number(userId),
      feed_id: feedId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getReasons = async (reportTypeId: number) => callApi({
  url: `${API_ROUTES.REPORT_REASONS}/${reportTypeId}`,
  method: 'GET'
});
export const updateComment = async (commentId, comment) => callApi({
  url: `${API_ROUTES.COMMENT}/${commentId}`,
  method: 'PUT',
  data: {
    comment
  }
});
export const report = async ({
  reportCreatorId,
  objectCreatorIds,
  reasonId,
  objectId,
  reportTypeId,
  description
}: {
  reportCreatorId: string;
  objectCreatorId: string;
  reasonId: string;
  objectId: number;
  reportTypeId: number;
  description: string;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(API_ROUTES.REPORT, {
      report_creator_id: Number(reportCreatorId),
      object_creator_ids: objectCreatorIds,
      reason_id: Number(reasonId),
      object_id: objectId,
      report_type_id: reportTypeId,
      description
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const bookmark = async ({
  feedId,
  userId,
  remove
}: {
  feedId: number;
  userId: string;
  remove: boolean;
}) => {
  try {
    const token = await getToken();

    if (remove) {
      const result = await axios.delete(`${API_ROUTES.FEED}/${feedId}/bookmark?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const {
        data
      } = result;
      return data;
    }

    const result = await axios.post(`${API_ROUTES.FEED}/${feedId}/bookmark`, {
      user_id: Number(userId)
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const deletePost = async ({
  feedId,
  userId
}: {
  feedId: number;
  userId: string;
}) => {
  try {
    const token = await getToken();
    const result = await axios.delete(`${API_ROUTES.FEED}/${feedId}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getPostMetadata = async ({
  feedId,
  userId
}: {
  feedId: number;
  userId: string;
}): Promise<PostMetaData> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.FEED}/${feedId}/info?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const recommendedPosts = (data.recommended_posts || []).map(item => ({
      id: Number((item.id as number) || 0),
      numberOfNotes: Number((item.page_notes as number) || 0),
      postId: Number((item.post_id as number) || 0),
      typeId: Number((item.type_id as number) || 0),
      userId: String((item.user_id as string) || ''),
      firstName: String((item.first_name as string) || ''),
      lastName: String((item.last_name as string) || ''),
      title: String((item.title as string) || ''),
      description: String((item.description as string) || ''),
      created: String((item.created as string) || ''),
      thanksCount: Number((item.thanks_count as number) || 0),
      viewCount: Number((item.view_count as number) || 0)
    }));
    const tags = (data.tags || []).map(item => ({
      description: String((item.description as string) || ''),
      id: Number((item.id as number) || 0),
      name: String((item.name as string) || '')
    }));
    return {
      recommendedPosts,
      tags
    };
  } catch (err) {
    console.log(err);
    return {
      recommendedPosts: [],
      tags: []
    };
  }
};
export const bestAnswer = async ({
  feedId,
  userId,
  commentId
}: {
  feedId: number;
  userId: string;
  commentId: number;
}) => {
  try {
    const token = await getToken();
    const result = await axios.post(`${API_ROUTES.COMMENT}/${commentId}/accept`, {
      user_id: Number(userId),
      feed_id: feedId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const updatePostView = async ({
  userId,
  postId,
  typeId
}: {
  userId: string;
  postId: number;
  typeId: number;
}) => {
  try {
    const token = await getToken();
    // if (process.env.REACT_APP_STAGE !== 'production') return null;
    const result = await axios.post(`${API_ROUTES.FEED}/${postId}/view`, {
      user_id: Number(userId),
      type_id: typeId // token: 'NA'

    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};
export const getPostInfo = async ({
  hid
}: {
  hid: string;
}): Promise<Post> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.FEED}/link/post?hid=${hid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data = {}
    } = result;
    const post = postToCamelCase(data);
    return post;
  } catch (err) {
    console.log(err);
    return postToCamelCase({});
  }
};
export const deleteComment = async ({
  userId,
  id
}: {
  userId: string;
  id: number;
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.delete(`${API_ROUTES.COMMENT}/${id}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data
    } = result;
    return data;
  } catch (err) {
    console.log(err);
    return {};
  }
};