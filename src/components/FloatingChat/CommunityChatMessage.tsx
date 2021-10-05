/* eslint-disable no-await-in-loop */

/* eslint-disable react/no-danger */
import 'react-quill/dist/quill.snow.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory, withRouter } from 'react-router';
import cx from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Link from '@material-ui/core/Link';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import RoleBadge from '../RoleBadge/RoleBadge';
import BlockMemberModal from '../BlockMemberModal/BlockMemberModal';
import OnlineBadge from '../OnlineBadge/OnlineBadge';
import StudyRoomReport from '../StudyRoomReport/ReportIssue';
import AnyFileUpload from '../AnyFileUpload/AnyFileUpload';
import { ReactComponent as Camera } from '../../assets/svg/camera-join-room.svg';
import { getInitials } from '../../utils/chat';
import useStyles from '../_styles/FloatingChat/CommunityChatMessage';
import { PROFILE_PAGE_SOURCE } from '../../constants/common';
import { buildPath } from '../../utils/helpers';

const MyLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

type Props = {
  userId?: string;
  name?: string;
  avatar?: string;
  isOnline?: boolean;
  role?: string;
  date?: string;
  currentUserId?: string;
  isGroupChannel?: boolean;
  members?: Array<any>;
  messageList?: Array<Record<string, any>>;
  onImageLoaded?: (...args: Array<any>) => any;
  onStartVideoCall?: (...args: Array<any>) => any;
  onImageClick?: (...args: Array<any>) => any;
  handleBlock?: (...args: Array<any>) => any;
};

