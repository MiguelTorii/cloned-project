import React, { ReactElement } from 'react';
import IconChat from '@material-ui/icons/Chat';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { ReactComponent as IconChatMembers } from '../../assets/svg/chat-studyroom-members.svg';
import { useStyles } from './HudNavigationStyles';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import { BOTTOM_LEFT_SIDE_AREA, TOP_LEFT_SIDE_AREA } from '../navigationState/hudNavigation';
import { toggleSideAreaVisibility } from '../navigationState/hudNavigationActions';
import { ReactComponent as IconPosts } from '../../assets/svg/posts.svg';

const areaToDisplayName: Record<string, { name: string; icon: ReactElement }> = {
  [BOTTOM_LEFT_SIDE_AREA]: { name: 'Chat Channels', icon: <IconPosts /> },
  [TOP_LEFT_SIDE_AREA]: { name: 'Chat Messages', icon: <IconPosts /> }
};

const HudLeftNavigation = () => {
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  // TODO show icon state
  const isTopVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[TOP_LEFT_SIDE_AREA]
  );

  const isBottomVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[BOTTOM_LEFT_SIDE_AREA]
  );

  const selectSideItem = (sideArea: string) => {
    dispatch(toggleSideAreaVisibility(sideArea));
  };

  const chatNavigationItems = [
    {
      id: TOP_LEFT_SIDE_AREA,
      displayName: areaToDisplayName[TOP_LEFT_SIDE_AREA].name,
      icon: <IconChat />
    },
    {
      id: BOTTOM_LEFT_SIDE_AREA,
      displayName: areaToDisplayName[BOTTOM_LEFT_SIDE_AREA].name,
      icon: <IconChatMembers />
    }
  ];

  return <HudToolbar onSelectItem={selectSideItem} navbarItems={chatNavigationItems} isVertical />;
};

export default HudLeftNavigation;
