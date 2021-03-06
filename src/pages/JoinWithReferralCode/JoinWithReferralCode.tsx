import React, { useEffect } from 'react';

import { useHistory, useParams } from 'react-router';
import store from 'store';

import { STORAGE_KEYS } from 'constants/app';

const JoinWithReferralCode = () => {
  const { code, schoolId } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (code) {
      store.set(STORAGE_KEYS.REFERRAL_CODE, code);
    }

    history.push(`/login/${schoolId}`);
  }, [code]);

  return <div>Redirecting...</div>;
};

export default JoinWithReferralCode;
