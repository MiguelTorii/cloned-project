import 'react-quill/dist/quill.snow.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useHistory, withRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { PROFILE_PAGE_SOURCE } from 'constants/common';
import { buildPath } from 'utils/helpers';

import BlockMemberModal from '../BlockMemberModal/BlockMemberModal';
import NewMessageLine from '../NewMessageLine/NewMessageLine';
import StudyRoomReport from '../StudyRoomReport/ReportIssue';

import CommunityChatMessageItem from './CommunityChatMessageItem';

import type { ChatMessageItem } from 'types/models';

const MyLink = React.forwardRef<any, any>(({ href, ...props }, ref) => (
  <RouterLink to={href} {...props} ref={ref} />
));

type Props = {
  userId?: string;
  name?: string;
  avatar?: string;
  isOnline?: boolean;
  date?: string;
  channelId: string;
  isGroupChannel?: boolean;
  members?: Array<any>;
  lastReadMessageIndex: number;
  isLastMessage: boolean;
  messageList?: Array<ChatMessageItem>;
  onImageLoaded?: (...args: Array<any>) => any;
  onStartVideoCall?: (...args: Array<any>) => any;
  onImageClick?: (...args: Array<any>) => any;
  handleBlock?: (...args: Array<any>) => any;
  onRemoveMessage: (messageId: string) => void;
};

const ChatMessage = ({
  userId,
  name,
  date,
  channelId,
  avatar,
  isOnline,
  members,
  isGroupChannel,
  messageList,
  onImageLoaded,
  onStartVideoCall,
  onImageClick,
  handleBlock,
  lastReadMessageIndex,
  isLastMessage,
  onRemoveMessage
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
      {messageList.map((message, index) => (
        <React.Fragment key={message.sid}>
          <CommunityChatMessageItem
            message={message}
            name={name}
            authorUserId={userId}
            avatar={avatar}
            channelId={channelId}
            isOnline={isOnline}
            isGroupChannel={isGroupChannel}
            date={date}
            onViewProfile={handleViewProfile}
            onReportIssue={handleOpenReport}
            onBlockMember={handleOpenBlockMemberModal}
            onImageClick={onImageClick}
            onImageLoaded={onImageLoaded}
            onStartVideoCall={onStartVideoCall}
            onRemoveMessage={onRemoveMessage}
          />
          {/* Display the line if the message item is not the last item of the last message. */}
          {message.index === lastReadMessageIndex &&
            (!isLastMessage || index < messageList.length - 1) && <NewMessageLine />}
        </React.Fragment>
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
