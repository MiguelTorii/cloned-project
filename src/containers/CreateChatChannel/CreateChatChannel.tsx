import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { getInitials } from '../../utils/chat';
import type { UserState } from '../../reducers/user';
import type { ChatState } from '../../reducers/chat';
import CreateChatChannelDialog from '../../components/CreateChatChannelDialog/CreateChatChannelDialog';
import { searchUsers } from '../../api/user';
import { getPresignedURL } from '../../api/media';
import { createChannel } from '../../api/chat';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

type Props = {
  type?: string | null | undefined;
  client?: Record<string, any>;
  isVideo?: boolean;
  onClose?: (...args: Array<any>) => any;
  onChannelCreated?: (...args: Array<any>) => any;
  title?: string | null | undefined;
  channels?: any;
};

const CreateChatChannel = ({
  type,
  client,
  isVideo = false,
  onClose,
  onChannelCreated,
  title,
  channels
}: Props) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prevEntityUuid, setPrevEntityUuid] = useState<string>('');

  const {
    data: { userId, schoolId }
  } = useSelector((state: { user: UserState }) => state.user);

  const {
    data: { entityId, entityFirstName, entityLastName, entityVideo, entityUuid }
  } = useSelector((state: { chat: ChatState }) => state.chat);

  useEffect(() => {
    if (entityId !== 0 && entityUuid !== prevEntityUuid) {
      handleSubmit({
        chatType: 'single',
        name: '',
        type: '',
        selectedUsers: [
          {
            userId: entityId,
            firstName: entityFirstName,
            lastName: entityLastName
          }
        ],
        startVideo: entityVideo
      });
    }
    setPrevEntityUuid(entityUuid);
  }, [entityId, entityFirstName, entityLastName, entityVideo, entityUuid, prevEntityUuid]);

  const handleLoadOptions = async ({ query, from }) => {
    if (query.trim() === '' || query.trim().length < 3) {
      return {
        options: [],
        hasMore: false
      };
    }

    const users = await searchUsers({
      userId,
      query,
      schoolId: from === 'school' ? Number(schoolId) : undefined
    });
    const options = users.map((user) => {
      const name = `${user.firstName} ${user.lastName}`;
      const initials = getInitials(name);
      return {
        value: user.userId,
        label: name,
        school: user.school,
        grade: user.grade,
        avatar: user.profileImageUrl,
        initials,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        relationship: user.relationship
      };
    });
    return {
      options,
      hasMore: false
    };
  };

  const handleUploadThumbnail = async (file) => {
    const result = await getPresignedURL({
      userId,
      type: 4,
      mediaType: file.type
    });
    const { readUrl, url } = result;
    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type
      }
    });
    setThumbnail(readUrl);
  };

  const handleSubmit = async ({ chatType, name, type, selectedUsers, startVideo = false }) => {
    setIsLoading(true);

    try {
      const users = selectedUsers.map((item) => Number(item.userId));
      const { chatId, isNewChat } = await createChannel({
        users,
        groupName: chatType === 'group' ? name : '',
        type: chatType === 'group' ? type : '',
        thumbnailUrl: chatType === 'group' ? thumbnail : ''
      });

      if (chatId !== '') {
        try {
          const channel = await client.getChannelBySid(chatId);
          onChannelCreated({
            channel,
            isNew: isNewChat,
            startVideo
          });
          handleClose();
        } catch (e) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setThumbnail(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <ErrorBoundary>
      <CreateChatChannelDialog
        chatType={type}
        thumbnail={thumbnail}
        isLoading={isLoading}
        isVideo={isVideo}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onLoadOptions={handleLoadOptions}
        onSendInput={handleUploadThumbnail}
        title={title}
      />
    </ErrorBoundary>
  );
};

export default withMobileDialog()(CreateChatChannel);
