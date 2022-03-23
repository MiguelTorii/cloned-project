import { API_URL } from 'constants/routes';

import callApi from './api_base';

export const apiLogViralLoopEmailClicked = async (
  userId: number,
  viralLoopType: string
): Promise<object> =>
  callApi({
    url: `${API_URL}/viral_loop/email/clicked_button`,
    method: 'POST',
    data: {
      user_id: userId,
      viral_loop_type: viralLoopType
    }
  });

export const apiLogViralLoopEmailLogin = async (
  userId: number,
  viralLoopType: string
): Promise<object> =>
  callApi({
    url: `${API_URL}/viral_loop/email/signed_in`,
    method: 'POST',
    data: {
      user_id: userId,
      viral_loop_type: viralLoopType
    }
  });
