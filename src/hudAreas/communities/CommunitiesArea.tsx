import React, { useRef } from 'react';

import { useSelector } from 'react-redux';

import { COMMUNITY_SCROLL_CONTAINER_ID } from 'constants/common';

import Classes from 'containers/ClassesGrid/Classes';
import { CLASSES_AREA, FEEDS_AREA } from 'hud/navigationState/hudNavigation';

import ClassFeedSubArea from '../classFeed/ClassFeedSubArea';

import { useStyles } from './CommunitiesAreaStyles';

import type { HudNavigationState } from 'hud/navigationState/hudNavigationState';

const CommunitiesArea = () => {
  const classes: any = useStyles();

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  return (
    <div id={COMMUNITY_SCROLL_CONTAINER_ID} className={classes.container}>
      {selectedMainSubArea === CLASSES_AREA && <Classes />}

      {selectedMainSubArea === FEEDS_AREA && <ClassFeedSubArea />}
    </div>
  );
};

export default CommunitiesArea;
