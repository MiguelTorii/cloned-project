// TODO figure out why these are different

export type APIFlashcard = {
  id: number;
  question: string;
  answer: string;
  question_image_url: string;
  answer_image_url: string;
};

export type APIFlashCard2 = {
  id: number;
  question: string;
  answer: string;
  marked_hard_count: number;
  marked_medium_count: number;
};
