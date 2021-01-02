// @flow
import React, { useMemo, memo, Fragment, useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import ChatIcon from '@material-ui/icons/Chat';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import DrawerMenu from 'components/MainLayout/Drawer'
import CreatePostMenu from 'components/MainLayout/CreatePostMenu'
import MobileMenu from 'components/MainLayout/MobileMenu'
import TopMenu from 'components/MainLayout/TopMenu'
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography'
import NotificationsIcon from '@material-ui/icons/Notifications';
import UserDialog from 'containers/UserDialog'
import MoreIcon from '@material-ui/icons/MoreVert';
import clsx from 'clsx'
import GetAppDialog from 'components/GetAppDialog';
import { withRouter } from 'react-router';
import QuickNotes from 'containers/QuickNotes'
import logo from '../../assets/svg/circlein_logo.svg';
import './currentRoute.css'
import UseCases from '../UseCases';
import Dialog from '../Dialog';
import HowDoIEarnPoints from '../HowDoIEarnPoints';
import GiveFeedback from '../../containers/GiveFeedback'
import Tooltip from '../../containers/Tooltip';
import { AnnouncementBanner } from '../../containers/Announcements';

const MyLink = React.forwardRef(({ link, ...props }, ref) => {
  if (![
    '/feed',
    '/create/notes',
    '/create/sharelink',
    '/create/question',
    '/create/flashcards'
  ].includes(window.location.pathname)) document.title = 'CircleIn'
  return <RouterLink to={link} {...props} ref={ref} />
});

const drawerWidth = 280;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  marginChat: {
    margin: theme.spacing()
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: 12,
    }
  },
  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  sectionMobile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  logo: {
    maxWidth: 160,
    paddingLeft: theme.spacing(2)
  },
  hide: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.circleIn.palette.primaryBackground,
  },
  drawerOpen: {
    backgroundColor: theme.circleIn.palette.primaryBackground,
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    }
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    width: '75%',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(8)
    }
  },

  myClasses: {
    display: 'flex',
    marginLeft: 16,
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 16,
  },
  backContainer: {
    cursor: 'pointer'
  },
  expertChip: {
    color: theme.circleIn.palette.darkActionBlue,
    fontWeight: 'bold',
    backgroundColor: theme.circleIn.palette.textOffwhite,
    borderRadius: theme.spacing(2),
    marginLeft: theme.spacing(),
    padding: theme.spacing(0, 1)
  }
});

type Props = {
  classes: Object,
  helpLink: string,
  width: string,
  userId: string,
  initials: string,
  userProfileUrl: string,
  children: any,
  newNotesScreen: boolean,
  unreadCount: number,
  unreadMessages: number,
  pathname: string,
  handleNotificationOpen: Function,
  handleSignOut: Function,
  onManageClasses: Function,
  userClasses: Object,
  onManageBlockedUsers: Function,
  newClassExperience: boolean,
  onOpenReferralStatus: Function,
  landingPageCampaign: boolean,
  updateFeed: Function,
  location: {
    search: string
  },
  expertMode: boolean,
  isExpert: boolean,
  announcementData: ?Object,
  toggleExpertMode: Function
};

