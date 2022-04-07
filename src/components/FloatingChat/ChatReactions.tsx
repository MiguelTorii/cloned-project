import React, { useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import { Emoji, Picker } from 'emoji-mart';
import { useSelector } from 'react-redux';

import { Box, Chip, Popover } from '@material-ui/core';

import { CHAT_REACTION_EMOJI_SIZE } from 'constants/common';

import { ReactComponent as IconAddEmoji } from 'assets/svg/add_reaction.svg';

import useStyles from './ChatReactionsStyles';

import type { ChatReactionGroupData, ChatReactionsData } from 'types/models';

type Props = {
  data: ChatReactionsData;
  onAddEmoji: (colon: string) => void;
  onRemoveEmoji: (colon: string) => void;
  onSelectEmoji: (colon: string) => void;
};

const ChatReactions = React.memo(({ data, onAddEmoji, onRemoveEmoji, onSelectEmoji }: Props) => {
  const classes = useStyles();
  const myUserId: any = useSelector<any>((state) => state.user.data.userId);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState(null);

  const myUserIdNumber = useMemo(() => parseInt(myUserId, 10), [myUserId]);

  const groupedData = useMemo(() => {
    const result: Array<ChatReactionGroupData> = [];

    const addSkinToneData = (primaryColon, skinTone, count, reacted) => {
      const groupIndex = result.findIndex((group) => group.primaryColon === primaryColon);
      if (groupIndex >= 0) {
        result[groupIndex].skinTones.push(skinTone);
        result[groupIndex].count += count;
        result[groupIndex].reacted ||= reacted;
      } else {
        result.push({
          primaryColon,
          skinTones: [skinTone],
          count,
          reacted
        });
      }
    };

    data.forEach((reaction) => {
      const dividerIndex = reaction.reaction_type.indexOf('::');
      if (dividerIndex >= 0) {
        const primaryColon = reaction.reaction_type.substring(0, dividerIndex + 1);
        const skinTone = reaction.reaction_type.substring(dividerIndex + 1);
        addSkinToneData(
          primaryColon,
          skinTone,
          reaction.user_ids.length,
          reaction.user_ids.includes(myUserIdNumber)
        );
      } else {
        addSkinToneData(
          reaction.reaction_type,
          '',
          reaction.user_ids.length,
          reaction.user_ids.includes(myUserIdNumber)
        );
      }
    });

    return result;
  }, [data, myUserIdNumber]);

  const handleClickAddEmoji = useCallback((event) => {
    setEmojiAnchorEl(event.currentTarget);
  }, []);

  const handleCloseEmojiPopup = useCallback(() => {
    setEmojiAnchorEl(null);
  }, []);

  const handleSelectEmoji = useCallback(
    (emoji) => {
      onSelectEmoji(emoji.colons);
      setEmojiAnchorEl(null);
    },
    [onSelectEmoji]
  );

  return (
    <Box className={classes.root}>
      {groupedData.map((group) => (
        <Chip
          key={group.primaryColon}
          label={group.count}
          className={clsx(classes.chip, group.reacted && 'reacted')}
          clickable
          onClick={() =>
            group.reacted ? onRemoveEmoji(group.primaryColon) : onAddEmoji(group.primaryColon)
          }
          icon={
            <>
              {group.skinTones.map((skinTone) => (
                <Emoji
                  key={skinTone}
                  emoji={group.primaryColon + skinTone}
                  size={CHAT_REACTION_EMOJI_SIZE}
                />
              ))}
            </>
          }
        />
      ))}
      {groupedData.length > 0 && (
        <Chip
          icon={
            <span className={classes.addChipIcon}>
              <IconAddEmoji />
            </span>
          }
          className={classes.addChip}
          clickable
          onClick={handleClickAddEmoji}
        />
      )}
      <Popover
        open={Boolean(emojiAnchorEl)}
        anchorEl={emojiAnchorEl}
        onClose={handleCloseEmojiPopup}
      >
        <Picker onSelect={handleSelectEmoji} />
      </Popover>
    </Box>
  );
});

export default ChatReactions;
