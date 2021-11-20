import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { CalendarToday } from '@material-ui/icons';
import { useStyles } from './HudNavigationStyles';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { BOTTOM_RIGHT_SIDE_AREA, TOP_RIGHT_SIDE_AREA } from '../navigationState/hudNavigation';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';
import { ReactComponent as IconPosts } from '../../assets/svg/posts.svg';

const areaToDisplayName: Record<string, { name: string; icon: ReactElement }> = {
  [BOTTOM_RIGHT_SIDE_AREA]: { name: 'Next Missions', icon: <IconPosts /> },
  [TOP_RIGHT_SIDE_AREA]: { name: 'Current Missions', icon: <IconPosts /> }
};

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
    // TODO combine these
    dispatch(toggleSideAreaVisibility(TOP_RIGHT_SIDE_AREA));
    dispatch(toggleSideAreaVisibility(BOTTOM_RIGHT_SIDE_AREA));
  };

  const missionNavigationItems = [
    // {
    //   id: TOP_RIGHT_SIDE_AREA,
    //   displayName: areaToDisplayName[TOP_RIGHT_SIDE_AREA].name,
    //   iconText: 'C'
    // },
    {
      id: BOTTOM_RIGHT_SIDE_AREA,
      displayName: areaToDisplayName[BOTTOM_RIGHT_SIDE_AREA].name,
      icon: <CalendarToday />
    }
  ];

  return <HudToolbar onSelectItem={selectSideItem} navbarItems={missionNavigationItems} />;
};

export default HudRightNavigation;
