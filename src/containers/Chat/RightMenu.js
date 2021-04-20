import React, { useMemo, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getInitials } from 'utils/chat'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { Link as RouterLink } from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import BlockUser from 'containers/Chat/BlockUser'
import RemoveChat from 'containers/Chat/RemoveChat'
import AddMembers from 'containers/Chat/AddMembers'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'

import OnlineBadge from 'components/OnlineBadge';
import TutorBadge from 'components/TutorBadge'

const MyLink = React.forwardRef(({ link, ...props }, ref) => {
  return <RouterLink to={link} {...props} ref={ref} />
});

const useStyles = makeStyles((theme) => ({
  usersContainer: {
    width: '100%',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.circleIn.palette.modalBackground}`,
  },
  listRoot: {
    width: '100%',
    overflow: 'auto',
  },
  header: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing(),
  },
  headerTitle: {
    fontSize: 18,
  },
  title: {
    width: 'inherit',
    textAlign: 'center',
    fontSize: 20,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  container: {
    flexGrow: 1,
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  infoContainer: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
    padding: theme.spacing(2),
  },
  usersTitle: {
    padding: 0,
    fontWeight: 'bold',
  },
  usersCount: {
    marginLeft: 'auto',
    fontWeight: 'bold',
    paddingRight: theme.spacing()
  },
  icon: {
    cursor: 'pointer',
    fontSize: 14
  },
  avatar: {
    margin: theme.spacing(2),
    height: theme.spacing(10),
    width: theme.spacing(10),
    fontSize: 30
  },
  membersExpansion: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  membersSummary: {
    margin: 0,
    padding: 0
  },
  membersDetails: {
    padding: 0
  },
  membersExpanded: {
    margin: '0 !important',
    minHeight: '0 !important',
  },
  expandIcon: {
    padding: 0,
    marginRight: 0,
    '& .MuiSvgIcon-root': {
      fontSize: 18
    },
  },
  expandedRotate: {
    margin: '0 !important',
    minHeight: '0 !important',
    '& .MuiAccordionSummary-expandIcon.Mui-expanded': {
      transform: 'rotate(90deg)'
    }
  }
}))

const RightMenu = ({
  local,
  schoolId,
  handleRemoveChannel,
  userId,
  channel,
  handleBlock
}) => {
  const classes = useStyles()
  const [groupImage, setGroupImage] = useState(null)
  const [initials, setInitials] = useState('')
  const [otherUser, setOtherUser] = useState(null)
  const localChannel = useMemo(() => channel && local[channel.sid], [channel, local])

  useEffect(() => {
    if (channel && localChannel) {
      setInitials('')
      setOtherUser(null)
      setGroupImage(null)
      if (localChannel?.members?.length && localChannel?.members?.length === 2) {
        localChannel.members.forEach(u => {
          if (Number(u.userId) !== Number(userId)) {
            setOtherUser(u)
            setGroupImage(u.image)
            setInitials(getInitials({ name: `${u.firstname} ${u.lastname}` }))
          }
        })
      } else {
        setGroupImage(localChannel.thumbnail)
      }
    }
  }, [local, channel, userId, localChannel])

  if (!channel || !localChannel) return null

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
        alignItems='flex-start'
      >
        <Grid
          container
          alignItems='flex-start'
          justify='flex-start'
          classes={{
            root: classes.header
          }}
          item
        >
          <Typography className={classes.headerTitle}>Chat Details</Typography>
        </Grid>
        <Grid
          container
          direction='column'
          alignItems='center'
          justify='center'
          classes={{
            root: classes.infoContainer
          }}
        >
          <Typography className={classes.title}>{localChannel && localChannel.title}</Typography>
          <Avatar
            src={groupImage}
            alt='group-image'
            className={classes.avatar}
          >
            {initials || <GroupIcon />}
          </Avatar>
        </Grid>
        <Grid
          classes={{
            root: classes.usersContainer
          }}
        >
          <Accordion
            elevation={0}
            classes={{
              root: classes.membersExpansion,
              expanded: classes.membersExpanded
            }}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary
              expandIcon={<ArrowForwardIosIcon />}
              classes={{
                root: classes.membersSummary,
                expandIcon: classes.expandIcon,
                expanded: classes.expandedRotate
              }}
            >
              <Typography className={classes.usersTitle}>In this chat...</Typography>
              <Typography className={classes.usersCount}>{localChannel && localChannel.members.length}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.membersDetails}>
              <List dense className={classes.listRoot}>
                {localChannel?.members.map(m => {
                  const fullName = `${m.firstname} ${m.lastname}`
                  return (
                    <ListItem
                      key={m.userId}
                      component={MyLink}
                      disableGutters
                      link={`/profile/${m.userId}`}
                      button
                      classes={{
                        secondaryAction: classes.secondaryAction
                      }}
                    >
                      <ListItemAvatar>
                        <OnlineBadge isOnline={m.isOnline} bgColorPath="circleIn.palette.primaryBackground">
                          <Avatar
                            alt={fullName}
                            src={m.image}
                          >
                            {getInitials({ name: fullName })}
                          </Avatar>
                        </OnlineBadge>
                      </ListItemAvatar>
                      {fullName} {m.role && <TutorBadge text={m.role} />}
                      <ListItemSecondaryAction>
                        <RouterLink to={`/profile/${m.userId}`}>
                          <ArrowForwardIosIcon className={classes.icon} />
                        </RouterLink>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <AddMembers
          userId={userId}
          channel={channel}
          members={local[channel.sid].members}
          schoolId={schoolId}
        />
        <BlockUser userId={userId} otherUser={otherUser} handleBlock={handleBlock} />
        <RemoveChat
          handleRemoveChannel={handleRemoveChannel}
          channel={channel}
        />
      </Grid>
    </Grid>
  )
}

export default React.memo(RightMenu)
