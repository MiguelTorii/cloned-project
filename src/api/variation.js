/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios';
import { API_ROUTES } from '../constants/routes';
import { getToken } from './utils';

export const getVariation = async (): Promise<Object> => {
  try {
    const token = await getToken()
    const result = await axios.get(`${API_ROUTES.GET_VARIATION}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (result && result.data) {
      const { data: {
        end_date: endDate,
      } } = result.data
      return {
        endDate
      }
    }

    return null
  } catch (err) {
    return null
  }
}
