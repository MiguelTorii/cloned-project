import React from 'react';
import { useSelector } from 'react-redux';
import { RIGHT_SIDE_AREA } from '../navigationState/hudNavigation';
import { STUDY_TOOLS_TOP_OPTION } from '../../routeConstants';
import HudStudyTools from '../missions/HudStudyTools';
import HudMissions from '../missions/HudMissions';
import { useStyles } from './HudFrameStyles';
import { HudNavigationState } from '../navigationState/hudNavigationState';

const HudRightPanel = () => {
  const classes = useStyles();
  const studyToolsOption: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.studyToolsOption
  );
  const isRightPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  if (!isRightPaneVisible) {
    return null;
  }

  return (
    <div className={classes.rightPanel}>
      {(!studyToolsOption || studyToolsOption === STUDY_TOOLS_TOP_OPTION) && (
        <div className={classes.studyTools}>
          <HudStudyTools />
        </div>
      )}

      <div className={classes.missions}>
        <HudMissions />
      </div>
    </div>
  );
};

export default HudRightPanel;
