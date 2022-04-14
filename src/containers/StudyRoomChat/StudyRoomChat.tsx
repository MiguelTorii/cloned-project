import React, { useCallback, useEffect, useMemo, useState } from 'react';

import get from 'lodash/get';
import { useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import withStyles from '@material-ui/core/styles/withStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import type { AvatarData } from 'utils/chat';

import Avatar from 'components/Avatar';
import { useChannelAvatars, useChannelMetadataById, useSelectChannelById } from 'features/chat';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import Chat from './Chat';
import { useStyles as useStudyRoomChatStyles } from './StudyRoomChatStyles';

import type { Participants } from 'containers/VideoCall/MeetUp';
import type { ChannelMetadata } from 'features/chat';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{
        overflow: 'auto'
      }}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const StyledTabs = withStyles((theme) => ({
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    borderBottom: '1px solid #FFFFFF',
    padding: theme.spacing(1, 0)
  }
}))((props: any) => (
  <Tabs
    {...props}
    TabIndicatorProps={{
      children: <span />
    }}
  />
));
const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: 400,
    minHeight: 33,
    minWidth: 60,
    fontSize: 20,
    padding: theme.spacing(0, 1),
    '&.MuiTab-textColorInherit.Mui-selected': {
      fontSize: 20,
      fontWeight: 700,
      color: theme.circleIn.palette.primaryBackground,
      background: 'linear-gradient(180deg, #03A9F4 17.19%, #007AFF 100%)',
      borderRadius: 20
    }
  }
}))((props: any) => <Tab disableRipple {...props} />);

type Props = {
  classes?: Record<string, any>;
  open?: boolean;
  selectedTab?: number;
  participants?: Participants;
  handleClose?: any;
};

export type User = ChannelMetadata['users'][0];
export type StudyRoomChatMembers = { [index: string]: User };
export type StudyRoomAvatars = { [index: AvatarData['identity']]: string };

const StudyRoomChat = ({ handleClose, open, selectedTab, participants }: Props) => {
  const [tabs, setTabs] = useState(1);

  const router = useSelector((state) => (state as any).router);
  const classes = useStudyRoomChatStyles();

  useEffect(() => {
    if (typeof selectedTab === 'number') {
      setTabs(selectedTab);
    }
  }, [selectedTab]);

  const channelId = useMemo(() => {
    const pathname = get(router, 'location.pathname');

    if (pathname) {
      const split = pathname.split('/');
      return split[split.length - 1];
    }

    return null;
  }, [router]);

  const { data: channel } = useSelectChannelById(channelId);

  const { data: channelMetadata } = useChannelMetadataById(channelId);
  const { data: avatars } = useChannelAvatars(channel);

  const handleChangeTabs = useCallback((_, value) => {
    setTabs(value);
  }, []);

  const participantsIdList = useMemo(
    () => participants?.map((p) => p.participant.identity),
    [participants]
  );

  const memberListOnVideo = useMemo(
    () =>
      channelMetadata?.users.filter((user) => participantsIdList?.includes(String(user.userId))),
    [channelMetadata?.users, participantsIdList]
  );

  if (!open) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ClickAwayListener onClickAway={handleClose}>
        <div className={classes.root}>
          <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          <Typography className={classes.title}>Study Room</Typography>
          <StyledTabs value={tabs} onChange={handleChangeTabs}>
            <StyledTab label="Participants" id="participants" />
            <StyledTab label="Chat" id="chat" />
          </StyledTabs>
          <TabPanel value={tabs} index={0}>
            <div className={classes.memberContainer}>
              <Typography className={classes.memberTitle}>All</Typography>
              {memberListOnVideo?.map((user) => {
                const { firstName, lastName, isOnline } = user;
                return (
                  isOnline && (
                    <div key={user.userId} className={classes.member}>
                      <Avatar
                        isOnline={isOnline}
                        onlineBadgeBackground="circleIn.palette.feedBackground"
                        profileImage={
                          avatars?.find((a) => a.identity === String(user.userId))?.profileImageUrl
                        }
                        fullName={`${firstName} ${lastName}`}
                        fromChat
                        mobileSize={50}
                        desktopSize={50}
                      />
                      <Typography className={classes.fullname}>
                        {firstName} {lastName}
                      </Typography>
                    </div>
                  )
                );
              })}
            </div>
          </TabPanel>
          <TabPanel value={tabs} index={1}>
            <Chat channel={channel} avatars={avatars} members={channelMetadata?.users} />
          </TabPanel>
        </div>
      </ClickAwayListener>
    </ErrorBoundary>
  );
};

export default StudyRoomChat;
