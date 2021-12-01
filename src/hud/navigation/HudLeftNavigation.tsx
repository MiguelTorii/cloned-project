import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { Action, Dispatch } from 'redux';
import IconChat from '@material-ui/icons/Chat';
import { useStyles } from './HudNavigationStyles';
import { LEFT_SIDE_AREA } from '../navigationState/hudNavigation';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';
import HudTool from './HudTool';

const HudLeftNavigation = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const selectSideItem = () => {
    dispatch(toggleSideAreaVisibility(LEFT_SIDE_AREA));
  };

  const chatNavigationItem = {
    id: LEFT_SIDE_AREA,
    displayName: 'Chat',
    icon: <IconChat />
  };

  return (
    <HudTool onSelectItem={selectSideItem} navbarItem={chatNavigationItem} isSelected={false} />
  );
};

export default HudLeftNavigation;
