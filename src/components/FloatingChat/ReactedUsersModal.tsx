import React, { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { Emoji } from 'emoji-mart';

import { Box, Chip, Link, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

import { CHAT_REACTION_EMOJI_SIZE } from 'constants/common';
import { getInitials } from 'utils/chat';

import { apiGetChatReactions } from 'api/chat';
import Dialog from 'components/Dialog/Dialog';
import OnlineBadge from 'components/OnlineBadge/OnlineBadge';
import { useAppSelector } from 'redux/store';

import useStyles from './ReactedUsersModalStyles';

import type { ChatReactionUserData } from 'types/models';

type Props = {
  messageSid: string;
  open: boolean;
  onClose: () => void;
  onRemoveReaction: (emojiColon: string) => void;
};

const ReactedUsersModal = ({ messageSid, open, onClose, onRemoveReaction }: Props) => {
  const classes = useStyles();
  const myUserId = Number(useAppSelector((state) => state.user.data.userId));
  const [reactionData, setReactionData] = useState<ChatReactionUserData[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  useEffect(() => {
    if (messageSid && open) {
      apiGetChatReactions(messageSid).then(({ reactions }) => {
        setReactionData(reactions);

        if (reactions.length > 0) {
          setSelectedEmoji(reactions[0].reaction);
        }
      });
    }
  }, [messageSid, open]);

  const handleEmojiClick = useCallback((emojiColon) => {
    setSelectedEmoji(emojiColon);
  }, []);

  const handleRemoveSelectedEmoji = useCallback(() => {
    onRemoveReaction(selectedEmoji as string);
    setReactionData((oldData) =>
      oldData.map((item) => {
        if (item.reaction !== selectedEmoji) {
          return item;
        }

        return {
          ...item,
          listOfUserInfo: item.listOfUserInfo.filter((user) => user.user_id !== myUserId)
        };
      })
    );
  }, [selectedEmoji, myUserId, onRemoveReaction]);

  const reactedUsers =
    reactionData.find((item) => item.reaction === selectedEmoji)?.listOfUserInfo || [];

  return (
    <Dialog
      className={classes.modal}
      contentClassName={classes.modalContent}
      open={open}
      onCancel={onClose}
      title="Who Reacted?"
      maxWidth="md"
    >
      <Box display="flex" alignItems="stretch">
        <Box flexGrow={0} className={classes.emojiSidebar}>
          {reactionData.map((item) => (
            <Box key={item.reaction}>
              <Chip
                className={clsx(classes.emojiChip, selectedEmoji === item.reaction && 'selected')}
                icon={<Emoji emoji={item.reaction} size={CHAT_REACTION_EMOJI_SIZE} />}
                label={item.listOfUserInfo.length}
                onClick={() => handleEmojiClick(item.reaction)}
                color="default"
                clickable
              />
            </Box>
          ))}
        </Box>
        <List>
          {selectedEmoji &&
            reactedUsers.map((userData) => (
              <ListItem key={userData.user_id}>
                <ListItemAvatar>
                  <Link href={`/profile/${userData.user_id}`} target="_blank" underline="none">
                    <OnlineBadge
                      isOnline={userData.is_online}
                      bgColorPath="circleIn.palette.feedBackground"
                    >
                      <Avatar
                        alt={getInitials(`${userData.first_name} ${userData.last_name}`)}
                        src={userData.profile_image_url}
                      >
                        {getInitials(`${userData.first_name} ${userData.last_name}`)}
                      </Avatar>
                    </OnlineBadge>
                  </Link>
                </ListItemAvatar>
                <ListItemText>
                  {userData.first_name} {userData.last_name}
                  {userData.user_id === myUserId && (
                    <>
                      &nbsp;(You)
                      <Link
                        className={classes.removeEmojiButton}
                        component="button"
                        onClick={handleRemoveSelectedEmoji}
                        underline="none"
                      >
                        Click to remove reaction
                      </Link>
                    </>
                  )}
                </ListItemText>
              </ListItem>
            ))}
        </List>
      </Box>
    </Dialog>
  );
};

export default ReactedUsersModal;
