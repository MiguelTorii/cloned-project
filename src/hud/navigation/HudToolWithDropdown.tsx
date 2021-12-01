import React from 'react';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useDispatch } from 'react-redux';
import { HudToolData } from './HudToolData';
import { useStyles } from './HudNavigationStyles';
import { SIGN_OUT_BUTTON, SUPPORT_AREA } from '../navigationState/hudNavigation';
import useHudRoutes from '../frame/useHudRoutes';
import { signOut } from '../../actions/sign-in';

type Props = {
  parentNavigationItem: HudToolData;
};

const HudToolWithDropdown = ({ parentNavigationItem }: Props) => {
  const classes: any = useStyles();
  const dispatch = useDispatch();

  const setHudArea = useHudRoutes();

  const selectLeaf = (mainSubArea: string) => {
    if (mainSubArea === SUPPORT_AREA) {
      // Open support window
      window.open('https://tutors.circleinapp.com/home', '_blank');
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
          className={classes.parentNavigationItem}
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
          <Button className={classes.parentNavigationItem} onClick={onMenuClick}>
            <ListItemIcon className={classes.parentNavigationIcon}>
              {parentNavigationItem.icon}
            </ListItemIcon>
            {!parentNavigationItem.showIconOnly && (
              <Typography className={classes.parentNavigationItemText}>
                {parentNavigationItem.displayName}
              </Typography>
            )}
            <ArrowDropDownIcon />
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
                  className={classes.childToolItem}
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
