import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { push } from 'connected-react-router';

import LoadingSpin from '../../components/LoadingSpin/LoadingSpin';
import { joinCommunity } from '../../api/community';
import { setDefaultCommunityIdAction } from '../../actions/chat';

const JoinCommunity = () => {
  const dispatch = useDispatch();
  const { hashId } = useParams();

  useEffect(() => {
    joinCommunity(hashId)
      .then(({ community_id }) => {
        dispatch(setDefaultCommunityIdAction(community_id));
        dispatch(push('/chat'));
      })
      .catch(() => {
        dispatch(push('/'));
      });
  }, [dispatch, hashId]);

  return <LoadingSpin />;
};

export default JoinCommunity;
