export type APIFetchFeedsParams = {
  // NOTE: `user_id` is optional, but do not pass `0` because the API will not
  // return any reliable results.
  user_id?: number;

  school_id?: number;
  index: number;
  limit: number;
  bookmarked: boolean;
  query?: string;
  section_id?: string[];
  tool_type_id?: string[] | number; // TODO figure out the correct type here.
  from_date?: Object;
  to_date?: Object;
};
