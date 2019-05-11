// @flow

import axios from 'axios';
import { API_ROUTES } from '../constants/routes';

export const fetchSchools = async ({ stateId }: { stateId: number }) => {
  const result = await axios.get(
    `${API_ROUTES.FETCH_SCHOOLS}?state_id=${stateId}`
  );
  const { data = {} } = result;
  const { schools } = data;
  return schools;
};

export const sendCode = async ({ email }: { email: string }) => {
  const result = await axios.post(API_ROUTES.SEND_CODE, {
    email
  });
  const { data = {} } = result;
  return data;
};

export const verifyCode = async ({
  email,
  code
}: {
  email: string,
  code: string
}) => {
  const result = await axios.post(API_ROUTES.VERIFY_EMAIL, {
    email,
    code
  });
  const { data = {} } = result;
  return data;
};

export const createAccount = async ({
  state,
  grade,
  school,
  studentId,
  firstName,
  lastName,
  gender,
  password,
  birthday,
  email,
  phone,
  parentFirstName,
  parentLastName,
  parentPhone,
  parentEmail,
  segment
}: {
  state: number,
  grade: number,
  school: string,
  studentId: string,
  firstName: string,
  lastName: string,
  gender: number,
  password: string,
  birthday: string,
  email: string,
  phone: string,
  parentFirstName: string,
  parentLastName: string,
  parentPhone: string,
  parentEmail: string,
  segment: string
}) => {
  const result = await axios.post(API_ROUTES.SIGNUP, {
    state,
    grade,
    school_id: String(school),
    studentId,
    first_name: firstName,
    last_name: lastName,
    gender,
    password,
    birthday,
    email,
    cell: phone,
    parent_first_name: parentFirstName,
    parent_last_name: parentLastName,
    parent_cell_phone: parentPhone,
    parent_email: parentEmail,
    segment
  });
  const { data = {} } = result;
  console.log(data);
  return data;
};
