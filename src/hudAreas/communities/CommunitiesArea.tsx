import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import Classes from '../../containers/ClassesGrid/Classes';
import { useStyles } from './CommunitiesAreaStyles';
import { CLASSES_AREA, FEEDS_AREA } from '../../hud/navigationState/hudNavigation';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import ClassFeedSubArea from '../classFeed/ClassFeedSubArea';

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
    <div className={classes.container}>
      {selectedMainSubArea === CLASSES_AREA && <Classes />}

      {selectedMainSubArea === FEEDS_AREA && <ClassFeedSubArea />}
    </div>
  );
};

export default CommunitiesArea;
