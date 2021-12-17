import React from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { RIGHT_SIDE_AREA, CALENDAR_AREA } from '../navigationState/hudNavigation';
import { STUDY_TOOLS_TOP_OPTION } from '../../routeConstants';
import HudStudyTools from '../missions/HudStudyTools';
import HudMissions from '../missions/HudMissions';
import { useStyles } from './HudFrameStyles';
import { HudNavigationState } from '../navigationState/hudNavigationState';
import MiniWorkflows from '../../containers/MiniWorkflows/MiniWorkflows';

const HudRightPanel = () => {
  const classes = useStyles();
  const studyToolsOption: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.studyToolsOption
  );
  const isRightPaneVisible: boolean = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.sideAreaToIsVisible[RIGHT_SIDE_AREA]
  );

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
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

      {selectedMainSubArea !== CALENDAR_AREA && (
        <Box mt={2}>
          <MiniWorkflows isHud />
        </Box>
      )}
    </div>
  );
};

export default HudRightPanel;
