// @flow

import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import InputBase from '@material-ui/core/InputBase'
import Grid from '@material-ui/core/Grid'
import ChatListItem from 'components/ChatListItem'
import CreateChatChannel from 'containers/CreateChatChannel'
import Fuse from 'fuse.js'
import { getTitle } from 'utils/chat';
import EmptyLeftMenu from 'containers/Chat/EmptyLeftMenu'

const useStyles = makeStyles((theme) => ({
  container: {
  },
  header: {
    zIndex: 1000,
    left: 0,
    backgroundColor: theme.circleIn.palette.modalBackground,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  search: {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.circleIn.palette.primaryBackground,
    // width: drawerWidth - theme.spacing(2),
    padding: theme.spacing(0, 2),
  },
  inputRoot: {
    color: 'inherit',
  },
  gridItem: {
    margin: theme.spacing(1, 0),
  },
  gridChatList: {
    width: 'inherit'
  },
  newButton: {
    textTransform: 'none',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 18
  }
}))

type Props = {
  userId: string,
  channels: array,
  setCurrentChannel: Function
};

const LeftMenu = ({ handleUpdateUnreadCount, userId, channels, setCurrentChannel, currentChannel, client }: Props) => {
  const classes = useStyles()
  const [channelType, setChannelType] = useState(null)
  const handleCreateChannelClose = () => setChannelType(null)
  const handleCreateChannelOpen = () => setChannelType('group')
  const [search, setSearch] = useState()
  const [searchChannels, setSearchChannels] = useState([])

  const onChangeSearch = e => setSearch(e.target.value)

  useEffect(() => {
    if (search && channels) {
      const list = channels.map(c=> ({
        name: getTitle(c, userId),
        channel: c
      }))

      const options = {
        includeScore: true,
        keys: ['name']
      }

      const fuse = new Fuse(list, options)

      const result = fuse.search(search).map(c => c.item.channel)
      setSearchChannels(result)
    } else {
      setSearchChannels(channels)
    }
  }, [search, channels])

  const handleChannelCreated = ({ channel }) => setCurrentChannel(channel)


  return (
    <Grid item classes={{ root: classes.container }}>
      <CreateChatChannel
        type={channelType}
        client={client}
        channels={channels}
        onClose={handleCreateChannelClose}
        onChannelCreated={handleChannelCreated}
      />
      <Grid
        container
        classes={{ root: classes.container}}
      >
        <Grid
          container
          classes={{ root: classes.header}}
          justify='center'
          alignItems='center'
          direction='column'
        >
          <Grid item className={classes.gridItem}>
            <Typography className={classes.title}>Messages</Typography>
          </Grid>
          <Grid item className={classes.gridItem}>
            <Button
              variant='contained'
              onClick={handleCreateChannelOpen}
              classes={{ label: classes.newButton }}
              color='primary'
            >
               Start a New Chat
            </Button>
          </Grid>
          <Grid item className={classes.gridItem}>
            <div className={classes.search}>
              <InputBase
                onChange={onChangeSearch}
                value={search}
                placeholder="Search for a chat…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Grid>
        </Grid>
        <Grid item className={classes.gridChatList}>
          {channels.length === 0 && <EmptyLeftMenu />}
          <List className={classes.root}>
            {searchChannels.map(c => (<ChatListItem
              key={c.sid}
              selected={c === currentChannel}
              channel={c}
              userId={userId}
              onUpdateUnreadCount={handleUpdateUnreadCount}
              onOpenChannel={setCurrentChannel}
            />))}
          </List>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default LeftMenu
