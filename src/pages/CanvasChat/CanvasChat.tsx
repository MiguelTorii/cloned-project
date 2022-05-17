import { useCallback, useContext, useEffect, useState } from 'react';

import store from 'store';
import { createGlobalStyle } from 'styled-components';

import Box from '@material-ui/core/Box';

import { rootActions } from 'constants/action-types';
import { CANVAS_CHAT_STORAGE_CHECK_INTERVAL, STORAGE_KEYS } from 'constants/app';

import { disableChatRedirects } from 'actions/chat';
import { checkUserSession } from 'actions/sign-in';
import CreateChatChannelInput from 'components/CreateCommunityChatChannelInput/CreateChatChannelInput';
import LoadingSpin from 'components/LoadingSpin';
import CanvasHeader from 'containers/canvas/CanvasHeader';
import CanvasChatContext, { Provider as CanvasChatProvider } from 'contexts/CanvasChatContext';
import { useAppDispatch, useAppSelector } from 'redux/store';

import useStyles from './CanvasChatStyles';
import CanvasCommunityChat from './CanvasCommunityChat';
import CanvasDirectChat from './CanvasDirectChat';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: transparent;
  }
`;

const CanvasChat = () => {
  const dispatch = useAppDispatch();
  const [hasToken, setHasToken] = useState(false);
  const classes = useStyles();
  const user = useAppSelector((state) => state.user.data);
  const { isCommunityChat, selectChannel } = useContext(CanvasChatContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const authToken = store.get(STORAGE_KEYS.AUTH_TOKEN);
      setHasToken(!!authToken);
    }, CANVAS_CHAT_STORAGE_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (hasToken) {
      dispatch(checkUserSession());
    } else {
      dispatch({ type: rootActions.CLEAR_STATE });
    }
  }, [dispatch, hasToken]);

  useEffect(() => {
    dispatch(disableChatRedirects());
  }, [dispatch]);

  const { permission } = useAppSelector((state) => state.user.data);

  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const handleCreateChannel = useCallback(() => {
    setIsCreateChannelModalOpen(true);
  }, []);
  const handleCreateChannelSuccess = useCallback(
    (channel) => {
      setIsCreateChannelModalOpen(false);
      selectChannel(channel.sid);
    },
    [selectChannel]
  );

  const askPermission = () => {
    document.requestStorageAccess().then(
      () => {
        console.log('access granted');
        localStorage.setItem('VALID_TOKEN', 'Hello world');
      },
      () => {
        console.log('access denied');
      }
    );
  };

  const openClick = () => {
    // const width = 1024;
    // const height = 768;
    // const top = (screen.height - height) / 2;
    // const left = (screen.width - width) / 2;

    const isComptatibleWithRequestApi =
      navigator.userAgent.includes('Firefox') || navigator.userAgent.includes('Safari');

    if (isComptatibleWithRequestApi) {
      askPermission();
    }

    // window.open(
    //   `http:localhost:2000/auth?source=canvas`,
    //   'authPopup',
    //   `menubar=no,toolbar=no,width=${width},height=${height},top=${top},left=${left}`
    // );
  };

  if (!user.userId) {
    return (
      <Box mt={3}>
        <LoadingSpin />
        <button type="button" onClick={openClick}>
          click
        </button>
      </Box>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Box className={classes.main}>
        <CanvasHeader onNewChannelClick={handleCreateChannel} />

        {isCommunityChat ? <CanvasCommunityChat /> : <CanvasDirectChat />}

        {isCreateChannelModalOpen && (
          <div className={classes.createChannelModalOverlay}>
            <div className={classes.createChannelModalInner}>
              <CreateChatChannelInput
                setIsOpen={setIsCreateChannelModalOpen}
                onClosePopover={() => setIsCreateChannelModalOpen(false)}
                permission={permission}
                handleUpdateGroupName={() => {}}
                externalClasses={{
                  root: classes.createChannelModalRoot
                }}
                onSuccess={handleCreateChannelSuccess}
              />
            </div>
          </div>
        )}
      </Box>
    </>
  );
};

export default () => (
  <CanvasChatProvider>
    <CanvasChat />
  </CanvasChatProvider>
);
