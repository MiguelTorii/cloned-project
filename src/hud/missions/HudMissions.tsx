import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Link } from '@material-ui/core';
import RightPanelCard from '../../components/RightPanelCard/RightPanelCard';
import { apiGetMissions } from '../../api/user';
import { setMissions } from '../rightPanelState/hudRightPanelActions';
import { AppState } from 'redux/store';
import { TMission } from '../../types/models';
import HudMission from './HudMission';
import { CIRCLEIN_REWARDS_URL } from '../../constants/app';

const HudMissions = () => {
  const dispatch = useDispatch();
  const missions = useSelector<AppState, TMission[]>((state) => state.hudRightPanel.missions);

  useEffect(() => {
    apiGetMissions().then((missions) => {
      dispatch(setMissions(missions));
    });
  }, [dispatch]);

  if (!missions) {
    return null;
  }

  return (
    <RightPanelCard
      title="Missions"
      tail={
        <Link href={CIRCLEIN_REWARDS_URL} target="_blank">
          Details
        </Link>
      }
    >
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