const MainLayout = ({
  classes,
  announcementData,
  helpLink,
  width,
  userId,
  expertMode,
  isExpert,
  toggleExpertMode,
  initials,
  newNotesScreen,
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
  newClassExperience,
  landingPageCampaign,
  onOpenReferralStatus,
  updateFeed,
  location: {
    search
  }
}: Props) => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)
  const [createPostAnchorEl, setCreatePostAnchorEl] = useState(null)
  const [openGetApp, setOpenGetApp] = useState(false)
  const [openFeedback, setOpenFeedback] = useState(false)
  const [openHowEarnPoints, setOpenHowEarnPoints] = useState(false)
  const [openUseCases, setOpenUseCases] = useState(false)
  const [createPostOpen, setCreatePostOpen] = useState(false)
  const appBarRef = useRef()


  const handleAnnouncementLoaded = useCallback(() => {
  }, [])

  const handleDrawerOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleProfileMenuOpen = useCallback(event => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleMobileMenuOpen = useCallback(event => {
    setMobileMoreAnchorEl(event.currentTarget)
  }, [])

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null)
  }, [])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
    handleMobileMenuClose();
  }, [handleMobileMenuClose])

  const handleCreatePostMenuOpen = useCallback(event => {
    setCreatePostAnchorEl(event.currentTarget)
    setCreatePostOpen(true)
  }, [])

  const handleCreatePostMenuClose = useCallback(() => {
    setCreatePostAnchorEl(null)
    setCreatePostOpen(false)
  }, [])

  const handleNotificationOpenCur = useCallback(event => {
    handleNotificationOpen(event);
    handleMobileMenuClose();
    handleMenuClose();
  }, [handleMenuClose, handleMobileMenuClose, handleNotificationOpen])

  const handleSignOutCur = useCallback(() => {
    handleSignOut();
    handleMobileMenuClose();
    handleMenuClose();
  }, [handleMenuClose, handleMobileMenuClose, handleSignOut])

  const handleManageClasses = useCallback(() => {
    handleMenuClose();
    onManageClasses();
  }, [handleMenuClose, onManageClasses])

  const handleOpenReferralStatus = useCallback(() => {
    handleMenuClose();
    onOpenReferralStatus();
  }, [handleMenuClose, onOpenReferralStatus])

  const handleBlockedUsers = useCallback(() => {
    handleMenuClose();
    onManageBlockedUsers();
  }, [handleMenuClose, onManageBlockedUsers])

  const handleOpenGetApp = useCallback(() => {
    setOpenGetApp(true)
    handleMenuClose();
  }, [handleMenuClose])

  const handleCloseGetApp = useCallback(() => {
    setOpenGetApp(false)
  }, [])

  const handleOpenFeedback = useCallback(() => {
    setOpenFeedback(true)
    handleMenuClose();
  }, [handleMenuClose])

  const handleCloseFeedback = useCallback(() => {
    setOpenFeedback(false)
  }, [])

  const handleOpenHowEarnPoints = useCallback(() => {
    if (helpLink) {
      window.open(helpLink, '_blank')
    } else {
      setOpenHowEarnPoints(true)
      handleMenuClose();
    }
  }, [handleMenuClose, helpLink])

  const handleCloseHowEarnPoints = useCallback(() => {
    setOpenHowEarnPoints(false)
  }, [])

  const handleOpenUseCases = useCallback(() => {
    setOpenUseCases(true)
    handleMenuClose();
  }, [handleMenuClose])

  const handleCloseUseCases = useCallback(() => {
    setOpenUseCases(false)
  }, [])

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isCreatePostMenuOpen = Boolean(createPostAnchorEl);

  const renderMenu = (
    <TopMenu
      anchorEl={anchorEl}
      isMenuOpen={isMenuOpen}
      handleMenuClose={handleMenuClose}
      handleBlockedUsers={handleBlockedUsers}
      handleOpenReferralStatus={handleOpenReferralStatus}
      handleManageClasses={handleManageClasses}
      userClasses={userClasses}
      MyLink={MyLink}
      userId={userId}
      handleSignOut={handleSignOutCur}
      search={search}
    />
  );

  const renderMobileMenu = (
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
  );

  const renderCreatePostMenu = (
    <CreatePostMenu
      MyLink={MyLink}
      createPostAnchorEl={createPostAnchorEl}
      isCreatePostMenuOpen={isCreatePostMenuOpen}
      search={search}
      handleCreatePostMenuClose={handleCreatePostMenuClose}
    />
  )

  const appBarHeight = useMemo(() => (
    announcementData ? 120 : 62
  ), [announcementData])

  const drawer = (
    <DrawerMenu
      expertMode={expertMode}
      isExpert={isExpert}
      toggleExpertMode={toggleExpertMode}
      handleCreatePostMenuOpen={handleCreatePostMenuOpen}
      appBarHeight={appBarHeight}
      updateFeed={updateFeed}
      newNotesScreen={newNotesScreen}
      newClassExperience={newClassExperience}
      userId={userId}
      createPostOpen={createPostOpen}
      handleOpenGetApp={handleOpenGetApp}
      handleOpenFeedback={handleOpenFeedback}
      MyLink={MyLink}
      search={search}
      pathname={pathname}
      handleManageClasses={handleManageClasses}
      handleOpenUseCases={handleOpenUseCases}
      handleOpenHowEarnPoints={handleOpenHowEarnPoints}
      landingPageCampaign={landingPageCampaign}
      userClasses={userClasses}
    />
  )

  return (
    <Fragment>
      <div className={clsx(classes.root, pathname !== '/chat' && classes.marginChat)}>
        <UserDialog />
        <AppBar
          ref={appBarRef}
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
            <Link href="/" component={MyLink} link="/">
              <img src={logo} alt="Logo" className={classes.logo} />
            </Link>
            {expertMode && (
              <Typography className={classes.expertChip}>
                EXPERT MODE
              </Typography>
            )}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
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
              <Tooltip
                id={3292}
                placement="left"
                text="Setup a group chat with your class to connect on topics and discuss problems"
              >
                <IconButton
                  color="inherit"
                  component={MyLink}
                  link='/chat'
                >
                  <Badge badgeContent={unreadMessages} color="secondary">
                    <ChatIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                id='avatar-menu'
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar className='avatar-menu' src={userProfileUrl}>{initials}</Avatar>
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
          <AnnouncementBanner onLoaded={handleAnnouncementLoaded} />
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
        {renderCreatePostMenu}
        <Hidden smUp implementation="css">
          <Drawer
            id='mobileMenu'
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
        {pathname !== '/chat' && <Hidden xsDown implementation="css">
          <Drawer
            id='desktopMenu'
            variant="permanent"
            className={classNames(
              classes.drawer,
              classes.drawerOpen,
            )}
            classes={{
              paper: classNames(
                classes.drawerOpen
              )
            }}
            open={open}
          >
            {drawer}
          </Drawer>
        </Hidden>}
        <main className={classes.content} style={{
          marginTop: appBarRef.current?.clientHeight || 0
        }}>
          {children}
        </main>
      </div>
      <GetAppDialog
        open={openGetApp}
        onClose={handleCloseGetApp}
      />
      <GiveFeedback
        origin='Side Menu'
        open={openFeedback}
        onClose={handleCloseFeedback}
      />
      <HowDoIEarnPoints
        open={openHowEarnPoints}
        onClose={handleCloseHowEarnPoints}
      />
      <Dialog
        open={openUseCases}
        onCancel={handleCloseUseCases}
        title="How to use CircleIn for Studying"
      >
        <UseCases onRedirect={handleCloseUseCases} landingPageCampaign={landingPageCampaign} />
      </Dialog>
    </Fragment>
  );
}

// MainLayout.whyDidYouRender= true
export default memo(withStyles(styles)(withWidth()(withRouter(MainLayout))));
