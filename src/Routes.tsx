import React from 'react';
import { useSelector } from 'react-redux';
import HudRoutes from './HudRoutes';
import BrowserRoutes from './BrowserRoutes';
import { CampaignState } from './reducers/campaign';

const Routes = () => {
  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  if (isHud) {
    return <HudRoutes />;
  }

  return <BrowserRoutes />;
};

export default Routes;
