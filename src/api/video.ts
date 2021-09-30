import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
// import type { ToDos } from '../types/models';
import { getToken } from './utils';
export const checkVideoSession = async ({ userId }: { userId: string }): Promise<boolean> => {
  try {
    const token = await getToken();
    const result = await axios.get(`${API_ROUTES.VIDEO_SESSION_CHECK}?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { data = {} } = result;
    const { success = false } = data;
    return success;
  } catch (err) {
    console.log(err);
    return false;
  }
};
export const setVideoInitiator = async ({
  userId,
  sid
}: {
  userId: string,
  sid: string
}): Promise<boolean> => {
  try {
    const token = await getToken();
    const result = await axios.post(
      API_ROUTES.VIDEO_INITIATOR,
      {
        user_id: Number(userId),
        room_sid: sid
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    const { success = false } = data;
    return success;
  } catch (err) {
    console.log(err);
    return false;
  }
};
export const postVideoPoints = async ({
  userId,
  sid,
  length,
  purposeId,
  scheduledTime,
  openAnswer,
  participants,
  classId,
  sectionId
}: {
  userId: string,
  sid: string,
  length: number,
  purposeId: number,
  scheduledTime: number,
  openAnswer: string,
  participants: Array<number>,
  classId: number,
  sectionId?: number
}): Promise<boolean> => {
  try {
    const token = await getToken();
    const result = await axios.post(
      API_ROUTES.VIDEO_SESSION,
      {
        user_id: Number(userId),
        room_sid: sid,
        length,
        purpose_id: purposeId,
        scheduled_time: scheduledTime,
        open_answer: openAnswer,
        participants,
        class_id: classId,
        section_id: sectionId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { data = {} } = result;
    console.log(data);
    const { success = false } = data;
    return success;
  } catch (err) {
    console.log(err);
    return false;
  }
};
