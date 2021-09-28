import React, { useMemo, useState, useCallback } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { push as routePush } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import AddRemoveClasses from '../../components/AddRemoveClasses/AddRemoveClasses';
import Dialog, { dialogStyle } from '../../components/Dialog/Dialog';
import ReferralStatus from '../Referrals/Status';
import { getInitials } from '../../utils/chat';
import * as userActions from '../../actions/user';
import MainLayout from '../../components/MainLayout/MainLayout';
import type { State as StoreState } from '../../types/state';
import type { UserState } from '../../reducers/user';
import type { CampaignState } from '../../reducers/campaign';
import * as signInActions from '../../actions/sign-in';
import * as chatActions from '../../actions/chat';
import Notifications from '../Notifications/Feed';
import BlockedUsersManager from '../BlockedUsersManager/BlockedUsersManager';
import WebNotifications from '../WebNotifications/WebNotification';
import RequestClass from '../RequestClass/RequestClass';
import BottomNav from '../../components/BottomNav/BottomNav';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Notifier from '../Notifier/Notifier';
import * as notificationsActions from '../../actions/notifications';
import * as feedActions from '../../actions/feed';

const styles = (theme) => ({
  loader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  },
  dialog: { ...dialogStyle, width: 500 }
});

type Props = {
  classes?: Record<string, any>;
  children?: any;
  user?: UserState;
  chat?: any;
  campaign?: CampaignState;
  isNaked?: boolean;
  location?: {
    pathname: string;
  };
  signOut?: (...args: Array<any>) => any;
  fetchFeed?: (...args: Array<any>) => any;
  toggleExpertMode?: any;
  updateFilter?: (...args: Array<any>) => any;
  push?: (...args: Array<any>) => any;
  setBannerHeight?: (...args: Array<any>) => any;
  setOneTouchSend?: (...args: Array<any>) => any;
};

