import React, { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import MoreVerticalIcon from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import { useSelector } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Emoji } from 'emoji-mart';
import clsx from 'clsx';
import { getInitials } from '../../utils/chat';
import useStyles from '../_styles/FloatingChat/CommunityChatMessage';
import RoleBadge from '../RoleBadge/RoleBadge';
import OnlineBadge from '../OnlineBadge/OnlineBadge';
import { DEFAULT_EMOJI_REACTIONS, PROFILE_PAGE_SOURCE } from '../../constants/common';
import { buildPath } from '../../utils/helpers';
import { ChatMessageItem } from '../../types/models';
import { ReactComponent as Camera } from '../../assets/svg/camera-join-room.svg';
import { ReactComponent as IconAddReaction } from '../../assets/svg/add_reaction.svg';
import AnyFileUpload from '../AnyFileUpload/AnyFileUpload';

const MyLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

type Props = {
  message: ChatMessageItem;
  name: string;
  authorUserId: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  isGroupChannel: boolean;
  date: string;
  onViewProfile: (number) => void;
  onReportIssue: () => void;
  onBlockMember: (number, string) => void;
  onImageClick: (string) => void;
  onImageLoaded: (string) => void;
  onStartVideoCall: () => void;
};

const linkify = (text) => {
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text.replace(urlRegex, (url) => {
    const urlIndex = text.indexOf(url);

    if (text.substr(urlIndex - 5, urlIndex - 1).indexOf('src') === -1) {
      return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`;
    }

    return url;
  });
};

const HOVER_MENU_EMOJI_SIZE = 20;

const CommunityChatMessageItem = ({
  date,
  message,
  role,
  name,
  authorUserId,
  avatar,
  isOnline,
  isGroupChannel,
  onViewProfile,
  onReportIssue,
  onBlockMember,
  onImageClick,
  onImageLoaded,
  onStartVideoCall
}: Props) => {
  const classes = useStyles();
  const myUserId = useSelector<any>((state) => state.user.data.userId);
  const [isHover, setIsHover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const handleOpenThreeDotsMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCloseThreeDotsMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleViewProfile = useCallback(() => {
    onViewProfile(authorUserId);
  }, [authorUserId, onViewProfile]);

  const handleReportIssue = useCallback(() => {
    onReportIssue();
  }, [onReportIssue]);

  const handleOpenBlockMemberModal = useCallback(() => {
    onBlockMember(authorUserId, name);
  }, [onBlockMember, authorUserId, name]);

  const handleAddEmojiReaction = useCallback((emojiColons) => {}, []);

  const renderHtmlWithImage = useCallback(
    (text) => {
      const htmlString = text.replaceAll(
        '<img',
        `<img
        onClick=window.clickImage(this)
        onLoad=window.loadImage()
        class=${classes.image}`
      );
      return linkify(htmlString);
    },
    [classes]
  );

  const messageBody = useMemo(() => {
    const { body, imageKey, isVideoNotification, firstName, files } = message;
    const messageBody = body.replace(/(\r\n|\n|\r)/gm, '<br />');

    if (['add_new_member', 'remove_user'].includes(imageKey)) {
      return (
        <div className={cx(classes.alertWrapper)}>
          <Typography
            className={classes.alert}
            dangerouslySetInnerHTML={{
              __html: linkify(messageBody)
            }}
          />
        </div>
      );
    }

    if (imageKey !== '') {
      return (
        <div className={classes.bodyWrapper}>
          <ButtonBase onClick={() => onImageClick(imageKey)}>
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
                {getInitials(name)}
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
        message={messageBody}
        onImageClick={onImageClick}
        onImageLoaded={onImageLoaded}
        renderHtmlWithImage={renderHtmlWithImage}
      />
    );
  }, [
    message,
    name,
    onImageClick,
    onImageLoaded,
    onStartVideoCall,
    onViewProfile,
    renderHtmlWithImage
  ]);

  return (
    <ListItem
      key={message.sid}
      alignItems="flex-start"
      className={clsx(classes.root, isHover && 'hover')}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classes.content}>
        {message.imageKey !== 'add_new_member' && (
          <ListItemAvatar
            className={classes.avatarLink}
            // eslint-disable-next-line
            // @ts-ignore
            component={MyLink}
            href={buildPath(`/profile/${authorUserId}`, {
              from: PROFILE_PAGE_SOURCE.CHAT
            })}
          >
            <OnlineBadge isOnline={isOnline} bgColorPath="circleIn.palette.feedBackground">
              <Avatar alt={name} src={avatar}>
                {getInitials(name)}
              </Avatar>
            </OnlineBadge>
          </ListItemAvatar>
        )}
      </div>
      <div className={classes.message}>
        {message.imageKey !== 'add_new_member' && (
          <Box>
            <Box display="flex" alignItems="center">
              <Typography variant="subtitle2" className={classes.name}>
                <Link
                  className={classes.link}
                  component={MyLink}
                  href={buildPath(`/profile/${authorUserId}`, {
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
            {isHover && (
              <Box className={classes.chatItemHoverMenu} hidden={!isHover}>
                {DEFAULT_EMOJI_REACTIONS.map((emoji) => (
                  <Button
                    key={emoji}
                    className={classes.hoverMenuItem}
                    onClick={() => handleAddEmojiReaction(emoji)}
                  >
                    <Emoji emoji={emoji} size={HOVER_MENU_EMOJI_SIZE} />
                  </Button>
                ))}
                <Button className={classes.hoverMenuItem}>
                  <IconAddReaction />
                </Button>
                <Button className={classes.hoverMenuItem} onClick={handleOpenThreeDotsMenu}>
                  <MoreVerticalIcon />
                </Button>
              </Box>
            )}
            <Popover
              id={message.sid}
              open={Boolean(anchorEl) && isHover}
              anchorEl={anchorEl}
              onClose={handleCloseThreeDotsMenu}
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
                <MenuItem onClick={handleViewProfile}>
                  <Typography variant="inherit">View Profile</Typography>
                </MenuItem>
                {isGroupChannel && (
                  <MenuItem onClick={handleOpenBlockMemberModal}>
                    <Typography variant="inherit">Block Member</Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleReportIssue}>
                  <Typography variant="inherit" className={classes.report} noWrap>
                    Report Issue
                  </Typography>
                </MenuItem>
              </MenuList>
            </Popover>
          </Box>
        )}
        {messageBody}
      </div>
    </ListItem>
  );
};

export default CommunityChatMessageItem;
