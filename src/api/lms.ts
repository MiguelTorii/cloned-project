import axios from "axios";
import { API_ROUTES } from "../constants/routes";
import type { LMSSchools } from "../types/models";
import { userToCamelCase } from "./utils";
export const getLMSSchools = async (): Promise<LMSSchools> => {
  try {
    const result = await axios.get(API_ROUTES.LMS_SCHOOLS);
    const {
      data = {}
    } = result;
    const {
      schools = []
    } = data;
    return schools.map(school => ({
      id: Number((school.id as number) || 0),
      clientId: String((school.client_id as string) || ''),
      school: String((school.school as string) || ''),
      uri: String((school.uri as string) || ''),
      authUri: String((school.auth_uri as string) || ''),
      lmsTypeId: Number((school.lms_type_id as number) || 0)
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
  dashboard: boolean;
  redirectUri: string;
}): Promise<Record<string, any>> => {
  try {
    const result = await axios.post(API_ROUTES.LMS_USER, {
      code,
      dashboard,
      grant_type: grantType,
      client_id: clientId,
      lms_type_id: lmsTypeId,
      redirect_uri: redirectUri
    });
    const {
      data = {}
    } = result;

    if (data?.redirect_url) {
      window.location = data.redirect_url;
    }

    return userToCamelCase(data);
  } catch (err) {
    console.log(err);
    return userToCamelCase({});
  }
};
export const checkCanvasUser = async ({
  nonce
}: {
  nonce: string;
}): Promise<Record<string, any>> => {
  try {
    const result = await axios.post(API_ROUTES.CANVAS_LOGIN, {
      nonce
    });
    const {
      data = {}
    } = result;
    return userToCamelCase(data);
  } catch (err) {
    console.log(err);
    return userToCamelCase({});
  }
};
// LTI
export const checkLMSUser = async ({
  nonce
}: {
  nonce: string;
}): Promise<Record<string, any>> => {
  try {
    const result = await axios.post(API_ROUTES.LMS_LOGIN, {
      nonce
    });
    const {
      data = {}
    } = result;
    return userToCamelCase(data);
  } catch (err) {
    console.log(err);
    return userToCamelCase({});
  }
};