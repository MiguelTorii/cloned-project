import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpin from '../../components/LoadingSpin/LoadingSpin';
import { getCampaign } from '../../api/campaign';
import Chat from '../Chat/Chat';
import ChatPage from '../CommunityChat/ChatPage';
import { SWITCH_CHAT_CAMPAIGN } from '../../constants/campaigns';
import FullScreenLoader from '../../components/FullScreenLoader/FullScreenLoader';

const MainChat = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const campaignData = useSelector((state) => (state as any).campaign);
  const viewedOnboarding = useSelector((state) => (state as any).user.syncData.viewedOnboarding);
  useEffect(() => {
    setManualLoading(true);
    const timeoutId = setTimeout(() => {
      setManualLoading(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const aCampaign = await getCampaign({
        campaignId: SWITCH_CHAT_CAMPAIGN
      });
      setCampaign(aCampaign);
      setLoading(false);
    };

    init();
  }, []);
  const renderChat = useCallback(
    () => (!!campaign && !campaign?.is_disabled ? <ChatPage /> : <Chat />),
    [campaign]
  );

  // This is to show full screen loader only once.
  // So we check if a student has viewed onboarding popup.
  if (campaignData.chatLanding && !viewedOnboarding && manualLoading) {
    return <FullScreenLoader />;
  }

  return loading ? <LoadingSpin /> : renderChat();
};

export default MainChat;
