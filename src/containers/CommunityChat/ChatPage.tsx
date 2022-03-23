import { useCallback, useEffect } from 'react';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';

import Box from '@material-ui/core/Box';

import { URL } from 'constants/navigation';

import { navigateToOtherCommunity } from 'actions/chat';
import LoadingSpin from 'components/LoadingSpin/LoadingSpin';
import {
  useChannelsMetadata,
  useChatParams,
  useJoinChatByHash,
  useSelectChatByIdURL
} from 'features/chat';
import { useAppSelector } from 'redux/store';

import useStyles from './_styles/styles';
import CollageList from './CollageList';
import CommunityChat from './CommunityChat';
import DirectChat from './DirectChat';

const ChatPage = () => {
  useJoinChatByHash();
  useSelectChatByIdURL();
  const { communityId } = useChatParams();

  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: channelMetadata } = useChannelsMetadata();

  const {
    data: { communityChannels, communities, oneTouchSendOpen }
  } = useAppSelector((state) => state.chat);

  const handleSelect = useCallback(
    (course) => {
      if (course.id === communityId) return;
      dispatch(navigateToOtherCommunity(course.id));
    },
    [communityId, dispatch]
  );

  useEffect(() => {
    if (oneTouchSendOpen && Number(communityId)) {
      dispatch(push(`${URL.CHAT}/0}`));
    }
  }, [oneTouchSendOpen, dispatch, communityId]);

  if (
    // Loading of community channels does not block chat page loading if user is going to direct messages
    (!communityId && !channelMetadata) ||
    // Communities might take longer to load
    (communityId && (!communities?.length || !communityChannels?.length))
  ) {
    return <LoadingSpin />;
  }

  return (
    <div className={classes.root}>
      <Box className={classes.collageList}>
        <CollageList
          communities={communities}
          communityChannels={communityChannels}
          handleSelect={handleSelect}
        />
      </Box>
      <Box className={classes.directChat}>
        {Number(communityId) ? <CommunityChat /> : <DirectChat />}
      </Box>
    </div>
  );
};

export default ChatPage;
