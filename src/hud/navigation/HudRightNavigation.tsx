import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { CalendarToday } from '@material-ui/icons';
import { useStyles } from './HudNavigationStyles';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { RIGHT_SIDE_AREA } from '../navigationState/hudNavigation';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';

const HudRightNavigation = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  // TODO show icon state
  const isVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const selectSideItem = (sideArea: string) => {
    dispatch(toggleSideAreaVisibility(RIGHT_SIDE_AREA));
  };

  const missionNavigationItems = [
    {
      id: RIGHT_SIDE_AREA,
      displayName: 'Missions',
      icon: <CalendarToday />
    }
  ];

  return <HudToolbar onSelectItem={selectSideItem} navbarItems={missionNavigationItems} />;
};

export default HudRightNavigation;
