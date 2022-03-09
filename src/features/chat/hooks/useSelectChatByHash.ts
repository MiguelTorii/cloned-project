import { setCurrentChannelSidAction } from 'actions/chat';
import { enqueueSnackbar } from 'actions/notifications';
import { getChatIdFromHash } from 'api/chat';
import { push } from 'connected-react-router';
import { usePrevious } from 'hooks';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from 'redux/store';

export const useSelectChatByHash = () => {
  const { hashId } = useParams();
  const previousHashId = usePrevious(hashId);
  const selectedChanneId = useAppSelector((state) => state.chat.data.selectedChannelId);
  const previousSelectedId = usePrevious(selectedChanneId);
  const [chatIdFromHash, setChatIdFromHash] = useState<string>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const validateChatId = async () => {
      const chatId = await getChatIdFromHash(hashId);
      if (chatId) {
        setChatIdFromHash(chatId);
        dispatch(setCurrentChannelSidAction(chatId));
      } else {
        // invalid channel, redirect to homepage with notification
        enqueueSnackbar({
          notification: {
            message: 'Chat link is invalid!',
            options: {
              variant: 'error',
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              autoHideDuration: 3000
            }
          }
        });
        dispatch(push('/'));
      }
    };

    if (hashId && previousHashId !== hashId) {
      validateChatId();
    }
  }, [dispatch, hashId, previousHashId]);

  useEffect(() => {
    // If there's a current hashId and selectedChannel changed, remove hash from url
    // The user refreshing should not keep them in the same chat
    const effectHasRan = hashId && chatIdFromHash;
    const selectedHasChanged = previousSelectedId && previousSelectedId !== selectedChanneId;
    if (effectHasRan && selectedHasChanged && previousSelectedId === chatIdFromHash) {
      dispatch(push('/chat'));
    }
  }, [hashId, selectedChanneId, previousSelectedId, dispatch, chatIdFromHash]);
};
