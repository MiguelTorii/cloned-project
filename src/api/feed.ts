/* eslint-disable import/prefer-default-export */
import axios from "axios";
import { API_ROUTES } from "../constants/routes";
import type { Feed } from "../types/models";
import { logEvent } from "./analytics";
import { getToken, feedToCamelCase, generateFeedURL } from "./utils";
import reduxStore from "../configureStore";
import { callApi } from "./api_base";

/**
 * - This should be deprecated.
 * - It will be replaced by `apiFetchFeeds`
 * - Jira Ticket: https://circleinapp.atlassian.net/browse/NCGNT-669
 */
export const fetchFeed = async ({
  userId,
  schoolId,
  userClasses,
  index,
  limit,
  postTypes,
  from,
  query,
  fromDate,
  toDate
}: {
  userId: string,
  schoolId: number,
  userClasses: Array<string>,
  index: number,
  limit: number,
  postTypes: Array<string>,
  from: string,
  query: string,
  fromDate: Record<string, any> | null | undefined,
  toDate: Record<string, any> | null | undefined
}): Promise<Feed> => {
  const url = generateFeedURL({
    userId,
    schoolId,
    userClasses,
    index,
    limit,
    postTypes,
    from,
    query,
    fromDate,
    toDate
  });

  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.FEED_V1_1}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: { posts }
    } = result;
    const feed = feedToCamelCase(posts);

    try {
      if (query !== '') {
        logEvent({
          event: 'Feed- Start Search',
          props: {
            Query: query
          }
        });
      }
    } catch (err) {
      console.log(err);
    }

    return feed;
  } catch (err) {
    console.log(err);
    return [];
  }
};
export const fetchRecommendations = async (limit) => {
  try {
    const response = await callApi({
      url: API_ROUTES.RECOMMENDATIONS,
      params: {
        limit
      }
    });
    const posts = response || [];
    return feedToCamelCase(posts);
  } catch {
    return [];
  }
};
export const saveQuizAnswers = async ({
  results
}: {
  results: array
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.post(
      `${API_ROUTES.FLASHCARDS}/save_quiz_answers`,
      {
        answers: results
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const {
      data: { session_id: sessionId }
    } = result;
    return {
      sessionId
    };
  } catch (err) {
    return null;
  }
};
export const feedResources = async ({
  userId
}: {
  userId: string
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.SYNC}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: {
        institution_resources: {
          display_on_feed: display,
          small_logo: smallLogo,
          large_logo: largeLogo,
          feed_resources_title: resourcesTitle,
          feed_resources_body: resourcesBody
        }
      }
    } = result;
    return {
      smallLogo,
      largeLogo,
      display,
      resourcesTitle,
      resourcesBody
    };
  } catch (err) {
    return null;
  }
};
export const queryFeed = async ({
  query
}: {
  query: string
}): Promise<Array<Record<string, any>>> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.SEARCH}?query=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const {
      data: { results }
    } = result;
    const feed = feedToCamelCase(results);
    return feed;
  } catch (err) {
    console.log(err);
    return [];
  }
};
export const fetchFeedv2 = async ({
  userId,
  sectionId,
  bookmarked = false
}: {
  userId: string,
  sectionId: number,
  bookmarked?: boolean
}): Promise<Feed> => {
  try {
    const filterSection = sectionId ? `&section_id=${sectionId}` : '';
    const token = await getToken();
    const myPosts = bookmarked ? '' : `user_id=${userId}`;
    const result = await axios.get(
      `${API_ROUTES.FEED_V1_1}?${myPosts}${filterSection}&bookmarked=${Boolean(
        bookmarked
      ).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const {
      data: { posts }
    } = result;
    const feed = feedToCamelCase(posts);
    return feed;
  } catch (err) {
    console.log(err);
    return [];
  }
};
export const postEvent = async ({
  sectionId,
  category,
  type
}: {
  sectionId: number,
  category: string,
  type: string
}): Promise<Array<Record<string, any>>> => {
  if (reduxStore.getState().user.isMasquerading) {
    return;
  }

  try {
    const token = await getToken();
    const result = await axios.post(
      `${API_ROUTES.EVENT}`,
      {
        section_id: sectionId,
        category,
        type
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const {
      data: { success }
    } = result;
    return success;
  } catch (err) {
    return null;
  }
};
export const generateQuiz = async ({
  deckId
}: {
  deckId: number
}): Promise<Record<string, any>> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.FLASHCARDS}/${deckId}/generate_quiz`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return result.data;
  } catch (err) {
    return null;
  }
};

/**
 * Fetch feed data.
 */
export const apiFetchFeeds = async (params, cancelToken) => callApi({
  url: API_ROUTES.FEED_V1_1,
  params,
  cancelToken
});
export const apiDeleteFeed = async (userId, feedId) => callApi({
  url: `${API_ROUTES.FEED}/${feedId}?user_id=${userId}`,
  method: 'DELETE'
});
