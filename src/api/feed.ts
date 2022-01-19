/**
 * - This should be deprecated.
 * - It will be replaced by `apiFetchFeeds`
 * - Jira Ticket: https://circleinapp.atlassian.net/browse/NCGNT-669
 */
import axios from 'axios';
import { API_ROUTES, API_URL_V1_1, API_URL_V1_2 } from '../constants/routes';
import type { TFeedItem } from '../types/models';
import { logEvent } from './analytics';
import { getToken, feedToCamelCase, generateFeedURL, feedToCamelCaseV2 } from './utils';
import reduxStore from '../configureStore';
import { callApi } from './api_base';
import { APIFetchFeedsParams } from './params/APIFetchFeedsParams';

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
  userId: string;
  schoolId: number;
  userClasses: Array<string>;
  index: number;
  limit: number;
  postTypes: Array<string>;
  from?: string;
  query: string;
  fromDate?: Record<string, any> | null | undefined;
  toDate?: Record<string, any> | null | undefined;
}): Promise<TFeedItem[]> => {
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
export const fetchRecommendations = async (limit, request_id) => {
  try {
    const response = await callApi({
      url: API_ROUTES.RECOMMENDATIONS,
      params: {
        limit,
        request_id
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
  results: any[];
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
  userId: string;
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
export const queryFeed = async ({ query }: { query: string }): Promise<TFeedItem[]> => {
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
export const postEvent = async ({
  sectionId,
  category,
  type
}: {
  sectionId: number;
  category: string;
  type: string;
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
  deckId: number;
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
export const apiFetchFeeds = async (params: APIFetchFeedsParams, cancelToken) =>
  callApi({
    url: `${API_URL_V1_1}/feed`,
    params,
    cancelToken
  });
export const apiFetchFeedsV2 = async (params: APIFetchFeedsParams) => {
  const data = await callApi({
    url: `${API_URL_V1_2}/feed`,
    params
  });

  return feedToCamelCaseV2(data.posts);
};

export const apiDeleteFeed = async (userId, feedId) =>
  callApi({
    url: `${API_ROUTES.FEED}/${feedId}?user_id=${userId}`,
    method: 'DELETE'
  });
