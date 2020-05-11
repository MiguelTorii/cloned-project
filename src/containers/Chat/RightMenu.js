import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { getInitials} from 'utils/chat'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { Link as RouterLink } from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import BlockUser from 'containers/Chat/BlockUser'
import RemoveChat from 'containers/Chat/RemoveChat'
import AddMembers from 'containers/Chat/AddMembers'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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
    padding: theme.spacing()
  },
  icon: {
    fontSize: 14
  },
  avatar: {
    margin: theme.spacing(2),
    height: theme.spacing(10),
    width: theme.spacing(10),
    fontSize: 30
  },
  membersExpansion: {
    maxWidth: '95%',
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
    minHeight: '0 !important'
  }
}))

const RightMenu = ({ local, schoolId, clearCurrentChannel, handleRemoveChannel, userId, channel, handleBlock }) => {
  const classes = useStyles()
  const [groupImage, setGroupImage] = useState(null)
  const [initials, setInitials] = useState('')
  const [otherUser, setOtherUser] = useState(null)

  useEffect(() => {
    if (channel) {
      setInitials('')
      setOtherUser(null)
      setGroupImage(null)
      if(local[channel.sid].members.length === 2) {
        local[channel.sid].members.forEach(u => {
          if (Number(u.userId) !== Number(userId)) {
            setOtherUser(u)
            setGroupImage(u.image)
            setInitials(getInitials({name: `${u.firstname} ${u.lastname}`}))
          }
        })
      } else {
        setGroupImage(local[channel.sid].thumbnail)
      }
    }
  }, [local, channel, userId])
  if (!channel) return null

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
          <Typography className={classes.title}>{local[channel.sid].title}</Typography>
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
          <ExpansionPanel
            elevation={0}
            classes={{
              root: classes.membersExpansion,
              expanded: classes.membersExpanded
            }}
            TransitionProps={{ unmountOnExit: true }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              classes={{
                root: classes.membersSummary,
                expanded: classes.membersExpanded
              }}
            >
              <Typography className={classes.usersTitle}>In this chat...</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.membersDetails}>
              <List dense className={classes.listRoot}>
                {local[channel.sid].members.map(m => {
                  const fullName = `${m.firstname} ${m.lastname}`
                  return (
                    <ListItem
                      key={m.userId}
                      component={MyLink}
                      link={`/profile/${m.userId}`}
                      button
                      classes={{
                        secondaryAction: classes.secondaryAction
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={fullName}
                          src={m.image}
                        >
                          {getInitials({name: fullName})}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={fullName} />
                      <ListItemSecondaryAction>
                        <ArrowForwardIosIcon className={classes.icon} />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <AddMembers
          userId={userId}
          channel={channel}
          members={local[channel.sid].members}
          schoolId={schoolId}
        />
        <BlockUser userId={userId} otherUser={otherUser} handleBlock={handleBlock} />
        <RemoveChat
          clearCurrentChannel={clearCurrentChannel}
          handleRemoveChannel={handleRemoveChannel}
          channel={channel}
        />
      </Grid>
    </Grid>
  )
}

export default React.memo(RightMenu)
