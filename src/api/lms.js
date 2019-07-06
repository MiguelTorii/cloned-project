// @flow

import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import type { LMSSchools } from '../types/models';
import { userToCamelCase } from './utils';

export const getLMSSchools = async (): Promise<LMSSchools> => {
  try {
    const result = await axios.get(API_ROUTES.LMS_SCHOOLS);
    const { data = {} } = result;
    const { schools = [] } = data;

    return schools.map(school => ({
      id: Number((school.id: number) || 0),
      clientId: String((school.client_id: string) || ''),
      school: String((school.school: string) || ''),
      uri: String((school.uri: string) || ''),
      authUri: String((school.auth_uri: string) || ''),
      lmsTypeId: Number((school.lms_type_id: number) || 0)
    }));
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const signLMSUser = async ({
  code,
  grantType,
  clientId,
  lmsTypeId,
  redirectUri
}: {
  code: string,
  grantType: string,
  clientId: string,
  lmsTypeId: number,
  redirectUri: string
}): Promise<Object> => {
  try {
    const result = await axios.post(API_ROUTES.LMS_USER, {
      code,
      grant_type: grantType,
      client_id: clientId,
      lms_type_id: lmsTypeId,
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

export const checkLMSUser = async ({
  nonce
}: {
  nonce: string
}): Promise<Object> => {
  try {
    const result = await axios.post(API_ROUTES.LMS_LOGIN, {
      nonce
    });
    const { data = {} } = result;
    return userToCamelCase(data);
  } catch (err) {
    console.log(err);
    return userToCamelCase({});
  }
};
