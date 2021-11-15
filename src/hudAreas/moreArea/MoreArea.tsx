import React from 'react';
import { useSelector } from 'react-redux';
import {
  GET_THE_MOBILE_APP_AREA,
  GIVE_FEEDBACK_AREA,
  SUPPORT_AREA
} from '../../hud/navigationState/hudNavigation';
import { HudNavigationState } from '../../hud/navigationState/hudNavigationState';
import { useStyles } from './MoreAreaStyles';

const MoreArea = () => {
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
      {selectedMainSubArea === SUPPORT_AREA && 'SUPPORT_AREA'}

      {selectedMainSubArea === GIVE_FEEDBACK_AREA && 'GIVE_FEEDBACK_AREA'}

      {selectedMainSubArea === GET_THE_MOBILE_APP_AREA && 'GET_THE_MOBILE_APP_AREA'}
    </div>
  );
};

export default MoreArea;
