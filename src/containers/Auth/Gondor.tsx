import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import { samlLogin } from 'actions/sign-in';

const Gondor = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('jwt');
    dispatch(samlLogin(token, true));
  }, [dispatch, location]);
  return <div>Redirecting...</div>;
};

export default Gondor;
