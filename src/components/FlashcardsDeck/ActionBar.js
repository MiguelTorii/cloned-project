import React from 'react';
import withRoot from '../../withRoot';
import useStyles from './styles';
import Box from '@material-ui/core/Box';
import IconEye from '@material-ui/icons/VisibilityOutlined';
import IconBookmark from '@material-ui/icons/BookmarkBorder';
import IconBookmarked from '@material-ui/icons/Bookmark';
import ThreeDots from '@material-ui/icons/MoreHoriz';
import clsx from 'clsx';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

type Props = {
  bookmarked: boolean,
  onViewEdit: Function,
  onBookmark: Function,
  onShareLink: Function,
  onReportIssue: Function
};

const ActionBar = (
  {
    bookmarked,
    onViewEdit,
    onBookmark,
    onShareLink,
    onReportIssue
  }: Props
) => {
  const classes = useStyles();

  const ActionItem = ({ icon: Icon, active, text, onClick = () => {} }) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        onClick={onClick}
        className={clsx(classes.actionItem, active && 'active')}
      >
        <div>
          <Icon />
        </div>
        <Box fontSize={12}>
          { text }
        </Box>
      </Box>
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      className={classes.actionBar}
    >
      <ActionItem
        icon={IconEye}
        text="View/Edit"
        onClick={onViewEdit}
      />
      <ActionItem
        icon={bookmarked ? IconBookmarked : IconBookmark}
        text="Bookmark"
        active={bookmarked}
        onClick={onBookmark}
      />
      <PopupState variant="popover">
        {
          (popupState) => (
            <>
              <div {...bindTrigger(popupState)}>
                <ActionItem
                  icon={ThreeDots}
                  text="More"
                />
              </div>
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={() => { popupState.close(); onShareLink(); }}>Share Link</MenuItem>
                {/*<MenuItem*/}
                {/*  className={classes.reportText}*/}
                {/*  onClick={() => { popupState.close(); onReportIssue(); }}*/}
                {/*>*/}
                {/*  Report Issue*/}
                {/*</MenuItem>*/}
              </Menu>
            </>
          )
        }
      </PopupState>
    </Box>
  );
};

export default withRoot(ActionBar);
