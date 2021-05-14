// @flow

import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import Avatar from '@material-ui/core/Avatar'
import withStyles from '@material-ui/core/styles/withStyles';
import get from 'lodash/get'
import { fetchAvatars } from 'utils/chat'
import Chat from 'containers/StudyRoomChat/Chat'
import Typography from '@material-ui/core/Typography'
import set from 'lodash/set'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import ErrorBoundary from '../ErrorBoundary';
import type { State as StoreState } from '../../types/state';
import OnlineBadge from 'components/OnlineBadge';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    bottom:145,
    right: 60,
    width: 420,
    height: 600,
    backgroundColor: theme.circleIn.palette.primaryBackground,
    borderRadius: 20,
    border: '1px solid #FFFFFF',
    zIndex: 1500,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    marginTop: theme.spacing(),
    fontSize: 24,
    fontWeight: 700,
  },
  avatar: {
    height: 50,
    width:50
  },
  member: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(),
  },
  memberTitle: {
    fontSize: 16,
    marginBottom: theme.spacing(1),
    fontWeight: 700,
  },
  memberContainer: {
    margin: theme.spacing(2, 4)
  },
  fullname: {
    fontSize: 14,
    marginLeft: theme.spacing(),
    fontWeight: 700,
  },
  closeIcon: {
    color: '#979797',
    cursor: 'pointer',
    position: 'absolute',
    right: 13,
    top: 5,
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ overflow: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const StyledTabs = withStyles(theme => ({
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
    borderBottom: '1px solid #FFFFFF',
    padding: theme.spacing(1, 0),
  },
}))((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);


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
    },
  },
}))((props) => <Tab disableRipple {...props} />);

type Props = {
  classes: Object,
  user: Object,
  router: Object,
  open: boolean,
  chat: Object,
  selectedTab: number,
  participants: Object,
};

const StudyRoomChat = ({
  handleClose,
  open,
  user,
  router,
  classes,
  chat,
  selectedTab,
  participants,
}: Props) => {
  const [members, setMembers] = useState({})
  const [tabs, setTabs] = useState(1)

  useEffect(() => {
    if (typeof selectedTab === 'number') setTabs(selectedTab)
  }, [selectedTab])
  const channelId = useMemo(() => {
    const pathname = get(router, 'location.pathname')
    if(pathname) {
      const split = pathname.split('/')
      return split[split.length -1]
    }
    return null
  }, [router])

  const channel = useMemo(() => {
    if (channelId) {
      return get(chat, `data.local.${channelId}`)
    }
    return null
  }, [channelId, chat])

  useEffect(() => {
    const initAvatars = async () => {
      const twilioChannel = get(channel, 'twilioChannel')
      const av = await fetchAvatars(twilioChannel)
      setMembers(members => {
        av.forEach(a => {
          set(members, `${a.identity}.avatar`, a.profileImageUrl)
        })
        return members
      })
    }

    if (channel && channel.members) {
      const { members } = channel
      const newMembers = {}
      members.forEach(m => {
        newMembers[m.userId] = m
      })
      setMembers(newMembers)
      initAvatars()
    }
  }, [channel])

  const handleChangeTabs = useCallback((_, value) => {
    setTabs(value)
  }, [])

  const participantsIdList = useMemo(() => {
    return participants.map(p => p.participant.identity)
  }, [participants])

  const memberListOnVideo = useMemo(() => {
    return Object.keys(members).filter(member => participantsIdList.indexOf(member) > -1)
  }, [members, participantsIdList])

  if (!open) return null
  return (
    <ErrorBoundary>
      <ClickAwayListener onClickAway={handleClose}>
        <div className={classes.root}>
          <CloseIcon className={classes.closeIcon} onClick={handleClose} />
          <Typography className={classes.title}>Study Room</Typography>
          <StyledTabs value={tabs} onChange={handleChangeTabs}>
            <StyledTab label="Participants" id='participants' />
            <StyledTab label="Chat" id='chat' />
          </StyledTabs>
          <TabPanel
            value={tabs}
            index={0}
          >
            <div className={classes.memberContainer}>
              <Typography className={classes.memberTitle}>All</Typography>
              {memberListOnVideo.map(member => {

                const memberObj = members[member]
                const { avatar, firstname, lastname, isOnline } = memberObj

                return isOnline && (
                  <div key={member} className={classes.member}>
                    <OnlineBadge isOnline={isOnline} bgColorPath="circleIn.palette.feedBackground">
                      <Avatar
                        src={avatar}
                        className={classes.avatar}
                      >
                        {firstname[0]}{lastname[0]}
                      </Avatar>
                    </OnlineBadge>
                    <Typography className={classes.fullname}>{firstname} {lastname}</Typography>
                  </div>
                )
              })}
            </div>
          </TabPanel>
          <TabPanel value={tabs} index={1}>
            <Chat
              user={user}
              channel={channel}
              members={members}
              chat={chat}
            />
          </TabPanel>
        </div>
      </ClickAwayListener>
    </ErrorBoundary>
  )
}

const mapStateToProps = ({ router, user, chat }: StoreState): {} => ({
  user,
  router,
  chat
});

const mapDispatchToProps = (dispatch: *): {} =>
  bindActionCreators(
    {
      pushTo: push
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(StudyRoomChat));
