import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// import { Avatar as MuiAvatar } from '@material-ui/core';
import FullScreenLoader from '../../components/FullScreenLoader/FullScreenLoader';
import Avatar from '../../components/Avatar/Avatar';
import avatarImg from '../../assets/img/circlein-web-notification.png';

const HudAvatar = () => {
  const campaignData = useSelector((state) => (state as any).campaign);
  //   const [loading, setLoading] = useState(false);
  //   const [manualLoading, setManualLoading] = useState(false);
  //   const viewedOnboarding = useSelector((state) => (state as any).user.syncData.viewedOnboarding);
  //   useEffect(() => {
  //     setManualLoading(true);
  //     const timeoutId = setTimeout(() => {
  //       setManualLoading(false);
  //     }, 5000);
  //     return () => clearTimeout(timeoutId);
  //   }, []);
  //   useEffect(() => {
  //     const init = async () => {
  //       setLoading(true);
  //       const aCampaign = await getCampaign({
  //         campaignId: SWITCH_CHAT_CAMPAIGN
  //       });
  //       setCampaign(aCampaign);
  //       setLoading(false);
  //     };

  //     init();
  //   }, []);

  //   // This is to show full screen loader only once.
  //   // So we check if a student has viewed onboarding popup.
  //   if (campaignData.chatLanding && !viewedOnboarding && manualLoading) {
  //     return <FullScreenLoader />;
  //   }
  return <Avatar alt="hud-avatar" src={avatarImg} />;
};

export default HudAvatar;
