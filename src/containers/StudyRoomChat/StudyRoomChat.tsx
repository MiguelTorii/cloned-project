import React, { useEffect, useMemo, useCallback, useState } from 'react';

import get from 'lodash/get';
import set from 'lodash/set';
import { useSelector } from 'react-redux';

import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import withStyles from '@material-ui/core/styles/withStyles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

import type { AvatarData } from 'utils/chat';
import { fetchAvatars } from 'utils/chat';

import { getGroupMembers } from 'api/chat';
import Avatar from 'components/Avatar';
import { useChannelMetadataById, useSelectChannelById } from 'features/chat';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import Chat from './Chat';

import type { ChannelMetadata } from 'features/chat';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom: 145,
    right: 60,
    width: 420,
    height: 600,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    borderRadius: 20,
    border: '1px solid #FFFFFF',
    zIndex: 1500
  },
  title: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacing(),
    fontSize: 24,
    fontWeight: 700
  },
  member: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing()
  },
  memberTitle: {
    fontSize: 16,
    marginBottom: theme.spacing(1),
    fontWeight: 700
  },
  memberContainer: {
    margin: theme.spacing(2, 4)
  },
  fullname: {
    fontSize: 14,
    marginLeft: theme.spacing(),
    fontWeight: 700
  },
  closeIcon: {
    color: '#979797',
    cursor: 'pointer',
    position: 'absolute',
    right: 13,
    top: 5
  }
});

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
  participants?: Record<string, any>;
  handleClose?: any;
};

export type User = ChannelMetadata['users'][0];
export type StudyRoomChatMembers = { [index: string]: User };
export type StudyRoomAvatars = { [index: AvatarData['identity']]: string };

const StudyRoomChat = ({ handleClose, open, classes, selectedTab, participants }: Props) => {
  // TODO Replace and optimize
  const [members, setMembers] = useState<StudyRoomChatMembers>({});
  const [avatars, setAvatars] = useState<StudyRoomAvatars>({});
  const [tabs, setTabs] = useState(1);

  const router = useSelector((state) => (state as any).router);

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

  // TODO Fix, replace with metadata in react-query
  useEffect(() => {
    const initAvatars = async () => {
      if (!channel) return;
      const av = await fetchAvatars(channel);
      const avatarObj: typeof avatars = {};

      av.forEach((a) => {
        avatarObj[a.identity] = a.profileImageUrl;
      });

      setAvatars(avatarObj);
    };

    const getMembers = async () => {
      const res: ChannelMetadata['users'] = await getGroupMembers(channelId);
      const members = res.map((m) => ({
        registered: m.registered,
        firstname: m.firstName,
        lastname: m.lastName,
        image: m.profileImageUrl,
        roleId: m.roleId,
        role: m.role,
        userId: m.userId,
        isOnline: m.isOnline
      }));
      const newMembers = {};
      members.forEach((m) => {
        newMembers[m.userId] = m;
      });
      setMembers(newMembers);
      await initAvatars();
    };

    if (channel && channelMetadata?.users) {
      const { users } = channelMetadata;
      const newMembers: typeof members = {};
      users.forEach((m) => {
        newMembers[m.userId] = m;
      });
      setMembers(newMembers);
      initAvatars();
    }

    if (channel && channelMetadata && !channelMetadata?.users) {
      getMembers();
    }
  }, [channel, channelId, channelMetadata]);

  const handleChangeTabs = useCallback((_, value) => {
    setTabs(value);
  }, []);

  const participantsIdList = useMemo(
    () => participants.map((p) => p.participant.identity),
    [participants]
  );

  const memberListOnVideo = useMemo(
    () => Object.keys(members).filter((member) => participantsIdList.indexOf(member) > -1),
    [members, participantsIdList]
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
              {memberListOnVideo.map((member) => {
                const memberObj = members[member];
                const { firstName, lastName, isOnline } = memberObj;
                return (
                  isOnline && (
                    <div key={member} className={classes.member}>
                      <Avatar
                        isOnline={isOnline}
                        onlineBadgeBackground="circleIn.palette.feedBackground"
                        profileImage={avatars[member]}
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
            <Chat channel={channel} avatars={avatars} members={members} />
          </TabPanel>
        </div>
      </ClickAwayListener>
    </ErrorBoundary>
  );
};

export default withStyles(styles as any)(StudyRoomChat);
