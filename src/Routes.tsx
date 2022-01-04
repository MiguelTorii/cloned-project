import React from 'react';
import { useSelector } from 'react-redux';
import HudRoutes from './HudRoutes';
import BrowserRoutes from './BrowserRoutes';
import { CampaignState } from './reducers/campaign';
import UnauthenticatedRoutes from './UnauthenticatedRoutes';

const Routes = () => {
  const isHud: boolean | null = useSelector(
    (state: { campaign: CampaignState }) => state.campaign.hud
  );

  if (isHud) {
    return <HudRoutes />;
  }

  if (isHud === false) {
    return <BrowserRoutes />;
  }

  return <UnauthenticatedRoutes />;
};

export default Routes;
