export type APISchool = {
  id: number;
  client_id: string;
  school: string;
  student_live: number;
  uri: string;
  auth_uri: string;
  lms_type_id: number;
  email_restriction: boolean;
  email_domain: Array<string>;
  scope: string;
  launch_type: string;
  auth0_connection_name: string;
  redirect_message: string;
};
