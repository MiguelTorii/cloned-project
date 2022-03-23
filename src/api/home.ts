import { API_ROUTES } from 'constants/routes';

import callApi from './api_base';

export const fetchWeeklyStudyGoals = async () =>
  callApi({
    url: API_ROUTES.WEEKLY_STUDY_GOALS,
    method: 'GET'
  });
export const fetchGreetings = async (localTime) =>
  callApi({
    url: API_ROUTES.HOME_GREETINGS,
    method: 'GET',
    params: {
      date: localTime
    }
  });
