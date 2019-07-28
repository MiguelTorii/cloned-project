/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { Feed } from '../types/models';
import { getToken, feedToCamelCase, generateFeedURL } from './utils';

export const fetchFeed = async ({
  userId,
  schoolId,
  userClasses,
  index,
  limit,
  postTypes,
  from,
  query
}: {
  userId: string,
  schoolId: number,
  userClasses: Array<string>,
  index: number,
  limit: number,
  postTypes: Array<string>,
  from: string,
  query: string
}): Promise<Feed> => {
  const url = generateFeedURL({
    userId,
    schoolId,
    userClasses,
    index,
    limit,
    postTypes,
    from,
    query
  });
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.FEED}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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

export const queryFeed = async ({
  query
}: {
  query: string
}): Promise<Array<Object>> => {
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
