export interface APIChatUser {
  first_name: string;
  last_name: string;
  user_id: number;
  scholarship_points: number;
  state: string;
  joined: string;
  rank: number;
  hours: number;
  school_id: number;
  profile_image_url: string;
  is_online: boolean;
  is_tutor: boolean;
  role: Role | null;
  role_id: number;
  school: string;
  registered: boolean;
  email: string;
}

export type Role = 'Admin' | 'Faculty' | 'Orientation Leader' | 'Student' | 'Tutor';
