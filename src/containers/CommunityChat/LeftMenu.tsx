import { useEffect, useState, useCallback } from 'react';

import clsx from 'clsx';
import Fuse from 'fuse.js';
import { useParams } from 'react-router';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import { PERMISSIONS } from 'constants/common';
import { getTitle } from 'utils/chat';

import { handleNewChannel, navigateToDM, setOneTouchSendAction } from 'actions/chat';
import { ReactComponent as ChatSearchIcon } from 'assets/svg/chat-search.svg';
import BaseChatItem from 'components/CommunityChatListItem/BaseChatItem';
import ChatListItem from 'components/CommunityChatListItem/ChatListItem';
import CreateChatChannelInput from 'components/CreateCommunityChatChannelInput/CreateChatChannelInput';
import OneTouchSend from 'components/CreateCommunityChatChannelInput/OneTouchSend';
import Dialog from 'components/Dialog/Dialog';
import { useChannels, useOrderedChannelList, useChannelsMetadata } from 'features/chat';
import { useAppSelector, useAppDispatch } from 'redux/store';

import useStyles from './_styles/leftMenu';
import EmptyLeftMenu from './EmptyLeftMenu';

type Props = {
  onOpenChannel?: (id: string) => void;
  handleRemoveChannel?: (...args: Array<any>) => any;
  onNewChannel?: (...args: Array<any>) => any;
  handleMuteChannel?: (...args: Array<any>) => any;
  handleUpdateGroupName?: (...args: Array<any>) => any;
};

const LeftMenu = ({
  handleMuteChannel,
  onOpenChannel,
  onNewChannel,
  handleRemoveChannel,
  handleUpdateGroupName
}: Props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState();
  const [searchChannels, setSearchChannels] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const expertMode = useAppSelector((state) => state.user.expertMode);
  const {
    data: { newChannel, selectedChannelId, oneTouchSendOpen, openChannels },
    isLoading: isChatLoading
  } = useAppSelector((state) => state.chat);

  const { chatId } = useParams();

  const { userId, permission } = useAppSelector((state) => state.user.data);

  const { isLoading: channelsIsLoading, data: channels } = useChannels();
  const { data: channelsMetadata } = useChannelsMetadata();
  const channelList = useOrderedChannelList();

  const isLoading = isChatLoading || channelsIsLoading;

  const switchOneTouchSend = permission?.includes(PERMISSIONS.EXPERT_MODE_ACCESS) && expertMode;

  const handleCreateNewChannel = useCallback(() => {
    setIsOpen(true);

    if (!switchOneTouchSend) {
      onNewChannel?.();
    }
  }, [onNewChannel, switchOneTouchSend]);

  const handleClose = () => {
    setIsOpen(false);

    dispatch(setOneTouchSendAction(false));

    dispatch(handleNewChannel(false));
    // TODO Remove and only use channelId
    const lastChannelSid = localStorage.getItem('currentDMChannel') || channels?.[0].sid;
    if (lastChannelSid) {
      dispatch(navigateToDM(lastChannelSid));
    }
  };

  const onChangeSearch = (e) => setSearch(e.target.value);

  useEffect(() => {
    if (oneTouchSendOpen) {
      handleCreateNewChannel();
    }
  }, [oneTouchSendOpen, handleCreateNewChannel]);

  useEffect(() => {
    if (search && channels) {
      const list = channels.map((c) => ({
        name: getTitle(c, userId, channelsMetadata?.users),
        channel: c
      }));
      const options = {
        includeScore: true,
        threshold: 0,
        keys: ['name']
      };
      const fuse = new Fuse(list, options);
      const result = fuse.search(search).map((c) => c.item.channel.sid);
      setSearchChannels(result);
    } else {
      setSearchChannels(channels ? channels.map((c) => c.sid) : []);
    }
  }, [search, channels, userId, channelsMetadata?.users]);

  return (
    <Grid
      item
      classes={{
        root: classes.container
      }}
    >
      <Grid item className={classes.gridItem}>
        <div className={classes.search}>
          <InputBase
            onChange={onChangeSearch}
            value={search || ''}
            startAdornment={
              <InputAdornment position="start">
                <ChatSearchIcon />
              </InputAdornment>
            }
            placeholder="Find your chats or classmates..."
            classes={{
              root: classes.inputRoot,
              input: classes.placeholderInput
            }}
            inputProps={{
              'aria-label': 'search'
            }}
            fullWidth
          />
        </div>
      </Grid>
      <Grid
        container
        classes={{
          root: isLoading ? classes.loadingContainer : classes.container
        }}
      >
        {(!!channelList.length || isLoading) && (
          <Grid
            container
            classes={{
              root: classes.header
            }}
            justifyContent="center"
            alignItems="center"
            direction="column"
          >
            <Typography className={classes.createNewChate} variant="subtitle1" component="p">
              Create New Chat
            </Typography>

            <Button
              variant="contained"
              classes={{
                root: classes.newButton
              }}
              color="primary"
              onClick={handleCreateNewChannel}
            >
              +
            </Button>
          </Grid>
        )}
        <Dialog
          className={classes.selectClassmates}
          open={isOpen}
          onCancel={handleClose}
          showHeader={false}
          showActions={false}
        >
          {switchOneTouchSend ? (
            <OneTouchSend
              setIsOpen={setIsOpen}
              onClosePopover={handleClose}
              onOpenChannel={onOpenChannel}
              permission={permission}
              handleUpdateGroupName={handleUpdateGroupName}
            />
          ) : (
            <CreateChatChannelInput
              setIsOpen={setIsOpen}
              onClosePopover={handleClose}
              permission={permission}
              handleUpdateGroupName={handleUpdateGroupName}
            />
          )}
        </Dialog>
        <Grid item className={isLoading ? classes.gridChatListLoading : classes.gridChatList}>
          <EmptyLeftMenu
            emptyChannels={channelList.length === 0}
            handleCreateNewChannel={handleCreateNewChannel}
            isLoading={isLoading}
          />
          <List className={classes.root}>
            {newChannel && <BaseChatItem roomName="New Chat" selected />}
            {channelList.map((id) => (
              <div key={id} className={clsx(!searchChannels.includes(id) && classes.hidden)}>
                <ChatListItem
                  selected={id === chatId}
                  channelId={id}
                  onOpenChannel={onOpenChannel}
                  handleRemoveChannel={handleRemoveChannel}
                  handleMuteChannel={handleMuteChannel}
                  handleUpdateGroupName={handleUpdateGroupName}
                  dark
                />
              </div>
            ))}
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LeftMenu;
