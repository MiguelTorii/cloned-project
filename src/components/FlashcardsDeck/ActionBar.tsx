// @flow
import React from 'react';
import { useLocation } from 'react-router';

import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import IconEye from 'assets/svg/icon-eye-gray.svg';
import IconBookmark from 'assets/svg/icon-bookmark-gray.svg';
import IconThreeDots from 'assets/svg/icon-dots-gray.svg';
import IconEyeGradient from 'assets/svg/icon-eye.svg';
import IconBookmarkGradient from 'assets/svg/icon-bookmark.svg';
import IconDotsGradient from 'assets/svg/icon-dots.svg';
import ActionItem from 'components/FlashcardsDeck/ActionItem';

import useStyles from './styles';
import withRoot from '../../withRoot';

type Props = {
  isOwn: boolean,
  bookmarked: boolean,
  onViewEdit: Function,
  onBookmark: Function,
  onShareLink: Function,
  onDelete: Function
};

const ActionBar = ({ isOwn, bookmarked, onViewEdit, onBookmark, onShareLink, onDelete }: Props) => {
  const classes = useStyles();
  const { search } = useLocation();

  return (
    <Box display="flex" justifyContent="space-between" className={classes.actionBar}>
      <ActionItem
        icon={IconEye}
        activeIcon={IconEyeGradient}
        text={search.includes('past') ? 'View' : 'View/Edit'}
        onClick={onViewEdit}
      />
      <ActionItem
        icon={IconBookmark}
        activeIcon={IconBookmarkGradient}
        text="Bookmark"
        active={bookmarked}
        onClick={onBookmark}
      />
      <PopupState variant="popover">
        {(popupState) => (
          <>
            <div {...bindTrigger(popupState)}>
              <ActionItem icon={IconThreeDots} activeIcon={IconDotsGradient} text="More" />
            </div>
            <Menu {...bindMenu(popupState)}>
              <MenuItem
                onClick={() => {
                  popupState.close();
                  onShareLink();
                }}
              >
                Share Link
              </MenuItem>
              {isOwn && (
                <MenuItem
                  className={classes.reportText}
                  onClick={() => {
                    popupState.close();
                    onDelete();
                  }}
                >
                  Delete Flashcard Deck
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </PopupState>
    </Box>
  );
};

export default withRoot(ActionBar);
