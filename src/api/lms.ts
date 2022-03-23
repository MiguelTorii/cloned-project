import axios from 'axios';

import { API_ROUTES } from 'constants/routes';

import { userToCamelCase } from './utils';

import type { APILMSSchool } from './models/APILMSSchool';
import type { LMSSchool } from 'types/models';

export const getLMSSchools = async (): Promise<LMSSchool[]> => {
  try {
    const result = await axios.get(API_ROUTES.LMS_SCHOOLS);
    const { data = {} } = result;
    const { schools = [] } = data;
    return schools.map((school: APILMSSchool) => ({
      id: school.id || 0,
      clientId: school.client_id || '',
      school: school.school || '',
      uri: school.uri || '',
      authUri: school.auth_uri || '',
      lmsTypeId: school.lms_type_id || 0
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
  dashboard,
  redirectUri
}: {
  code: string;
  grantType: string;
  clientId: string;
  lmsTypeId: number;
  dashboard?: boolean;
  redirectUri: string;
}): Promise<Record<string, any>> => {
  const result = await axios.post(API_ROUTES.LMS_USER, {
    code,
    dashboard,
    grant_type: grantType,
    client_id: clientId,
    lms_type_id: lmsTypeId,
    redirect_uri: redirectUri
  });
  const { data = {} } = result;

  if (data?.redirect_url) {
    window.location = data.redirect_url;
  }

  return userToCamelCase(data);
};
export const checkCanvasUser = async ({
  nonce
}: {
  nonce: string;
}): Promise<Record<string, any>> => {
  const result = await axios.post(API_ROUTES.CANVAS_LOGIN, {
    nonce
  });
  const { data = {} } = result;
  return userToCamelCase(data);
};
// LTI
export const checkLMSUser = async ({ nonce }: { nonce: string }): Promise<Record<string, any>> => {
  const result = await axios.post(API_ROUTES.LMS_LOGIN, {
    nonce
  });
  const { data = {} } = result;
  return userToCamelCase(data);
};
