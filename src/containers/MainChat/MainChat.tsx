import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatPage from '../CommunityChat/ChatPage';
import FullScreenLoader from '../../components/FullScreenLoader/FullScreenLoader';

const MainChat = () => {
  const [manualLoading, setManualLoading] = useState(false);
  const campaignData = useSelector((state) => (state as any).campaign);
  const viewedOnboarding = useSelector((state) => (state as any).user.syncData.viewedOnboarding);

  // TODO Is this performance hindrance needed?
  useEffect(() => {
    setManualLoading(true);
    const timeoutId = setTimeout(() => {
      setManualLoading(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  // This is to show full screen loader only once.
  // So we check if a student has viewed onboarding popup.
  if (campaignData.chatLanding && !viewedOnboarding && manualLoading) {
    return <FullScreenLoader />;
  }

  return <ChatPage />;
};

export default MainChat;
