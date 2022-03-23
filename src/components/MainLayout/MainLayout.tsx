/* eslint-disable no-unused-expressions */
import React, { memo, useCallback, useMemo, useState } from 'react';

import classNames from 'classnames';
import clsx from 'clsx';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withWidth from '@material-ui/core/withWidth';
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from '@material-ui/icons/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { URL } from 'constants/navigation';

import { ReactComponent as IconChat } from 'assets/svg/chat.svg';
import logo from 'assets/svg/circlein_logo.svg';
import { ReactComponent as IconHome } from 'assets/svg/home.svg';
import Avatar from 'components/Avatar';
import GiveFeedback from 'containers/GiveFeedback/GiveFeedback';
import QuickNotes from 'containers/QuickNotes/QuickNotes';
import UserDialog from 'containers/UserDialog/UserDialog';

import { styles } from '../_styles/MainLayout/index';
import Dialog from '../Dialog/Dialog';
import GetAppDialog from '../GetAppDialog/GetAppDialog';
import GetStudentJob from '../GetStudentJob/GetAppDialog';
import HowDoIEarnPoints from '../HowDoIEarnPoints/HowDoIEarnPoints';
import UseCases from '../UseCases/UseCases';

import CreatePostMenu from './CreatePostMenu';
import './currentRoute.css';
import DrawerMenu from './Drawer';
import MobileMenu from './MobileMenu';
import TopMenu from './TopMenu';

const MyLink = React.forwardRef<any, any>(({ link, ...props }, ref) => {
  if (
    ![
      '/',
      '/feed',
      '/create/notes',
      '/create/sharelink',
      '/create/question',
      '/create/flashcards'
    ].includes(window.location.pathname)
  ) {
    document.title = 'CircleIn';
  }

  return <RouterLink to={link} {...props} ref={ref} />;
});

type Props = {
  classes?: Record<string, any>;
  width?: string;
  userId?: string;
  email?: string;
  initials?: string;
  userProfileUrl?: string;
  children?: any;
  unreadCount?: number;
  unreadMessages?: number;
  pathname?: string;
  handleNotificationOpen?: (...args: Array<any>) => any;
  handleSignOut?: (...args: Array<any>) => any;
  onManageClasses?: (...args: Array<any>) => any;
  userClasses?: Record<string, any>;
  onManageBlockedUsers?: (...args: Array<any>) => any;
  onOpenReferralStatus?: (...args: Array<any>) => any;
  location?: {
    search: string;
  };
  expertMode?: boolean;
  isExpert?: boolean;
  announcementData?: Record<string, any> | null | undefined;
  toggleExpertMode?: (...args: Array<any>) => any;
  fullName?: string;
  bannerHeight?: number;
};

