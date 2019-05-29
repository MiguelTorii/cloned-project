// @flow

import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { LMSSchools } from '../types/models';
import { userToCamelCase } from './utils';

export const getLMSSchools = async (): Promise<LMSSchools> => {
  try {
    const result = await axios.get(API_ROUTES.CANVAS_SCHOOLS);
    const { data = {} } = result;
    const { schools = [] } = data;
    return schools.map(school => ({
      clientId: String((school.client_id: string) || ''),
      school: String((school.school: string) || ''),
      uri: String((school.uri: string) || '')
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const signLMSUser = async ({
  code,
  uri,
  grantType,
  clientId,
  redirectUri
}: {
  code: string,
  uri: string,
  grantType: string,
  clientId: string,
  redirectUri: string
}): Promise<Object> => {
  try {
    const result = await axios.post(API_ROUTES.CANVAS_USER, {
      code,
      uri,
      grant_type: grantType,
      client_id: clientId,
      redirect_uri: redirectUri
    });
    const { data = {} } = result;
    return userToCamelCase(data);
  } catch (err) {
    console.log(err);
    return userToCamelCase({});
  }
};

export const checkCanvasUser = async ({
  nonce
}: {
  nonce: string
}): Promise<Object> => {
  try {
    const result = await axios.post(API_ROUTES.CANVAS_LOGIN, {
      nonce
    });
    const { data = {} } = result;
    return userToCamelCase(data);
  } catch (err) {
    console.log(err);
    return userToCamelCase({});
  }
};