const ChatMessage = ({
  userId,
  name,
  role,
  date,
  avatar,
  isOnline,
  currentUserId,
  members,
  isGroupChannel,
  messageList,
  onImageLoaded,
  onStartVideoCall,
  onImageClick,
  handleBlock
}: Props) => {
  const classes: any = useStyles();
  const [showOpetions, setShowOptions] = useState(0);
  const [openReport, setOpenReport] = useState(false);
  const [blockUserId, setBlockuserId] = useState('');
  const [blockUserName, setBlockUserName] = useState('');
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [hoverMessageId, setHoverMessageId] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const profiles = useMemo(() => {
    const data = {};

    if (members) {
      members.forEach((member) => {
        data[member.userId] = {
          userId: member.userId,
          firstName: member.firstname,
          lastName: member.lastname,
          userProfileUrl: member.image
        };
      });
    }

    return data;
  }, [members]);

  const linkify = (text) => {
    // eslint-disable-next-line
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.replace(urlRegex, (url) => {
      const urlIndex = text.indexOf(url);

      if (text.substr(urlIndex - 5, urlIndex - 1).indexOf('src') === -1) {
        return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`;
      }

      return url;
    });
  };

  const clickImage = useCallback(
    (e) => {
      onImageClick(e.src);
    },
    [onImageClick]
  );
  useEffect(() => {
    // TODO stop polluting the global namespace with
    // component specific state
    (window as any).clickImage = clickImage;
    (window as any).loadImage = onImageLoaded;
    return () => {
      (window as any).clickImage = null;
      (window as any).loadImage = null;
    };
  }, [clickImage, onImageLoaded]);

  const renderHtmlWithImage = (text) => {
    const htmlString = text.replaceAll(
      '<img',
      `<img
        onClick=window.clickImage(this)
        onLoad=window.loadImage()
        class=${classes.image}`
    );
    return linkify(htmlString);
  };

  const handleViewProfile = (userId) => () => {
    history.push(
      buildPath(`/profile/${userId}`, {
        from: PROFILE_PAGE_SOURCE.CHAT
      })
    );
    setAnchorEl(null);
  };

  const handleImageClick = (url) => () => {
    onImageClick(url);
  };

  const handleMouseEnter = (sid) => () => {
    setShowOptions(sid);
  };

  const handleMouseLeave = () => () => {
    setShowOptions(0);
  };

  const initials = getInitials(name);

  const handleClick = (msgId) => (event) => {
    setHoverMessageId(msgId);
    setAnchorEl(event.currentTarget);
  };

  const handleOpenReport = () => {
    setOpenReport(true);
    setAnchorEl(null);
  };

  const handleCloseReport = () => setOpenReport(false);

  const handleClose = () => {
    setHoverMessageId('');
    setAnchorEl(null);
  };

  const handleOpenBlockMemberModal = (userId, name) => () => {
    setBlockuserId(userId);
    setBlockUserName(name);
    setOpenBlockModal(true);
    setAnchorEl(null);
  };

  const handleCloseBlockMemberModal = () => {
    setBlockuserId('');
    setBlockUserName('');
    setOpenBlockModal(false);
  };

  const handleBlockUser = async () => {
    handleCloseBlockMemberModal();
    await handleBlock(blockUserId);
  };

  const open = Boolean(anchorEl);

  const renderItem = ({
    imageKey,
    body,
    isVideoNotification,
    files,
    firstName,
    createdAt
  }: {
    imageKey: string;
    body: string;
    files: object;
    isVideoNotification: boolean;
    firstName: string;
    createdAt?: any;
  }) => {
    const message = body.replace(/(\r\n|\n|\r)/gm, '<br />');

    if (['add_new_member', 'remove_user'].includes(imageKey)) {
      return (
        <div className={cx(classes.alertWrapper)}>
          <Typography
            className={classes.alert}
            dangerouslySetInnerHTML={{
              __html: linkify(message)
            }}
          />
        </div>
      );
    }

    if (imageKey !== '') {
      return (
        <div className={classes.bodyWrapper}>
          <ButtonBase onClick={handleImageClick(imageKey)}>
            <img className={classes.image} src={imageKey} alt="chat" onLoad={onImageLoaded} />
          </ButtonBase>
        </div>
      );
    }

    if (isVideoNotification) {
      return (
        <div className={classes.bodyWrapper}>
          <Card className={classes.videoAlertRoot}>
            <CardContent
              classes={{
                root: classes.cardContent
              }}
            >
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                <b>{firstName}</b> started a Study Room 🎉
              </Typography>
              <Avatar alt={name} src={avatar}>
                {initials}
              </Avatar>
            </CardContent>
            <CardActions
              classes={{
                root: classes.cardActions
              }}
            >
              <Button className={classes.join} onClick={onStartVideoCall}>
                <Camera className={classes.camera} /> Join Now
              </Button>
            </CardActions>
          </Card>
        </div>
      );
    }

    return (
      <AnyFileUpload
        files={files}
        message={message}
        onImageClick={onImageClick}
        onImageLoaded={onImageLoaded}
        renderHtmlWithImage={renderHtmlWithImage}
      />
    );
  };

  return (
    <>
      {messageList.map((message) => (
        <ListItem
          key={message.sid}
          alignItems="flex-start"
          className={classes.root}
          onMouseEnter={handleMouseEnter(message.sid)}
          onMouseLeave={handleMouseLeave()}
        >
          <div className={classes.content}>
            {message.imageKey !== 'add_new_member' && (
              <ListItemAvatar
                className={classes.avatarLink}
                // eslint-disable-next-line
                // @ts-ignore
                component={MyLink}
                href={buildPath(`/profile/${userId}`, {
                  from: PROFILE_PAGE_SOURCE.CHAT
                })}
              >
                <OnlineBadge isOnline={isOnline} bgColorPath="circleIn.palette.feedBackground">
                  <Avatar alt={name} src={avatar}>
                    {initials}
                  </Avatar>
                </OnlineBadge>
              </ListItemAvatar>
            )}
          </div>
          <div className={classes.message}>
            {message.imageKey !== 'add_new_member' && (
              <div className={classes.messageHeader}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle2" className={classes.name}>
                    <Link
                      className={classes.link}
                      component={MyLink}
                      href={buildPath(`/profile/${userId}`, {
                        from: PROFILE_PAGE_SOURCE.CHAT
                      })}
                    >
                      {name}
                    </Link>
                  </Typography>
                  {role && <RoleBadge text={role} />}
                  <Typography className={cx(classes.createdAt)} variant="caption">
                    {date} at {message.createdAt}
                  </Typography>
                </Box>
                {showOpetions === message.sid && currentUserId !== userId && (
                  <Button
                    className={classes.threeDots}
                    variant="contained"
                    onClick={handleClick(message.sid)}
                  >
                    <MoreHorizIcon />
                  </Button>
                )}
                <Popover
                  id={message.sid}
                  open={open && hoverMessageId === message.sid}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuList className={classes.userMenu}>
                    <MenuItem onClick={handleViewProfile(userId)}>
                      <Typography variant="inherit">View Profile</Typography>
                    </MenuItem>
                    {isGroupChannel && (
                      <MenuItem onClick={handleOpenBlockMemberModal(userId, name)}>
                        <Typography variant="inherit">Block Member</Typography>
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleOpenReport}>
                      <Typography variant="inherit" className={classes.report} noWrap>
                        Report Issue
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </Popover>
              </div>
            )}
            {renderItem({
              imageKey: message.imageKey,
              body: message.body,
              files: message?.files,
              isVideoNotification: message.isVideoNotification,
              firstName: message.firstName,
              createdAt: message.createdAt
            })}
          </div>
        </ListItem>
      ))}

      <StudyRoomReport profiles={profiles} open={openReport} handleClose={handleCloseReport} />

      <BlockMemberModal
        closeModal={handleCloseBlockMemberModal}
        handleBlock={handleBlock}
        onOk={handleBlockUser}
        open={openBlockModal}
        blockUserName={blockUserName}
      />
    </>
  );
};

export default withRouter(ChatMessage);
