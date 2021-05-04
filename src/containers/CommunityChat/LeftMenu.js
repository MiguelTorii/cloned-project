// @flow

import React, { useEffect, useState } from 'react'
import List from '@material-ui/core/List'
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'
import Fuse from 'fuse.js'

import ChatListItem from 'components/CommunityChatListItem'
import CreateChatChannelInput from 'components/CreateCommunityChatChannelInput'
import MainChatItem from 'components/CommunityChatListItem/MainChatItem'
import EmptyLeftMenu from 'containers/CommunityChat/EmptyLeftMenu'
import { getTitle } from 'utils/chat'
import useStyles from './_styles/leftMenu'

type Props = {
  userId: string,
  channels: array,
  channelList: array,
  local: Object,
  isLoading: boolean,
  onOpenChannel: Function,
  handleRemoveChannel: Function,
  currentChannel: ?Object,
  permission: array,
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
  const classes = useStyles()
  const [search, setSearch] = useState()
  const [searchChannels, setSearchChannels] = useState([])
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCreateNewChannel = (event) => {
    setAnchorEl(event.currentTarget);
    onNewChannel()
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeSearch = e => setSearch(e.target.value)

  useEffect(() => {
    if (search && channels) {
      const list = channels.map(c=> ({
        name: getTitle(c, userId, local[c.sid].members),
        channel: c
      }))

      const options = {
        includeScore: true,
        threshold: 0,
        keys: ['name']
      }

      const fuse = new Fuse(list, options)

      const result = fuse.search(search).map(c => c.item.channel.sid)
      setSearchChannels(result)
    } else {
      setSearchChannels(channels.map(c => c.sid))
    }
  }, [search, channels, userId, local])

  const open = Boolean(anchorEl);
  const id = open ? 'add-classmates' : undefined;

  return (
    <Grid item classes={{ root: classes.container }}>
      <Grid item className={classes.gridItem}>
        <div className={classes.search}>
          <InputBase
            onChange={onChangeSearch}
            value={search || ''}
            placeholder="Find your chats or classmates..."
            classes={{
              root: classes.inputRoot,
              input: classes.placeholderInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </Grid>
      <Grid
        container
        classes={{ root: classes.container }}
      >
        <Grid
          container
          classes={{ root: classes.header }}
          justify='center'
          alignItems='center'
          direction='column'
        >
          <Typography variant="subtitle1" component="p">
            Direct Messages
          </Typography>

          <Button
            variant='contained'
            classes={{
              root: classes.newButton
            }}
            color='primary'
            onClick={handleCreateNewChannel}
          >
            +
          </Button>
          <Popover
            id={id}
            classes={{ paper: classes.selectClassmates }}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {newChannel && <CreateChatChannelInput
              onClosePopover={handleClose}
              onOpenChannel={onOpenChannel}
            />}
          </Popover>
        </Grid>
        <Grid item className={classes.gridChatList}>
          <EmptyLeftMenu
            emptyChannels={channelList.length === 0}
            isLoading={isLoading}
          />
          <List className={classes.root}>
            {newChannel && <MainChatItem roomName='New Chat' selected />}
            {channelList.map(c => (
              local[c] && <div
                key={local[c].sid}
                className={clsx(
                  !searchChannels.includes(local[c].sid) && classes.hidden
                )}
              >
                <ChatListItem
                  selected={currentChannel && c === currentChannel.sid}
                  channel={local[c]}
                  targetChannel={channels.filter(channel => channel.sid === c)}
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
            ))}
          </List>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default LeftMenu
