import React, { useState, useEffect, useCallback } from 'react';
import LoadingSpin from 'components/LoadingSpin';
import { getCampaign } from 'api/campaign';
import Chat from 'containers/Chat';
import CommunityChat from 'containers/CommunityChat';
import { SWITCH_CHAT_CAMPAIGN } from 'constants/campaigns';
import FullScreenLoader from '../../components/FullScreenLoader';
import { useSelector } from 'react-redux';

const MainChat = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(true);
  const campaignData = useSelector((state) => state.campaign);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setManualLoading(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

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

  if (campaignData.chatLanding && manualLoading) {
    return <FullScreenLoader />;
  }

  return loading ? <LoadingSpin /> : renderChat();
};

export default MainChat;
