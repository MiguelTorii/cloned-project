import React from 'react';

import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/es/hooks';
import { useLocation } from 'react-router';

import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconBookmark from 'assets/svg/icon-bookmark-gray.svg';
import IconBookmarkGradient from 'assets/svg/icon-bookmark.svg';
import IconThreeDots from 'assets/svg/icon-dots-gray.svg';
import IconDotsGradient from 'assets/svg/icon-dots.svg';
import IconEye from 'assets/svg/icon-eye-gray.svg';
import IconEyeGradient from 'assets/svg/icon-eye.svg';
import withRoot from 'withRoot';

import ActionItem from './ActionItem';
import useStyles from './styles';

type Props = {
  isOwn: boolean;
  bookmarked: boolean;
  onViewEdit: (...args: Array<any>) => any;
  onBookmark: (...args: Array<any>) => any;
  onShareLink: (...args: Array<any>) => any;
  onDelete: (...args: Array<any>) => any;
};

const ActionBar = ({ isOwn, bookmarked, onViewEdit, onBookmark, onShareLink, onDelete }: Props) => {
  const classes: any = useStyles();
  const { search } = useLocation();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'actionBar'
  });

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
    </Box>
  );
};

export default withRoot(ActionBar);
