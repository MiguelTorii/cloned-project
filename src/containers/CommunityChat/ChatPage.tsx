import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@material-ui/core/Box';

import { setCurrentCommunityIdAction } from 'actions/chat';
import { useAppSelector } from 'redux/store';
import LoadingSpin from 'components/LoadingSpin/LoadingSpin';

import DirectChat from './DirectChat';
import CollageList from './CollageList';
import CommunityChat from './CommunityChat';
import useStyles from './_styles/styles';
import { useChannelsMetadata, useSelectChatByIdURL } from 'features/chat';
import { useParams } from 'react-router';

const ChatPage = () => {
  useSelectChatByIdURL();
  const { chatId } = useParams();

  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: channelMetadata } = useChannelsMetadata();

  const {
    data: { communityChannels, communities, currentCommunityId, oneTouchSendOpen }
  } = useAppSelector((state) => state.chat);

  const handleSelect = useCallback(
    (course) => {
      if (course.id !== currentCommunityId) {
        dispatch(setCurrentCommunityIdAction(course.id));
      }
    },
    [currentCommunityId, dispatch]
  );

  useEffect(() => {
    if (oneTouchSendOpen) {
      dispatch(setCurrentCommunityIdAction(null));
    }
  }, [oneTouchSendOpen, dispatch]);

  if (
    // Loading of community channels does not block chat page loading if user is going to direct messages
    (!currentCommunityId && !channelMetadata) ||
    // Communities might take longer to load
    (currentCommunityId && (!communities?.length || !communityChannels?.length))
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
        {currentCommunityId && chatId ? <CommunityChat /> : <DirectChat />}
      </Box>
    </div>
  );
};

export default ChatPage;
