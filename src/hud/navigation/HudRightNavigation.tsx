import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { useStyles } from './HudNavigationStyles';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  areaToDisplayName,
  BOTTOM_RIGHT_SIDE_AREA,
  TOP_RIGHT_SIDE_AREA
} from '../navigationState/hudNavigation';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';

const HudRightNavigation = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  // TODO show icon state
  const isTopVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[TOP_RIGHT_SIDE_AREA]
  );

  const isBottomVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[BOTTOM_RIGHT_SIDE_AREA]
  );

  const selectSideItem = (sideArea: string) => {
    dispatch(toggleSideAreaVisibility(sideArea));
  };

  const chatNavigationItems = [
    {
      id: TOP_RIGHT_SIDE_AREA,
      displayName: areaToDisplayName[TOP_RIGHT_SIDE_AREA],
      iconText: 'C'
    },
    {
      id: BOTTOM_RIGHT_SIDE_AREA,
      displayName: areaToDisplayName[BOTTOM_RIGHT_SIDE_AREA],
      iconText: 'N'
    }
  ];

  return <HudToolbar onSelectItem={selectSideItem} navbarItems={chatNavigationItems} isVertical />;
};

export default HudRightNavigation;
