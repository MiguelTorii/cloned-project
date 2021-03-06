import React from 'react';

import { useSelector } from 'react-redux';

import { Box } from '@material-ui/core';

import MiniWorkflows from 'containers/MiniWorkflows/MiniWorkflows';
import { STUDY_TOOLS_TOP_OPTION } from 'routeConstants';

import HudMissions from '../missions/HudMissions';
import HudStudyTools from '../missions/HudStudyTools';
import { CALENDAR_AREA } from '../navigationState/hudNavigation';

import { useStyles } from './HudFrameStyles';

import type { HudNavigationState } from '../navigationState/hudNavigationState';

const HudRightPanel = () => {
  const classes = useStyles();
  const studyToolsOption: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.studyToolsOption
  );

  const selectedMainArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) => state.hudNavigation.selectedMainArea
  );

  const selectedMainSubArea: string = useSelector(
    (state: { hudNavigation: HudNavigationState }) =>
      state.hudNavigation.selectedMainSubAreas[selectedMainArea]
  );

  return (
    <div className={classes.rightPanel}>
      {(!studyToolsOption || studyToolsOption === STUDY_TOOLS_TOP_OPTION) && (
        <div className={classes.studyTools}>
          <HudStudyTools />
        </div>
      )}
      <div className={classes.missions}>
        <HudMissions />

        {selectedMainSubArea !== CALENDAR_AREA && (
          <Box mt={2}>
            <MiniWorkflows />
          </Box>
        )}
      </div>
    </div>
  );
};

export default HudRightPanel;
