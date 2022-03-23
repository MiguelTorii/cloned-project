import { CAMPAIGN_NAMES } from 'constants/common';

import { useAppSelector } from 'redux/store';

type CampaignsData = {
  isInviteFriendsActive: boolean;
  isRewardsCampaignActive: boolean;
};

const useCampaigns = (): CampaignsData => {
  const campaignsByName = useAppSelector((state) => state.user.campaignsByName);

  return {
    isInviteFriendsActive: Boolean(campaignsByName[CAMPAIGN_NAMES.INVITE_FRIENDS]?.is_active),
    isRewardsCampaignActive: Boolean(campaignsByName[CAMPAIGN_NAMES.REWARDS]?.is_active)
  };
};

export default useCampaigns;
