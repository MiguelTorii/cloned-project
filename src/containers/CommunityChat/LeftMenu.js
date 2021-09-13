// @flow

import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
// import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Fuse from 'fuse.js';

import ChatListItem from 'components/CommunityChatListItem/ChatListItem';
import CreateChatChannelInput from 'components/CreateCommunityChatChannelInput/CreateChatChannelInput';
import OneTouchSend from 'components/CreateCommunityChatChannelInput/OneTouchSend';
import Dialog from 'components/Dialog/Dialog';
import MainChatItem from 'components/CommunityChatListItem/MainChatItem';
import EmptyLeftMenu from 'containers/CommunityChat/EmptyLeftMenu';
import { ReactComponent as ChatSearchIcon } from 'assets/svg/chat-search.svg';
import { getTitle } from 'utils/chat';
import { PERMISSIONS } from 'constants/common';

import useStyles from './_styles/leftMenu';

type Props = {
  userId: string,
  channels: array,
  channelList: array,
  local: Object,
  isLoading: boolean,
  onOpenChannel: Function,
  handleRemoveChannel: Function,
  setCurrentChannel: Function,
  setOneTouchSend: ?Function,
  lastChannelSid: string,
  currentChannel: ?Object,
  permission: array,
  oneTouchSendOpen: boolean,
  onNewChannel: Function,
  handleMarkAsRead: Function,
  handleMuteChannel: Function,
  handleUpdateGroupName: Function
};

const LeftMenu = ({
  local,
  isLoading,
  channelList,
  handleMuteChannel,
  userId,
  oneTouchSendOpen = false,
  setOneTouchSend,
  lastChannelSid,
  handleNewChannel,
  setCurrentChannel,
  channels,
  onOpenChannel,
  currentChannel,
  permission,
  newChannel,
  onNewChannel,
  handleMarkAsRead,
  handleRemoveChannel,
  handleUpdateGroupName
}: Props) => {
  const classes = useStyles();
  const [search, setSearch] = useState();
  const [searchChannels, setSearchChannels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const expertMode = useSelector((state) => state.user.expertMode);

  const switchOneTouchSend = () =>
    permission.includes(PERMISSIONS.EXPERT_MODE_ACCESS) && expertMode;

  const handleCreateNewChannel = () => {
    setIsOpen(true);
    if (!switchOneTouchSend()) {
      onNewChannel();
    }
  };

  const handleClose = async () => {
    setIsOpen(false);
    if (setOneTouchSend) setOneTouchSend(false);
    await handleNewChannel(false);
    setCurrentChannel(local[lastChannelSid]?.twilioChannel);
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
        name: getTitle(c, userId, local[c.sid].members),
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
      setSearchChannels(channels.map((c) => c.sid));
    }
  }, [search, channels, userId, local]);

  return (
    <Grid item classes={{ root: classes.container }}>
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
            inputProps={{ 'aria-label': 'search' }}
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
            classes={{ root: classes.header }}
            justify="center"
            alignItems="center"
            direction="column"
          >
            <Typography
              className={classes.createNewChate}
              variant="subtitle1"
              component="p"
            >
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
          {switchOneTouchSend() ? (
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
              onOpenChannel={onOpenChannel}
              permission={permission}
              handleUpdateGroupName={handleUpdateGroupName}
            />
          )}
        </Dialog>
        <Grid
          item
          className={
            isLoading ? classes.gridChatListLoading : classes.gridChatList
          }
        >
          <EmptyLeftMenu
            emptyChannels={channelList.length === 0}
            handleCreateNewChannel={handleCreateNewChannel}
            isLoading={isLoading}
          />
          <List className={classes.root}>
            {newChannel && <MainChatItem roomName="New Chat" selected />}
            {channelList.map(
              (c) =>
                local[c] && (
                  <div
                    key={local[c].sid}
                    className={clsx(
                      !searchChannels.includes(local[c].sid) && classes.hidden
                    )}
                  >
                    <ChatListItem
                      selected={currentChannel && c === currentChannel.sid}
                      channel={local[c]}
                      targetChannel={channels.filter(
                        (channel) => channel.sid === c
                      )}
                      userId={userId}
                      local={local}
                      permission={permission}
                      onOpenChannel={onOpenChannel}
                      handleMarkAsRead={handleMarkAsRead}
                      handleRemoveChannel={handleRemoveChannel}
                      handleMuteChannel={handleMuteChannel}
                      handleUpdateGroupName={handleUpdateGroupName}
                      dark
                    />
                  </div>
                )
            )}
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LeftMenu;