const MainLayout = ({
  classes,
  announcementData,
  width,
  userId,
  fullName,
  email,
  expertMode,
  isExpert,
  bannerHeight,
  toggleExpertMode,
  initials,
  userProfileUrl,
  children,
  unreadCount,
  unreadMessages,
  pathname,
  handleNotificationOpen,
  handleSignOut,
  onManageClasses,
  userClasses,
  onManageBlockedUsers,
  onOpenReferralStatus,
  location: { search }
}: Props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [createPostAnchorEl, setCreatePostAnchorEl] = useState(null);
  const [openGetApp, setOpenGetApp] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openHowEarnPoints, setOpenHowEarnPoints] = useState(false);
  const [openUseCases, setOpenUseCases] = useState(false);
  const [openStudentJobs, setOpenStudentJobs] = useState(false);
  const handleAnnouncementLoaded = useCallback(() => {}, []);
  const handleOpenWidget = useCallback(() => {
    (window as any)?.FreshworksWidget('identify', 'ticketForm', {
      name: fullName,
      email
    });
    (window as any)?.FreshworksWidget('open');
  }, [email, fullName]);
  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, []);
  const handleProfileMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMobileMenuOpen = useCallback((event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  }, []);
  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null);
  }, []);
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    handleMobileMenuClose();
  }, [handleMobileMenuClose]);
  const handleCreatePostMenuClose = useCallback(() => {
    setCreatePostAnchorEl(null);
  }, []);
  const handleNotificationOpenCur = useCallback(
    (event) => {
      handleNotificationOpen(event);
      handleMobileMenuClose();
      handleMenuClose();
    },
    [handleMenuClose, handleMobileMenuClose, handleNotificationOpen]
  );
  const handleSignOutCur = useCallback(() => {
    handleSignOut();
    handleMobileMenuClose();
    handleMenuClose();
  }, [handleMenuClose, handleMobileMenuClose, handleSignOut]);
  const handleManageClasses = useCallback(() => {
    handleMenuClose();
    onManageClasses();
  }, [handleMenuClose, onManageClasses]);
  const handleBlockedUsers = useCallback(() => {
    handleMenuClose();
    onManageBlockedUsers();
  }, [handleMenuClose, onManageBlockedUsers]);
  const handleOpenGetApp = useCallback(() => {
    setOpenGetApp(true);
    handleMenuClose();
  }, [handleMenuClose]);
  const handleCloseGetApp = useCallback(() => {
    setOpenGetApp(false);
  }, []);
  const handleOpenFeedback = useCallback(() => {
    setOpenFeedback(true);
    handleMenuClose();
  }, [handleMenuClose]);
  const handleCloseFeedback = useCallback(() => {
    setOpenFeedback(false);
  }, []);
  const handleOpenHowEarnPoints = useCallback(() => {
    if (!expertMode) {
      window.open('https://support.circleinapp.com/', '_blank');
    } else {
      window.open('https://tutors.circleinapp.com/home', '_blank');
    }
    handleMenuClose();
  }, [expertMode, handleMenuClose]);
  const handleCloseHowEarnPoints = useCallback(() => {
    setOpenHowEarnPoints(false);
  }, []);
  const handleCloseStudentJobs = useCallback(() => {
    setOpenStudentJobs(false);
  }, []);
  const handleCloseUseCases = useCallback(() => {
    setOpenUseCases(false);
  }, []);
  const handleGoHome = useCallback(() => {
    dispatch(push('/home'));
  }, [dispatch]);
  const isMenuOpen = useMemo(() => Boolean(anchorEl), [anchorEl]);
  const isMobileMenuOpen = useMemo(() => Boolean(mobileMoreAnchorEl), [mobileMoreAnchorEl]);
  const isCreatePostMenuOpen = useMemo(() => Boolean(createPostAnchorEl), [createPostAnchorEl]);
  const renderMenu = useMemo(
    () => (
      <TopMenu
        anchorEl={anchorEl}
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
        handleBlockedUsers={handleBlockedUsers}
        handleOpenHowEarnPoints={handleOpenHowEarnPoints}
        expertMode={expertMode}
        MyLink={MyLink}
        userId={userId}
        handleSignOut={handleSignOutCur}
        search={search}
      />
    ),
    [
      anchorEl,
      handleBlockedUsers,
      handleMenuClose,
      handleSignOutCur,
      handleOpenHowEarnPoints,
      expertMode,
      isMenuOpen,
      search,
      userId
    ]
  );
  const renderMobileMenu = useMemo(
    () => (
      <MobileMenu
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        MyLink={MyLink}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        handleNotificationOpen={handleNotificationOpenCur}
        open={open}
        unreadMessages={unreadMessages}
        width={width}
        unreadCount={unreadCount}
        handleProfileMenuOpen={handleProfileMenuOpen}
        initials={initials}
        userProfileUrl={userProfileUrl}
      />
    ),
    [
      handleMobileMenuClose,
      handleNotificationOpenCur,
      handleProfileMenuOpen,
      initials,
      isMobileMenuOpen,
      mobileMoreAnchorEl,
      open,
      unreadCount,
      unreadMessages,
      userProfileUrl,
      width
    ]
  );
  const renderCreatePostMenu = useMemo(
    () => (
      <CreatePostMenu
        MyLink={MyLink}
        createPostAnchorEl={createPostAnchorEl}
        isCreatePostMenuOpen={isCreatePostMenuOpen}
        search={search}
        handleCreatePostMenuClose={handleCreatePostMenuClose}
      />
    ),
    [createPostAnchorEl, handleCreatePostMenuClose, isCreatePostMenuOpen, search]
  );
  const appBarHeight = useMemo(
    () => (announcementData ? bannerHeight + 68 : 68),
    [announcementData, bannerHeight, pathname]
  );
  const drawer = useMemo(
    () => (
      <DrawerMenu
        expertMode={expertMode}
        isExpert={isExpert}
        toggleExpertMode={toggleExpertMode}
        appBarHeight={appBarHeight}
        userId={userId}
        initials={initials}
        fullName={fullName}
        userProfileUrl={userProfileUrl}
        handleOpenGetApp={handleOpenGetApp}
        handleOpenFeedback={handleOpenFeedback}
        MyLink={MyLink}
        search={search}
        pathname={pathname}
        handleManageClasses={handleManageClasses}
      />
    ),
    [
      appBarHeight,
      expertMode,
      fullName,
      handleManageClasses,
      handleOpenFeedback,
      handleOpenGetApp,
      initials,
      isExpert,
      pathname,
      search,
      toggleExpertMode,
      userId,
      userProfileUrl
    ]
  );
  return (
    <>
      <div className={clsx(classes.root, pathname.indexOf(URL.CHAT) === -1 && classes.marginChat)}>
        <UserDialog />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar disableGutters={!open}>
            <Hidden smUp implementation="css">
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={handleDrawerOpen}
                className={classNames(classes.menuButton, {
                  [classes.hide]: open
                })}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Link href="/home" component={MyLink} link="/home">
              <img src={logo} alt="Logo" className={classes.logo} />
            </Link>
            {expertMode && <Typography className={classes.expertChip}>EXPERT MODE</Typography>}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton onClick={handleGoHome}>
                <IconHome />
              </IconButton>
              <IconButton color="inherit" component={MyLink} link="/chat">
                <Badge badgeContent={unreadMessages} color="secondary">
                  <IconChat />
                </Badge>
              </IconButton>
              <QuickNotes />
              <IconButton
                color="inherit"
                onClick={handleNotificationOpenCur}
                aria-owns={open ? 'notifications-popper' : undefined}
                aria-haspopup="true"
              >
                <Badge badgeContent={unreadCount} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={handleOpenWidget} aria-haspopup="true">
                <HelpIcon />
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                id="avatar-menu"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar profileImage={userProfileUrl} initials={initials} fromChat />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
        {renderCreatePostMenu}
        <Hidden smUp implementation="css">
          <Drawer
            id="mobileMenu"
            variant="temporary"
            open={open && width === 'xs'}
            onClose={handleDrawerClose}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        {/^(?!\/chat)/.test(pathname) && (
          <Hidden xsDown implementation="css">
            <Drawer
              id="desktopMenu"
              variant="permanent"
              className={classNames(classes.drawer, classes.drawerOpen)}
              classes={{
                paper: classNames(classes.drawerOpen)
              }}
              open={open}
            >
              {drawer}
            </Drawer>
          </Hidden>
        )}
        <main
          className={classes.content}
          style={{
            marginTop: appBarHeight
          }}
        >
          {children}
        </main>
      </div>
      <GetAppDialog open={openGetApp} onClose={handleCloseGetApp} />
      <GetStudentJob open={openStudentJobs} onClose={handleCloseStudentJobs} />
      <GiveFeedback origin="Side Menu" open={openFeedback} onClose={handleCloseFeedback} />
      <HowDoIEarnPoints open={openHowEarnPoints} onClose={handleCloseHowEarnPoints} />
      <Dialog
        open={openUseCases}
        onCancel={handleCloseUseCases}
        title="How to use CircleIn for Studying"
      >
        <UseCases onRedirect={handleCloseUseCases} />
      </Dialog>
    </>
  );
};

export default memo(withStyles(styles as any)(withWidth()(withRouter(MainLayout))));
