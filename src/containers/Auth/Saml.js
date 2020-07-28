import React, { useEffect } from 'react';
import queryString from 'query-string';

export default () => {
  const getAccessToken = (url) => {
    const start = url.indexOf('access_token');
    const search = `?${url.substring(start)}`;
    const { access_token: accessToken } = queryString.parse(search);

    return accessToken;
  }

  useEffect(() => {
    console.log(getAccessToken(window.location.href));
  })

  return (
    <div>Redirecting...</div>
  )
}

