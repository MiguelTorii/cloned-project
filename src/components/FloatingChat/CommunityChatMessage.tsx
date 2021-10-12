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
import CommunityChatMessageItem from './CommunityChatMessageItem';
import { ChatMessageItem } from '../../types/models';

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
  messageList?: Array<ChatMessageItem>;
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
  const [openReport, setOpenReport] = useState(false);
  const [blockUserId, setBlockuserId] = useState('');
  const [blockUserName, setBlockUserName] = useState('');
  const [openBlockModal, setOpenBlockModal] = useState(false);
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

  const handleViewProfile = useCallback((userId) => {
    history.push(
      buildPath(`/profile/${userId}`, {
        from: PROFILE_PAGE_SOURCE.CHAT
      })
    );
  }, []);

  const handleOpenReport = () => {
    setOpenReport(true);
  };

  const handleCloseReport = () => setOpenReport(false);

  const handleOpenBlockMemberModal = (userId, name) => () => {
    setBlockuserId(userId);
    setBlockUserName(name);
    setOpenBlockModal(true);
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

  return (
    <>
      {messageList.map((message) => (
        <CommunityChatMessageItem
          key={message.sid}
          message={message}
          name={name}
          authorUserId={userId}
          role={role}
          avatar={avatar}
          isOnline={isOnline}
          isGroupChannel={isGroupChannel}
          date={date}
          onViewProfile={handleViewProfile}
          onReportIssue={handleOpenReport}
          onBlockMember={handleOpenBlockMemberModal}
          onImageClick={onImageClick}
          onImageLoaded={onImageLoaded}
          onStartVideoCall={onStartVideoCall}
        />
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
