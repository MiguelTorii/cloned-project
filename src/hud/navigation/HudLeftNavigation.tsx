import React, { ReactElement } from 'react';

import { useDispatch } from 'react-redux';

import IconChat from '@material-ui/icons/Chat';

import { LEFT_SIDE_AREA } from '../navigationState/hudNavigation';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';

import { useStyles } from './HudNavigationStyles';
import HudTool from './HudTool';

import type { Action, Dispatch } from 'redux';

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
