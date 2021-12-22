import React, { useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { HudToolData } from './HudToolData';
import { useStyles } from './HudNavigationStyles';
import {
  EXPERT_MODE_ACCESS,
  SIGN_OUT_BUTTON,
  SUPPORT_AREA,
  CHAT_MAIN_AREA,
  COMMUNITIES_MAIN_AREA,
  ACHIEVEMENTS_MAIN_AREA
} from '../navigationState/hudNavigation';
import useHudRoutes from '../frame/useHudRoutes';
import { signOut } from '../../actions/sign-in';
import type { Dispatch } from '../../types/store';
import reduxStore from '../../configureStore';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { User } from '../../types/models';
import { toggleExpertMode } from '../../actions/user';

type Props = {
  parentNavigationItem: HudToolData;
  profile?: User;
};

const HudToolWithDropdown = ({ parentNavigationItem, profile }: Props) => {
  const classes: any = useStyles();
  const dispatch: Dispatch = useDispatch();

  const setHudArea = useHudRoutes();

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
    (window as any)?.FreshworksWidget('identify', 'ticketForm', {
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email
    });
    (window as any)?.FreshworksWidget('open');
  }, []);

  const selectLeaf = (mainSubArea: string) => {
    if (mainSubArea === SUPPORT_AREA) {
      handleOpenCircleInSupportWidget();
    } else if (mainSubArea === EXPERT_MODE_ACCESS) {
      toggleExpertMode()(dispatch, reduxStore.getState);
    } else if (mainSubArea === SIGN_OUT_BUTTON) {
      dispatch(signOut());
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
            isRootHighlighted && classes.highlightedButton
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
            isRootHighlighted && classes.highlightedButton
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
                    classes.childToolItem,
                    isLeafHighlighted(childTool.id) && classes.highlightedButton
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
    </div>
  );
};

export default HudToolWithDropdown;
