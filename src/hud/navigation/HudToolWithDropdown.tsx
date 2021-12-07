import React, { useCallback } from 'react';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { HudToolData } from './HudToolData';
import { useStyles } from './HudNavigationStyles';
import { SIGN_OUT_BUTTON, SUPPORT_AREA } from '../navigationState/hudNavigation';
import useHudRoutes from '../frame/useHudRoutes';
import { signOut } from '../../actions/sign-in';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { User } from '../../types/models';

type Props = {
  parentNavigationItem: HudToolData;
  profile?: User;
};

const HudToolWithDropdown = ({ parentNavigationItem, profile }: Props) => {
  const classes: any = useStyles();
  const dispatch = useDispatch();

  const setHudArea = useHudRoutes();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const isSelected = parentNavigationItem.id === selectedMainArea;

  // handles support window pop out
  const handleOpenWidget = useCallback(() => {
    (window as any)?.FreshworksWidget('identify', 'ticketForm', {
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email
    });
    (window as any)?.FreshworksWidget('open');
  }, []);

  const selectLeaf = (mainSubArea: string) => {
    if (mainSubArea === SUPPORT_AREA) {
      handleOpenWidget();
    } else if (mainSubArea === SIGN_OUT_BUTTON) {
      dispatch(signOut());
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

  return (
    <div id={parentNavigationItem.id} className={classes.controlPanelMainSectionGroup}>
      {parentNavigationItem.childTools.length === 1 ? (
        <Button
          className={clsx(classes.parentNavigationItem, isSelected && classes.selectedButton)}
          onClick={() => onMenuItemClick(parentNavigationItem.childTools[0].id)}
        >
          <ListItemIcon className={classes.parentNavigationIcon}>
            {parentNavigationItem.icon}
          </ListItemIcon>
          {!parentNavigationItem.showIconOnly && (
            <Typography className={classes.parentNavigationItemText}>
              {parentNavigationItem.displayName}
            </Typography>
          )}
        </Button>
      ) : (
        <>
          <Button
            className={clsx(classes.parentNavigationItem, isSelected && classes.selectedButton)}
            onClick={onMenuClick}
          >
            <ListItemIcon className={classes.parentNavigationIcon}>
              {parentNavigationItem.icon}
            </ListItemIcon>
            {!parentNavigationItem.showIconOnly && (
              <Typography className={classes.parentNavigationItemText}>
                {parentNavigationItem.displayName}
              </Typography>
            )}
            <ArrowDropDownIcon className={classes.arrowDropdown} />
          </Button>
          <Menu
            className={classes.parentNavigationMenu}
            anchorEl={anchorElement}
            open={open}
            onClose={handleClose}
          >
            {parentNavigationItem.childTools.map((childTool) => (
              <div key={childTool.id}>
                <MenuItem
                  className={clsx(classes.childToolItem)}
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
