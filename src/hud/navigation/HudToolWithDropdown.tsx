import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { openSupportWidget } from 'utils/helpers';

import { toggleExpertMode } from 'actions/user';
import InviteFriendsModal from 'components/InviteFriendsModal/InviteFriendsModal';
import useHudAreaSetter from 'hud/frame/useHudRoutes';
import {
  EXPERT_MODE_ACCESS,
  SIGN_OUT_BUTTON,
  SUPPORT_AREA,
  CHAT_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  ACHIEVEMENTS_MAIN_AREA,
  INVITE_FRIENDS_AREA
} from 'hud/navigationState/hudNavigation';
import reduxStore from 'redux/store';
import { useStyles as useHighlightedButtonStyles } from 'styles/HighlightedButton';

import { useStyles } from './HudNavigationStyles';

import type { HudToolData } from './HudToolData';
import type { HudNavigationState } from 'hud/navigationState/hudNavigationState';
import type { User } from 'types/models';

type Props = {
  parentNavigationItem: HudToolData;
  profile?: User;
};

const HudToolWithDropdown = ({ parentNavigationItem, profile }: Props) => {
  const classes: any = useStyles();
  const highlightedButtonStyles = useHighlightedButtonStyles();

  const dispatch: Dispatch = useDispatch();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const setHudArea = useHudAreaSetter();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const highlightedNavigation = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.highlightedNavigation
  );

  const isSelected = parentNavigationItem.id === selectedMainArea;
  const isRootHighlighted = parentNavigationItem.id === highlightedNavigation?.rootAreaId;

  const isLeafHighlighted = (leafAreaId: string): boolean =>
    leafAreaId === highlightedNavigation?.leafAreaId;

  const handleOpenCircleInSupportWidget = useCallback(() => {
    openSupportWidget(`${profile.firstName} ${profile.lastName}`, profile.email);
  }, []);

  const selectLeaf = (mainSubArea: string) => {
    if (mainSubArea === SUPPORT_AREA) {
      handleOpenCircleInSupportWidget();
    } else if (mainSubArea === EXPERT_MODE_ACCESS) {
      toggleExpertMode()(dispatch, reduxStore.getState);
    } else if (mainSubArea === SIGN_OUT_BUTTON) {
      dispatch(signOut());
    } else if (mainSubArea === INVITE_FRIENDS_AREA) {
      setIsInviteModalOpen(true);
    } else {
      setHudArea(parentNavigationItem.id, mainSubArea);
    }
  };

  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const onMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };
  const onMenuItemClick = (childToolId: string) => {
    setAnchorElement(null);
    selectLeaf(childToolId);
  };

  const navbarItemClass = (parentNavId: string) => {
    switch (parentNavId) {
      case COMMUNITIES_MAIN_AREA:
        return classes.navbarClasses;
      case ACHIEVEMENTS_MAIN_AREA:
        return classes.navbarLeaderboard;
      case CHAT_MAIN_AREA:
        return classes.navbarChat;
      default:
        return null;
    }
  };

  const renderParentNavButton = (multipleItems: boolean) => (
    <>
      {multipleItems ? (
        <Button
          className={clsx(
            parentNavigationItem.isCompact
              ? classes.compactParentNavigationItem
              : classes.parentNavigationItem,
            isSelected && classes.selectedButton,
            isRootHighlighted && highlightedButtonStyles.animated
          )}
          onClick={onMenuClick}
        >
          <ListItemIcon className={classes.parentNavigationIcon}>
            {parentNavigationItem.icon}
          </ListItemIcon>
          {!parentNavigationItem.showIconOnly && (
            <Typography
              className={clsx(
                classes.parentNavigationItemText,
                navbarItemClass(parentNavigationItem.id)
              )}
            >
              {parentNavigationItem.displayName}
            </Typography>
          )}
          <ArrowDropDownIcon
            className={clsx(
              parentNavigationItem.isCompact ? classes.compactArrowDropdown : classes.arrowDropdown,
              navbarItemClass(parentNavigationItem.id)
            )}
          />
        </Button>
      ) : (
        <Button
          className={clsx(
            parentNavigationItem.isCompact
              ? classes.compactParentNavigationItem
              : classes.parentNavigationItem,
            isSelected && classes.selectedButton,
            isRootHighlighted && highlightedButtonStyles.animated
          )}
          onClick={() => onMenuItemClick(parentNavigationItem.childTools[0].id)}
        >
          <ListItemIcon className={classes.parentNavigationIcon}>
            {parentNavigationItem.icon}
          </ListItemIcon>
          {!parentNavigationItem.showIconOnly && (
            <Typography
              className={clsx(
                classes.parentNavigationItemText,
                navbarItemClass(parentNavigationItem.id)
              )}
            >
              {parentNavigationItem.displayName}
            </Typography>
          )}
        </Button>
      )}
    </>
  );

  const hasMultipleItems = true;

  return (
    <div id={parentNavigationItem.id} className={classes.controlPanelMainSectionGroup}>
      {parentNavigationItem.childTools.length === 1 ? (
        <>
          {parentNavigationItem.tooltip ? (
            <Tooltip arrow title={parentNavigationItem.displayName}>
              {renderParentNavButton(!hasMultipleItems)}
            </Tooltip>
          ) : (
            renderParentNavButton(!hasMultipleItems)
          )}
        </>
      ) : (
        <>
          {parentNavigationItem.tooltip ? (
            <Tooltip arrow title={parentNavigationItem.displayName}>
              {renderParentNavButton(hasMultipleItems)}
            </Tooltip>
          ) : (
            renderParentNavButton(hasMultipleItems)
          )}
          <Menu
            className={classes.parentNavigationMenu}
            anchorEl={anchorElement}
            open={open}
            onClose={handleClose}
          >
            {parentNavigationItem.childTools.map((childTool) => (
              <div key={childTool.id}>
                <MenuItem
                  className={clsx(
                    classes.menuItem,
                    isLeafHighlighted(childTool.id) && highlightedButtonStyles.animated
                  )}
                  onClick={() => onMenuItemClick(childTool.id)}
                >
                  <ListItemIcon className={classes.childToolIcon}>{childTool.icon}</ListItemIcon>
                  <ListItemText>{childTool.displayName}</ListItemText>
                </MenuItem>
              </div>
            ))}
          </Menu>
        </>
      )}
      <InviteFriendsModal open={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
    </div>
  );
};

export default HudToolWithDropdown;
