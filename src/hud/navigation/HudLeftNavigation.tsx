import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import IconChat from '@material-ui/icons/Chat';
import { useStyles } from './HudNavigationStyles';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { LEFT_SIDE_AREA } from '../navigationState/hudNavigation';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';

const HudLeftNavigation = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const isVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[LEFT_SIDE_AREA]
  );

  const selectSideItem = () => {
    dispatch(toggleSideAreaVisibility(LEFT_SIDE_AREA));
  };

  const chatNavigationItems = [
    {
      id: LEFT_SIDE_AREA,
      displayName: 'Chat',
      icon: <IconChat />
    }
  ];

  return <HudToolbar onSelectItem={selectSideItem} navbarItems={chatNavigationItems} />;
};

export default HudLeftNavigation;
