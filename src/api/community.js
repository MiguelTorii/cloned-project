// @flow

import axios from 'axios'
import { API_ROUTES } from '../constants/routes'

import { getToken } from './utils'

export const getCommunities = async() => {
  try {
    const token = await getToken();

    const result = await axios.get(`${API_ROUTES.GET_COMMUNITY}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const { data } = result
    return data
  } catch(err) {
    return null
  }
}

export const getCommunityChannels = async ({
  communityId
}: {
  communityId: number
}) => {
  try {
    const token = await getToken()

    const result = await axios.get(
      `${API_ROUTES.GET_COMMUNITY}/${communityId}/channels`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    const { data } = result
    return data
  } catch (err) {
    return null
  }
}