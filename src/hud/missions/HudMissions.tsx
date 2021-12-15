import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import RightPanelCard from '../../components/RightPanelCard/RightPanelCard';
import { apiGetMissions } from '../../api/user';
import { setMissions } from '../rightPanelState/hudRightPanelActions';
import { AppState } from '../../configureStore';
import { TMission } from '../../types/models';
import HudMission from './HudMission';

const HudMissions = () => {
  const dispatch = useDispatch();
  const missions = useSelector<AppState, Array<TMission>>((state) => state.hudRightPanel.missions);

  useEffect(() => {
    apiGetMissions().then(({ missions }) => {
      dispatch(setMissions(missions));
    });
  }, [dispatch]);

  if (!missions) {
    return null;
  }

  return (
    <RightPanelCard title="Rewards">
      <Grid container spacing={2}>
        {missions.map((mission) => (
          <Grid key={mission.id} item xs={12}>
            <HudMission data={mission} />
          </Grid>
        ))}
      </Grid>
    </RightPanelCard>
  );
};

export default HudMissions;
