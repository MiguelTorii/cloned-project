import type { APIFlashCard2 } from './APIFlashcard';
import type { APIPostInfo } from './APIPostInfo';

export type APIFlashcardDeck = {
  best_answer: boolean;
  body: string;
  bookmarked: boolean;
  class_id: number;
  classroom_name: string;
  course_display_name: string;
  created: string;
  deck: APIFlashCard2[];
  feed_id: number;
  full_note_url: string;
  grade: number;
  in_study_circle: boolean;
  is_online: boolean;
  name: string;
  note: string;
  note_url: string;
  notes: any[];
  pages_notes: number;
  post_id: number;
  post_info: APIPostInfo;
  rank: number;
  read_only: boolean;
  reports: number;
  role: string;
  role_id: number;
  school: string;
  school_id: number;
  subject: string;
  tags: any[];
  thanked: boolean;
  title: string;
  type_id: number;
  uri: string;
  user_id: number;
  user_profile_url: string;
};
