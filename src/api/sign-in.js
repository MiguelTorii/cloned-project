// @flow
import axios from 'axios';
import store from 'store';
import { API_ROUTES } from '../constants/routes';
import type { User, Schools } from '../types/models';

export const signInUser = async (
  email: string,
  password: string,
  schoolId: number,
  appId: int
): Promise<User | {}> => {
  try {
    const result = await axios.post(API_ROUTES.LOGIN, {
      email,
      password,
      school_id: schoolId,
      application_id: appId
    });
    const { data } = result;
    return data;
  } catch (err) {
    throw err;
  }
};

export const samlLogin = async (token): User | {} => {
  try {
    const role = store.get('ROLE')
    let appId = 1
    if (role === 'faculty') {
      appId = 2
    }
    if(role === 'tutor') {
      appId = 3
    }

    const result = await axios.post(API_ROUTES.SAML_LOGIN, {
      application_id: appId,
      token
    });
    const { data = {} } = result;
    return (data: User | {});
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const checkUser = async (): User | {} => {
  try {
    const token = store.get('REFRESH_TOKEN');
    const userId = store.get('USER_ID');
    const segment = store.get('SEGMENT');
    if (segment === '' || userId === '' || token === '' || !userId) {
      return {};
    }

    const result = await axios.post(API_ROUTES.REFRESH, {
      user_id: Number(userId),
      token,
      segment
    });

    const { data = {} } = result;
    return (data: User | {});
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const recoverPassword = async ({
  email
}: {
  email: string
}): Promise<boolean> => {
  try {
    const result = await axios.post(API_ROUTES.RESET_PASSWORD, {
      email
    });
    const { data = {} } = result;
    const { sent = false } = data;
    return sent;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const changePassword = async ({
  email,
  password,
  resetToken
}: {
  email: string,
  password: string,
  resetToken: string
}): Promise<boolean> => {
  try {
    const result = await axios.post(API_ROUTES.CHANGE_PASSWORD, {
      email,
      new_password: password,
      reset_token: resetToken
    });
    const { data = {} } = result;
    const { password_updated: passwordUpdated = false } = data;
    return passwordUpdated;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const searchSchools = async ({
  query
}: {
  query: string
}): Promise<Schools> => {
  try {
    const result = await axios.get(
      `${API_ROUTES.SEARCH_SCHOOLS}?query=${query}`
    );
    const { data = {} } = result;
    const { schools = [] } = data;

    return schools.map(school => ({
      id: Number((school.id: number) || 0),
      clientId: String((school.client_id: string) || ''),
      school: String((school.school: string) || ''),
      uri: String((school.uri: string) || ''),
      authUri: String((school.auth_uri: string) || ''),
      lmsTypeId: Number((school.lms_type_id: number) || 0),
      emailRestriction: Boolean((school.email_restriction: boolean) || false),
      emailDomain: school.email_domain || [],
      scope: String((school.scope: string) || ''),
      launchType: String((school.launch_type: string) || ''),
      connection: String((school.auth0_connection_name: string) || ''),
      redirect_message: String((school.redirect_message: string) || '')
    }));
  } catch (err) {
    return [];
  }
};

export const verifyEmail = async ({
  email
}: {
  email: string
}): Promise<boolean> => {
  try {
    const result = await axios.get(
      `${API_ROUTES.CHECK_EMAIL}?email=${encodeURIComponent(
        email
      )}&user_id=-1&token=NA`
    );
    const { data = {} } = result;
    const { exists } = data;
    return exists;
  } catch (err) {
    return false;
  }
};
