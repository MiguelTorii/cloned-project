import axios from 'axios';
import store from 'store';
import { API_ROUTES } from '../constants/routes';
import type { User, School } from '../types/models';
import { userToCamelCase } from './utils';
import { APISchool } from './models/APISchool';

export const emailRequest = async ({
  email,
  reason
}: {
  email: string;
  reason: string;
}): Promise<void> => {
  await axios.post(API_ROUTES.REQUEST, {
    email,
    reason
  });
};
export const signInUser = async (
  email: string,
  password: string,
  schoolId: number
): Promise<User> => {
  const result = await axios.post(API_ROUTES.LOGIN, {
    email,
    password,
    school_id: schoolId
  });
  const { data } = result;
  return userToCamelCase(data);
};
export const samlLogin = async (token, isGondor): Promise<User> => {
  const result = await axios.post(isGondor ? API_ROUTES.SAML_LOGIN_V1_1 : API_ROUTES.SAML_LOGIN, {
    token
  });
  const { data = {} } = result;
  return userToCamelCase(data);
};
export const checkUser = async (token, userId, segment): Promise<User> => {
  const result = await axios.post(API_ROUTES.REFRESH, {
    user_id: Number(userId),
    token,
    segment
  });
  const { data = {} } = result;
  return userToCamelCase(data);
};
export const recoverPassword = async ({ email }: { email: string }): Promise<boolean> => {
  const result = await axios.post(API_ROUTES.RESET_PASSWORD, {
    email
  });
  const { data = {} } = result;
  const { sent = false } = data;
  return sent;
};
export const changePassword = async ({
  email,
  password,
  resetToken
}: {
  email: string;
  password: string;
  resetToken: string | string[];
}): Promise<boolean> => {
  const result = await axios.post(API_ROUTES.CHANGE_PASSWORD, {
    email,
    new_password: password,
    reset_token: resetToken
  });
  const { data = {} } = result;
  const { password_updated: passwordUpdated = false } = data;
  return passwordUpdated;
};
export const searchSchools = async ({ query }: { query: string }): Promise<School[]> => {
  const result: { data: { schools: APISchool[] } } = await axios.get(
    `${API_ROUTES.SEARCH_SCHOOLS}?query=${query}`
  );
  const { schools } = result.data;
  return schools.map((school: APISchool) => ({
    studentLive: school.student_live || 0,
    id: school.id || 0,
    clientId: school.client_id || '',
    school: school.school || '',
    uri: school.uri || '',
    authUri: school.auth_uri || '',
    lmsTypeId: school.lms_type_id || 0,
    emailRestriction: school.email_restriction || false,
    emailDomain: school.email_domain || [],
    scope: school.scope || '',
    launchType: school.launch_type || '',
    connection: school.auth0_connection_name || '',
    redirect_message: school.redirect_message || ''
  }));
};
export const getSchool = async ({ schoolId }: { schoolId: string }): Promise<School> => {
  const result: { data: APISchool } = await axios.get(`${API_ROUTES.GET_SCHOOL}/${schoolId}`);
  const school = result.data;

  return {
    studentLive: school.student_live || 0,
    id: school.id || 0,
    clientId: school.client_id || '',
    school: school.school || '',
    uri: school.uri || '',
    authUri: school.auth_uri || '',
    lmsTypeId: school.lms_type_id || 0,
    emailRestriction: school.email_restriction || false,
    emailDomain: school.email_domain || [],
    scope: school.scope || '',
    launchType: school.launch_type || '',
    connection: school.auth0_connection_name || '',
    redirect_message: school.redirect_message || ''
  };
};
export const verifyEmail = async ({ email }: { email: string }): Promise<boolean> => {
  const result = await axios.get(
    `${API_ROUTES.CHECK_EMAIL}?email=${encodeURIComponent(email)}&user_id=-1&token=NA`
  );
  const { data = {} } = result;
  const { exists } = data;
  return exists;
};
