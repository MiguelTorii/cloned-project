export type APIPostResponse = {
  community_service_hours: number;
  link_id: number;
  links_left: number;
  points: number;
  question_id: number;
  questions_left: number;
  is_first_note: boolean;
  notes_left: number;
  photo_note_id: number;
  decks_left: number;
  fc_id: number;
  user: {
    first_name: string;
    hours: number;
    joined: string;
    last_name: string;
    profile_image_url: string;
    rank: number;
    scholarship_points: number;
    school_id: number;
    state: string;
    user_id: number;
  };
  classes: string[];
  post_id: number;
  posts_left: number;
};