const Layout = ({
  classes,
  children,
  user,
  chat,
  campaign,
  isNaked = false,
  location: { pathname },
  signOut,
  fetchFeed,
  toggleExpertMode,
  updateFilter,
  push,
  setBannerHeight,
  setOneTouchSend
}: Props) => {
  const [manageClasses, setManageClasses] = useState(false);
  const [manageBlockedUsers, setManageBlockedUsers] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openRequestClass, setOpenRequestClass] = useState(false);
  const [referralStatus, setRefererralStatus] = useState(false);
  const handleNotificationOpen = useCallback((event) => {
    const { currentTarget } = event;
    setAnchorEl(currentTarget);
  }, []);
  const handleNotificationClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleOpenManageClasses = useCallback(() => {
    setManageClasses(true);
  }, []);
  const handleOpenBlockedUsers = useCallback(() => {
    setManageBlockedUsers(true);
  }, []);
  const handleCloseManageClasses = useCallback(() => {
    fetchFeed();
    setManageClasses(false);
  }, [fetchFeed]);
  const handleCloseManageBlockedUsers = useCallback(() => {
    setManageBlockedUsers(false);
  }, []);
  const handleOpenReferralStatus = useCallback(() => {
    setRefererralStatus(true);
  }, []);
  const handleCloseReferralStatus = useCallback(() => {
    setRefererralStatus(false);
  }, []);
  const handleUpdateUnreadCount = useCallback((unreadCount) => {
    setUnreadCount(unreadCount);
  }, []);
  const handleOpenRequestClass = useCallback(() => {
    handleCloseManageClasses();
    setOpenRequestClass(true);
  }, [handleCloseManageClasses]);
  const handleCloseRequestClass = useCallback(() => {
    setOpenRequestClass(false);
  }, []);
  const handleNotificationClick = useCallback(
    ({ typeId, postId }: { typeId: number; postId: number }) => {
      switch (typeId) {
        case 3:
          push(`/flashcards/${postId}`);
          break;

        case 4:
          push(`/notes/${postId}`);
          break;

        case 5:
          push(`/sharelink/${postId}`);
          break;

        case 6:
          push(`/question/${postId}`);
          break;

        default:
          break;
      }
    },
    [push]
  );
  const renderChildren = useCallback(() => {
    const { data, isLoading } = user;

    if (data.userId && !isLoading) {
      return children;
    }

    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }, [children, classes.loader, user]);
  const {
    data: { userId, firstName, lastName, profileImage, email },
    bannerHeight,
    announcementData,
    runningTour,
    userClasses,
    expertMode,
    isExpert,
    syncData: { viewedOnboarding, helpLink }
  } = user;
  const {
    data: { local }
  } = chat;
  const unreadMessages = useMemo(() => {
    let unreadMessages = 0;
    Object.keys(local).forEach((l) => {
      if (local[l]?.unread) {
        unreadMessages += Number(local[l].unread);
      }
    });
    return unreadMessages;
  }, [local]);
  const name = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
  const initials = useMemo(() => getInitials(name), [name]);
  const updateFeed = useCallback(
    async (sectionId, classId) => {
      await updateFilter({
        field: 'userClasses',
        value: [
          JSON.stringify({
            classId,
            sectionId
          })
        ]
      });
      await fetchFeed();
    },
    [fetchFeed, updateFilter]
  );

  if (campaign.newClassExperience === null || campaign.landingPageCampaign === null) {
    return null;
  }

  if (isNaked) {
    return renderChildren();
  }

  return (
    <>
      <ErrorBoundary>
        <MainLayout
          fullName={name}
          email={email}
          viewedOnboarding={viewedOnboarding}
          bannerHeight={bannerHeight}
          setBannerHeight={setBannerHeight}
          expertMode={expertMode}
          announcementData={announcementData}
          isExpert={isExpert}
          toggleExpertMode={toggleExpertMode}
          helpLink={helpLink}
          unreadMessages={unreadMessages}
          userId={userId}
          runningTour={runningTour}
          landingPageCampaign={campaign.landingPageCampaign}
          newNotesScreen={campaign.newNotesScreen}
          newClassExperience={campaign.newClassExperience}
          initials={initials}
          pushTo={push}
          userProfileUrl={profileImage}
          unreadCount={unreadCount}
          pathname={pathname}
          updateFeed={updateFeed}
          userClasses={userClasses}
          setOneTouchSend={setOneTouchSend}
          handleNotificationOpen={handleNotificationOpen}
          handleSignOut={signOut}
          onManageClasses={handleOpenManageClasses}
          onManageBlockedUsers={handleOpenBlockedUsers}
          onOpenReferralStatus={handleOpenReferralStatus}
        >
          {renderChildren()}
        </MainLayout>
      </ErrorBoundary>
      <Hidden smUp implementation="css">
        <BottomNav />
      </Hidden>
      <ErrorBoundary>
        <Notifications
          anchorEl={anchorEl}
          onClose={handleNotificationClose}
          onUpdateUnreadCount={handleUpdateUnreadCount}
          onClick={handleNotificationClick}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <AddRemoveClasses
          open={manageClasses}
          onClose={handleCloseManageClasses}
          onOpenRequestClass={handleOpenRequestClass}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <BlockedUsersManager open={manageBlockedUsers} onClose={handleCloseManageBlockedUsers} />
      </ErrorBoundary>
      <ErrorBoundary>
        <Dialog
          className={classes.dialog}
          onCancel={handleCloseReferralStatus}
          open={referralStatus}
          title="Referred Classmates Status"
        >
          <ReferralStatus />
        </Dialog>
      </ErrorBoundary>
      <ErrorBoundary>
        <WebNotifications />
      </ErrorBoundary>
      <ErrorBoundary>
        <RequestClass open={openRequestClass} onClose={handleCloseRequestClass} />
      </ErrorBoundary>
      <ErrorBoundary>
        <Notifier />
      </ErrorBoundary>
    </>
  );
};

const mapStateToProps = ({ chat, user, campaign }: StoreState): {} => ({
  user,
  chat,
  campaign
});

const mapDispatchToProps = (dispatch: any): {} =>
  bindActionCreators(
    {
      enqueueSnackbar: notificationsActions.enqueueSnackbar,
      signOut: signInActions.signOut,
      openCreateChatGroup: chatActions.openCreateChatGroup,
      fetchFeed: feedActions.fetchFeed,
      updateFilter: feedActions.updateFilter,
      toggleExpertMode: userActions.toggleExpertMode,
      setBannerHeight: userActions.setBannerHeight,
      setOneTouchSend: chatActions.setOneTouchSend,
      push: routePush
    },
    dispatch
  );

export default connect<{}, {}, Props>(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles as any)(withRouter(Layout)));
