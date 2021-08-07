import callApi from './api_base';
import { API_ROUTES } from '../constants/routes';

export const fetchWeeklyStudyGoals = async () => {
  return callApi({
    url: API_ROUTES.WEEKLY_STUDY_GOALS,
    method: 'GET'
  });
};

export const fetchGreetings = async (localTime) => {
  return callApi({
    url: API_ROUTES.HOME_GREETINGS,
    method: 'GET',
    params: {
      date: localTime
    }
  });
};
