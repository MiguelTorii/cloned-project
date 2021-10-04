/* eslint-disable flowtype/no-types-missing-file-annotation */
import React, { useMemo, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { getInitials } from "utils/chat";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Link as RouterLink } from "react-router-dom";
import GroupIcon from "@material-ui/icons/Group";
import Settings from "containers/Chat/Settings";
import BlockUser from "containers/Chat/BlockUser";
import RemoveChat from "containers/Chat/RemoveChat";
import AddMembers from "containers/Chat/AddMembers";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { Box, Button, CircularProgress } from "@material-ui/core";
import { Create } from "@material-ui/icons";
import OnlineBadge from "components/OnlineBadge/OnlineBadge";
import RoleBadge from "components/RoleBadge/RoleBadge";
import ShareLinkWidget from "components/ShareLinkWidget/ShareLinkWidget";
import { useDispatch } from "react-redux";
import { PERMISSIONS, PROFILE_PAGE_SOURCE } from "constants/common";
import AvatarEditor from "../../components/AvatarEditor/AvatarEditor";
import { handleUpdateGroupPhoto } from "../../actions/chat";
import { buildPath } from "../../utils/helpers";
const MyLink = React.forwardRef(({
  link,
  ...props
}, ref) => <RouterLink to={link} {...props} ref={ref} />);
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor: theme.circleIn.palette.primaryBackground,
    display: 'flex',
    flexDirection: 'column'
  },
  scrollingContent: {
    flexGrow: 1
  },
  fixedFooter: {
    height: theme.spacing(13.5),
    padding: '16px 12px'
  },
  usersContainer: {
    width: '100%',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.circleIn.palette.modalBackground}`
  },
  listRoot: {
    width: '100%',
    overflow: 'auto'
  },
  header: {
    backgroundColor: theme.circleIn.palette.modalBackground,
    padding: theme.spacing()
  },
  headerTitle: {
    fontSize: 18
  },
  title: {
    width: 'inherit',
    textAlign: 'center',
    fontSize: 20,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  infoContainer: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
    padding: theme.spacing(2)
  },
  usersTitle: {
    padding: 0,
    fontWeight: 'bold'
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
    height: theme.spacing(14),
    width: theme.spacing(14),
    fontSize: 30
  },
  membersExpansion: {
    backgroundColor: theme.circleIn.palette.primaryBackground
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
  },
  expandIcon: {
    padding: 0,
    marginRight: 0,
    '& .MuiSvgIcon-root': {
      fontSize: 18
    }
  },
  expandedRotate: {
    margin: '0 !important',
    minHeight: '0 !important',
    '& .MuiAccordionSummary-expandIcon.Mui-expanded': {
      transform: 'rotate(90deg)'
    }
  },
  penButton: {
    background: 'linear-gradient(180deg, #94DAF9 0%, #1E88E5 100%)',
    width: 32,
    height: 32,
    minWidth: 32,
    position: 'absolute',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
    borderRadius: '100%'
  },
  savingPhoto: {
    position: 'absolute',
    left: 50,
    top: 50,
    zIndex: 120
  }
}));

const RightMenu = ({
  local,
  schoolId,
  handleRemoveChannel,
  updateGroupName,
  userId,
  permission,
  channel,
  handleBlock,
  currentUserName
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [groupImage, setGroupImage] = useState(null);
  const [initials, setInitials] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const localChannel = useMemo(() => channel && local[channel.sid], [channel, local]);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isSavingGroupPhoto, setIsSavingGroupPhoto] = useState(false);
  useEffect(() => {
    if (channel && localChannel) {
      setInitials('');
      setOtherUser(null);
      setGroupImage(null);

      if (localChannel?.members?.length && localChannel?.members?.length === 2) {
        localChannel.members.forEach(u => {
          if (Number(u.userId) !== Number(userId)) {
            setOtherUser(u);
            setGroupImage(u.image);
            setInitials(getInitials(`${u.firstname} ${u.lastname}`));
          }
        });
      } else {
        setGroupImage(localChannel.thumbnail);
      }
    }
  }, [local, channel, userId, localChannel]);

  const handleEditAvatar = () => setIsEditingAvatar(true);

  const handleCancelEditAvatar = () => setIsEditingAvatar(false);

  const handleSaveAvatar = (imageData: Blob) => {
    setIsEditingAvatar(false);
    setIsSavingGroupPhoto(true);
    dispatch(handleUpdateGroupPhoto(channel.sid, imageData, () => setIsSavingGroupPhoto(false)));
  };

  const isStudent = useMemo(() => !permission.includes(PERMISSIONS.EXPERT_MODE_ACCESS), [permission]);

  if (!channel || !localChannel) {
    return null;
  }

  return <Grid item classes={{
    root: classes.root
  }}>
      <div className={classes.scrollingContent}>
        <Grid container alignItems="flex-start" justifyContent="space-between" classes={{
        root: classes.header
      }} item>
          <Typography className={classes.headerTitle}>Chat Details</Typography>
          {!isStudent && <Settings channel={channel} localChannel={localChannel} permission={permission} updateGroupName={updateGroupName} currentUserName={currentUserName} />}
        </Grid>
        <Grid container direction="column" alignItems="center" justifyContent="center" classes={{
        root: classes.infoContainer
      }}>
          <Typography className={classes.title}>{localChannel && localChannel.title}</Typography>
          <Box position="relative">
            <Avatar src={groupImage} alt="group-image" className={classes.avatar}>
              {initials || <GroupIcon />}
            </Avatar>
            {permission.includes(PERMISSIONS.EDIT_GROUP_PHOTO_ACCESS) && <Button onClick={handleEditAvatar} classes={{
            root: classes.penButton
          }}>
                <Create />
              </Button>}
            {isSavingGroupPhoto && <CircularProgress color="secondary" className={classes.savingPhoto} />}
          </Box>
        </Grid>
        <Grid classes={{
        root: classes.usersContainer
      }}>
          <Accordion elevation={0} classes={{
          root: classes.membersExpansion,
          expanded: classes.membersExpanded
        }} TransitionProps={{
          unmountOnExit: true
        }}>
            <AccordionSummary expandIcon={<ArrowForwardIosIcon />} classes={{
            root: classes.membersSummary,
            expandIcon: classes.expandIcon,
            expanded: classes.expandedRotate
          }}>
              <Typography className={classes.usersTitle}>In this chat...</Typography>
              <Typography className={classes.usersCount}>
                {localChannel && localChannel.members.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.membersDetails}>
              <List dense className={classes.listRoot}>
                {localChannel?.members.map(m => {
                const fullName = `${m.firstname} ${m.lastname}`;
                return <ListItem key={m.userId} component={MyLink} disableGutters link={buildPath(`/profile/${m.userId}`, {
                  from: PROFILE_PAGE_SOURCE.CHAT
                })} button classes={{
                  secondaryAction: classes.secondaryAction
                }}>
                      <ListItemAvatar>
                        <OnlineBadge isOnline={m.isOnline} bgColorPath="circleIn.palette.feedBackground">
                          <Avatar alt={fullName} src={m.image}>
                            {getInitials(fullName)}
                          </Avatar>
                        </OnlineBadge>
                      </ListItemAvatar>
                      {fullName} {m.role && <RoleBadge text={m.role} />}
                      <ListItemSecondaryAction>
                        <RouterLink to={buildPath(`/profile/${m.userId}`, {
                      from: PROFILE_PAGE_SOURCE.CHAT
                    })}>
                          <ArrowForwardIosIcon className={classes.icon} />
                        </RouterLink>
                      </ListItemSecondaryAction>
                    </ListItem>;
              })}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <AddMembers userId={userId} channel={channel} members={local[channel.sid].members} schoolId={schoolId} />
        <BlockUser userId={userId} otherUser={otherUser} handleBlock={handleBlock} />
        <RemoveChat handleRemoveChannel={handleRemoveChannel} channel={channel} />
      </div>

      <div className={classes.fixedFooter}>
        <ShareLinkWidget shareLink={localChannel.shareLink} headerText="Share an invite link" />
      </div>

      <AvatarEditor open={isEditingAvatar} originalImage={localChannel.thumbnail} onCancel={handleCancelEditAvatar} onSave={handleSaveAvatar} />
    </Grid>;
};

export default React.memo(RightMenu);