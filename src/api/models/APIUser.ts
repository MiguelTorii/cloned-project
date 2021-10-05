import type { UpdateProfile } from '../../types/models';

export type APIUser = {
  user_id: string;
  nonce: string;
  email: string;
  first_name: string;
  last_name: string;
  school: string;
  school_id: number;
  segment: string;
  twilio_token: string;
  canvas_user: boolean;
  grade_id: number;
  jwt_token: string;
  refresh_token: string;
  profile_image_url: string;
  rank: number;
  referral_code: string;
  update_profile: UpdateProfile[];
  lms_type_id: number;
  lms_user: boolean;
  permission: string;
};
