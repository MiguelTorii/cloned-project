import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import Fuse from 'fuse.js';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import ChatListItem from '../../components/ChatListItem/ChatListItem';
import { getTitle } from '../../utils/chat';
import EmptyLeftMenu from './EmptyLeftMenu';
import NewChannelIcon from '../../assets/svg/ic_new_chat_bold.svg';
import MainChatItem from '../../components/ChatListItem/MainChatItem';

const useStyles = makeStyles((theme) => ({
  container: {},
  header: {
    zIndex: 1000,
    left: 0,
    backgroundColor: theme.circleIn.palette.modalBackground
  },
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  search: {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.circleIn.palette.primaryBackground,
    padding: theme.spacing(0, 2)
  },
  inputRoot: {
    color: 'inherit'
  },
  headerTitle: {
    margin: theme.spacing(1, 1, 0, 1),
    width: `calc(100% - ${theme.spacing(2)}px)`
  },
  gridItem: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
    margin: theme.spacing(2, 1, 1, 1)
  },
  gridChatList: {
    width: 'inherit',
    marginBottom: theme.spacing(6)
  },
  imgIcon: {},
  newButton: {
    borderRadius: '50%',
    background: theme.circleIn.palette.brand,
    padding: 0,
    minWidth: 0,
    textTransform: 'none',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 22
  },
  hidden: {
    display: 'none'
  }
}));

type Props = {
  userId?: string;
  channels?: any[];
  channelList?: any[];
  local?: Record<string, any>;
  isLoading?: boolean;
  onOpenChannel?: (...args: Array<any>) => any;
  handleRemoveChannel?: (...args: Array<any>) => any;
  currentChannel?: Record<string, any> | null | undefined;
  onNewChannel?: (...args: Array<any>) => any;
  handleMuteChannel?: (...args: Array<any>) => any;
  newChannel?: any;
  client?: any;
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
  newChannel,
  onNewChannel,
  handleRemoveChannel,
  client
}: Props) => {
  const classes: any = useStyles();
  const [search, setSearch] = useState();
  const [searchChannels, setSearchChannels] = useState([]);

  const onChangeSearch = (e) => setSearch(e.target.value);

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
    <Grid
      item
      classes={{
        root: classes.container
      }}
    >
      <Grid
        container
        classes={{
          root: classes.container
        }}
      >
        <Grid
          container
          classes={{
            root: classes.header
          }}
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Grid
            container
            item
            justifyContent="space-between"
            alignItems="center"
            className={classes.headerTitle}
          >
            <Typography className={classes.title}>Chats</Typography>
            <Button
              variant="contained"
              classes={{
                root: classes.newButton
              }}
              color="primary"
              onClick={onNewChannel}
            >
              <img
                id="circlein-newchat"
                src={NewChannelIcon}
                alt="newChat"
                className={classes.imgIcon}
              />
            </Button>
          </Grid>
          <Grid item className={classes.gridItem}>
            <div className={classes.search}>
              <InputBase
                onChange={onChangeSearch}
                value={search || ''}
                placeholder="Search for a chat…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{
                  'aria-label': 'search'
                }}
              />
            </div>
          </Grid>
        </Grid>
        <Grid item className={classes.gridChatList}>
          <EmptyLeftMenu emptyChannels={channelList.length === 0} isLoading={isLoading} />
          <List className={classes.root}>
            {newChannel && <MainChatItem name="" roomName="New Chat" selected />}
            {channelList.map(
              (c) =>
                local[c] && (
                  <div
                    key={local[c].sid}
                    className={clsx(!searchChannels.includes(local[c].sid) && classes.hidden)}
                  >
                    <ChatListItem
                      selected={currentChannel && c === currentChannel.sid}
                      channel={local[c]}
                      userId={userId}
                      onOpenChannel={onOpenChannel}
                      handleRemoveChannel={handleRemoveChannel}
                      handleMuteChannel={handleMuteChannel}
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
