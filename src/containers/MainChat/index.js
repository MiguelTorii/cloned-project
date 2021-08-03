import React, { useState, useEffect, useCallback } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getCampaign } from 'api/campaign';
import Chat from 'containers/Chat';
import CommunityChat from 'containers/CommunityChat';
import { SWITCH_CHAT_CAMPAIGN } from 'constants/campaigns';

const MainChat = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const aCampaign = await getCampaign({ campaignId: SWITCH_CHAT_CAMPAIGN });
      setCampaign(aCampaign);
      setLoading(false);
    };

    init();
  }, []);

  const renderChat = useCallback(
    () => (!!campaign && !campaign?.is_disabled ? <CommunityChat /> : <Chat />),
    [campaign]
  );

  return loading ? <CircularProgress size={20} /> : renderChat();
};

export default MainChat;
