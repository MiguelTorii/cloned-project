import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { ReactComponent as IconClasses } from '../../assets/svg/class-feed-icon-off.svg';
import { ReactComponent as IconNotes } from '../../assets/svg/notes-icon-off.svg';
import { ReactComponent as IconLeaderboard } from '../../assets/svg/leaderboard-icon-off.svg';
import Avatar from '../../components/Avatar/Avatar';
import { User } from '../../types/models';
import { useStyles } from './HudNavigationStyles';
import HudToolbar from './HudToolbar';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import {
  ACHIEVEMENTS_MAIN_AREA,
  areaToDisplayName,
  COMMUNITIES_MAIN_AREA,
  mainSubAreasInOrder,
  MORE_MAIN_AREA,
  PROFILE_MAIN_AREA,
  STUDY_TOOLS_MAIN_AREA
} from '../navigationState/hudNavigation';
import {
  setSelectedMainArea,
  setSelectedMainSubArea
} from '../navigationState/hudNavigationActions';
import { UserState } from '../../reducers/user';

const ICON_SIZE = 30;

const HudMainNavigation = () => {
  // TODO add this to make the icons all the same size.
  const classes: any = useStyles();

  const dispatch: Dispatch<Action> = useDispatch();

  const profile: User = useSelector((state: { user: UserState }) => state.user.data);

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );
  const selectRoot = (mainArea: string) => {
    dispatch(setSelectedMainArea(mainArea));
  };

  const selectLeaf = (mainSubArea: string) => {
    const validSubAreas = mainSubAreasInOrder[selectedMainArea];
    if (validSubAreas.includes(mainSubArea)) {
      dispatch(setSelectedMainSubArea(selectedMainArea, mainSubArea));
    }
  };

  const rootNavigationItems = [
    {
      id: PROFILE_MAIN_AREA,
      displayName: areaToDisplayName[PROFILE_MAIN_AREA],
      icon: <Avatar src={profile.profileImage} desktopSize={ICON_SIZE} mobileSize={ICON_SIZE} />
    },
    {
      id: COMMUNITIES_MAIN_AREA,
      displayName: areaToDisplayName[COMMUNITIES_MAIN_AREA],
      icon: <IconClasses />
    },
    {
      id: STUDY_TOOLS_MAIN_AREA,
      displayName: areaToDisplayName[STUDY_TOOLS_MAIN_AREA],
      icon: <IconNotes />
    },
    {
      id: ACHIEVEMENTS_MAIN_AREA,
      displayName: areaToDisplayName[ACHIEVEMENTS_MAIN_AREA],
      icon: <IconLeaderboard />
    },
    {
      id: MORE_MAIN_AREA,
      displayName: areaToDisplayName[MORE_MAIN_AREA],
      iconText: '...'
    }
  ];

  const leafNavigationItems = mainSubAreasInOrder[selectedMainArea].map((subArea: string) => ({
    id: subArea,
    displayName: areaToDisplayName[subArea],
    iconText: areaToDisplayName[subArea][0]
  }));

  return (
    <>
      <HudToolbar onSelectItem={selectLeaf} navbarItems={leafNavigationItems} />
      <HudToolbar onSelectItem={selectRoot} navbarItems={rootNavigationItems} />
    </>
  );
};

export default HudMainNavigation;
